import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8000',
})

export default api;

/*const API_URL = 'http://127.0.0.1:8000'; // URL vašeg FastAPI backend servera
export const getConsumptionData = async (buildingId) => {
  try {
    const response = await axios.get(`${API_URL}/consumption/${buildingId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching consumption data:', error);
    throw error;
  }
};

export const getPredictions = async (buildingId, startDate, endDate) => {
  try {
    const response = await axios.get(`${API_URL}/predictions/${buildingId}`, {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching predictions:', error);
    throw error;
  }
};*/