
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrafficPoint } from '../types';

interface TrafficChartProps {
  data: TrafficPoint[];
}

const TrafficChart: React.FC<TrafficChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
          <YAxis stroke="#9ca3af" fontSize={12}/>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: '1px solid #374151',
              color: '#f3f4f6'
            }} 
            labelStyle={{ color: '#d1d5db' }}
          />
          <Legend wrapperStyle={{fontSize: "14px"}}/>
          <Line type="monotone" dataKey="in" name="Inbound" stroke="#3b82f6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="out" name="Outbound" stroke="#10b981" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrafficChart;
