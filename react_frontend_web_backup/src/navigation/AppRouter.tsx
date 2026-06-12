import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Placeholder for auth module screens
const AuthScreen = () => <div className="p-4 text-center"><h1>Auth Screen (Login)</h1></div>;
const DashboardScreen = () => <div className="p-4 text-center"><h1>Dashboard Screen</h1></div>;

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
