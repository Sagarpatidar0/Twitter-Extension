import React from 'react';
import Login from '../components/login/Login';
import './App.css';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';

function App() {
  return (
    <div id='app'>
      <Navbar/>
      <Login />
      <Footer />
    </div>
  );
}

export default App;
