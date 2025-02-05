
import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletConnectionProvider } from './context/WalletConnectionProvider';
import { Navbar } from './components/layout/Navbar';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { Create } from './pages/Create';
import { NFTDetail } from './pages/NFTDetail';
function App() {
  return (
    <WalletConnectionProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/create" element={<Create />} />
            <Route path="/nft/:id" element={<NFTDetail />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </WalletConnectionProvider>
  );
}
export default App;