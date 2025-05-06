
import React from 'react';
import Navbar from '@/components/Navbar';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container py-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">LinkedIn Lead Dashboard</h1>
        <Dashboard />
      </div>
    </div>
  );
};

export default Index;
