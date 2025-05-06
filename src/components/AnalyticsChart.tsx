
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalyticsData {
  intents: {
    high: number;
    medium: number;
    low: number;
  };
  status: {
    new: number;
    contacted: number;
    qualified: number;
    closed: number;
  };
}

const AnalyticsChart = ({ data }: { data: AnalyticsData }) => {
  const chartData = [
    { name: 'High Intent', value: data.intents.high, color: '#22c55e' },
    { name: 'Medium Intent', value: data.intents.medium, color: '#fbbf24' },
    { name: 'Low Intent', value: data.intents.low, color: '#ef4444' },
    { name: 'New', value: data.status.new, color: '#3b82f6' },
    { name: 'Contacted', value: data.status.contacted, color: '#8b5cf6' },
    { name: 'Qualified', value: data.status.qualified, color: '#10b981' },
    { name: 'Closed', value: data.status.closed, color: '#6366f1' },
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip 
          contentStyle={{ 
            borderRadius: '8px', 
            border: 'none', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)' 
          }} 
        />
        <Bar dataKey="value" fill="#8884d8">
          {chartData.map((entry, index) => (
            <rect key={`rect-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AnalyticsChart;
