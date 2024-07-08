import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'chartjs-adapter-date-fns';
const Predikcija = () => {
    const [notebookUrl, setNotebookUrl] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [predictionsData, setPredictionsData] = useState([]);

    const NotebookUrlInput = ({ notebookUrl, setNotebookUrl }) => {
        const options = [
            { label: 'lamela4', value: 'http://localhost:8888/notebooks/Untitled7.ipynb' },
            { label: 'lamela 8', value: 'http://localhost:8889/notebooks/Untitled7.ipynb' },
            { label: 'lamela 12', value: 'http://localhost:8889/notebooks/Untitled7.ipynb' },
            { label: 'lamela 17', value: 'http://localhost:8889/notebooks/Untitled7.ipynb' },
            { label: 'lamela 22', value: 'http://localhost:8889/notebooks/Untitled7.ipynb' },
        ];
        return (
            <label>
                Odaberi uređaj:
                <input
                    list="notebookUrls"
                    type="text"
                    value={notebookUrl}
                    onChange={(e) => setNotebookUrl(e.target.value)}
                    required
                />
                <datalist id="notebookUrls">
                    {options.map((option, index) => (
                        <option key={index} value={option.value}>{option.label}</option>
                    ))}
                </datalist>
            </label>
        );
    };

    useEffect(() => {
        fetchSavedPredictions();
    }, []);

    const fetchSavedPredictions = async () => {
        try {
          console.log('uslo')
            const response = await fetch('http://127.0.0.1:8000/get_predictions');
            const data = await response.json();
            setPredictionsData(data);
        } catch (error) {
            console.error('Error fetching saved predictions:', error);
        }
    };

    const roundToNearestHour = (datetime) => {
        let date = new Date(datetime);
        let minutes = date.getMinutes();
        if (minutes >= 30) {
            date.setHours(date.getHours() + 1);
        }
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date.toISOString().slice(0, 19);
        console.log(datetime)
      };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const roundedStartDate = roundToNearestHour(startDate);
        const roundedEndDate = roundToNearestHour(endDate);
        console.log(roundedStartDate,roundedEndDate)
        const dateRange = {
            start_date: roundedStartDate,
            end_date: roundedEndDate,
        };

        const requestData = {
            notebook_url: notebookUrl,
            date_range: dateRange,
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/run_notebook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data.result)
            const processedData = processData(data.result, startDate, endDate); // Poziv funkcije processData
            console.log(data.result, startDate, endDate)
            if (processedData) {
                setResult(processedData);
            }
        } catch (error) {
            setError(error.message);
            setResult(null);
        }
    };

    const handleSavePredictions = async () => {
      console.log('ulaza u funkciju')
      console.log(result)
      if (!result || !result.chartData.datasets[0].data) return;

      const { labels } = result.chartData;
      const { data } = result.chartData.datasets[0];

      const predictions = labels.map((time, index) => ({
          time,
          prediction: data[index],
      }));
        console.log('predictions:', predictions);
        console.log('ulaza u funkciju ispred post11')
        try {
          console.log('ulaza u funkciju ispred post')
            const response = await fetch('http://127.0.0.1:8000/save_prediction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(predictions),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errorData)}`);
            }

            await fetchSavedPredictions();
            setError(null);
            console.log('uspesno upamceni podaci')
        } catch (error) {
            setError(error.message);
            console.log('neuspesno upamceni podaci')
        }
    };

    const processData = (predictionsArray, startDate, endDate) => {
        console.log(predictionsArray)
        const dates = [];
        const predictions=[];
        // Pretvaranje datuma i predikcija iz niza u odgovarajući format za grafikon
        const start = new Date(startDate);
        const end = new Date(endDate);
        // Iteracija kroz sve datume od start do end
        let currentDate = new Date(start);
        while (currentDate <= end) {
            dates.push(currentDate.toISOString().slice(0, 19)); // Dodajte u formatu koji vam je potreban
            currentDate.setHours(currentDate.getHours() + 1); // Možete prilagoditi korak ako želite drugačije
        }

        if (typeof predictionsArray === 'string') {
          try {
              const cleanedString = predictionsArray.replace(/[\[\]\n]/g, ' ').trim(); // Ukloni uglaste zagrade i nove redove
              const parsedArray = cleanedString.split(/\s+/).map(parseFloat); // Razdeli po razmacima i parsiraj u brojeve
              predictions.push(...parsedArray);
          } catch (error) {
              console.error('Error parsing predictionsArray string:', error);
          }
      } else if (Array.isArray(predictionsArray)) {
          predictionsArray.forEach(element => {
              if (typeof element === 'string') {
                  const parsedElements = element.split(/\s+/).map(parseFloat); // Razdeli po razmacima i parsiraj u brojeve
                  predictions.push(...parsedElements.filter(num => !isNaN(num)));
              } else if (typeof element === 'number'&& !isNaN(element)) {
                  predictions.push(element); // Ako je element broj, dodaj ga direktno
              }
          });
      }
        // Podaci za grafikon
        const chartData = {
            labels: dates,
            datasets: [
                {
                    label: 'Predikcije',
                    data: predictions,
                    fill: false,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)'
                },
            ],
          
        };
        console.log(dates)
        console.log(chartData)
        console.log(predictions)
        return {chartData };
    };
    let dates = [];
    let predictions = [];
    if (result) {
        dates = result.chartData.labels;
        predictions = result.chartData.datasets[0].data;
    }

    const chartOptions = {
      scales: {
          x: {
              type: 'time',
              time: {
                  unit: 'hour',
                  displayFormats: {
                      hour: 'HH:mm',
                  },
              },
              title: {
                  display: true,
                  text: 'Vreme',
              },
          },
          y: {
              title: {
                  display: true,
                  text: 'Predikcija',
              },
          },
      },
  };
    return (
        <div>
            <h1 class="app-title">Pregled predikcije za odabrani objekat</h1>
            <form onSubmit={handleSubmit} className='form-container'>
                <div>
                    <div>
                        <NotebookUrlInput notebookUrl={notebookUrl} setNotebookUrl={setNotebookUrl} />
                    </div>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <label>
                        Početak predikcije:
                        <input
                            type="datetime-local"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <label>
                        Kraj predikcije:
                        <input
                            type="datetime-local"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button className='button'>Pokreni predikciju</button>
            </form>
            {result &&  (
                <div className="form-container">
                    <h2>Rezultat predikcije:</h2>
                    <Line data={result.chartData} options={chartOptions} /> 
                    <h2>Predikcija koje možete sačuvati:</h2>
                    <table className='table-container'>
                        <thead className="thead">
                            <tr>
                                <th className="th">Vreme</th>
                                <th className="th">Rezultat predikcije</th>
                            </tr>
                        </thead>
                        <tbody>
                          {dates.map((label, index) => (
                            <tr key={index} className="tbody-tr">
                              <td className="tbody-td">{label}</td>
                              <td className="tbody-td">{predictions[index]}</td>
                            </tr>
                          ))}
                          </tbody>  
                    </table>
                    <button onClick={handleSavePredictions} className='button2'>Upamti predikciju</button>
                </div>
            )}
            {error && <p className='error-message'>{error}</p>}
        </div>
    );
};

export default Predikcija;
