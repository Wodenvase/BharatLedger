import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/shared/Navigation';
import Landing from './pages/Landing';
import Overview from './pages/dashboard/Overview';
import Transactions from './pages/dashboard/Transactions';
import FinancialHealth from './pages/dashboard/FinancialHealth';
import RiskSimulator from './pages/dashboard/RiskSimulator';
import Reports from './pages/dashboard/Reports';
import Profile from './pages/dashboard/Profile';
import { TransactionProvider } from './context/TransactionContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <TransactionProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation isAuthenticated={isAuthenticated} onLogout={handleLogout} />
          
          <Routes>
            <Route path="/" element={<Landing />} />
            
            {/* Dashboard Routes */}
            <Route 
              path="/dashboard" 
              element={
                !isAuthenticated ? (
                  <DashboardLogin onLogin={handleLogin} />
                ) : (
                  <Overview />
                )
              } 
            />
            <Route 
              path="/dashboard/transactions" 
              element={isAuthenticated ? <Transactions /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/dashboard/health" 
              element={isAuthenticated ? <FinancialHealth /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/dashboard/simulator" 
              element={isAuthenticated ? <RiskSimulator /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/dashboard/reports" 
              element={isAuthenticated ? <Reports /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/dashboard/profile" 
              element={isAuthenticated ? <Profile /> : <Navigate to="/dashboard" />} 
            />
          </Routes>
        </div>
      </Router>
    </TransactionProvider>
  );
}

// Simple login component for demo purposes
const DashboardLogin: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome to BharatLedger</h2>
          <p className="mt-2 text-gray-600">Sign in to access your financial dashboard</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              defaultValue="priya.sharma@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              defaultValue="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <button
            onClick={onLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Sign In to Dashboard
          </button>
          
          <p className="text-center text-sm text-gray-600">
            Demo credentials are pre-filled. Click "Sign In" to continue.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;