
import React from 'react';

interface KPIProps {
  title: string;
  value: string;
}

const KPI: React.FC<KPIProps> = ({ title, value }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col justify-between">
      <h3 className="text-sm font-medium text-gray-400">{title}</h3>
      <p className="text-3xl font-bold text-white mt-2">{value}</p>
    </div>
  );
};

export default KPI;
