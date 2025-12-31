import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Forecast from './pages/Forecast';
import Analytics from './pages/Analytics';
import Assistant from './pages/Assistant';
import './App.css';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';

function App() {
    return (
        <ThemeProvider>
            <UserProvider>
                <Router>
                    <div className="app">
                        <Navbar />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/forecast" element={<Forecast />} />
                            <Route path="/analytics" element={<Analytics />} />
                            <Route path="/assistant" element={<Assistant />} />
                        </Routes>
                        <Footer />
                    </div>
                </Router>
            </UserProvider>
        </ThemeProvider>
    );
}

export default App;
