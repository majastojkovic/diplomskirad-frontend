
import React from 'react';
import { Link } from 'react-router-dom';


const Home = () => {

 return (
    <div>
      <h1 class="app-title">Aplikacija za praćenje rada toplane</h1>
      <Link to="/predikcija" className="predikcija-link">Odaberite predikciju</Link>
    </div>
  );
};

export default Home;
