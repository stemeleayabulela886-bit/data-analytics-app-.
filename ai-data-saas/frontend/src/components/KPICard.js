import React from 'react';

const KPICard = ({ title, value, trend, isPositive }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-2xl font-black text-gray-800">{value}</h3>
    </div>
    <div className={`mt-4 inline-flex items-center text-[10px] font-bold px-2 py-1 rounded-lg w-fit ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
      {isPositive ? '▲' : '▼'} {trend}% <span className="ml-1 text-gray-400 font-medium">vs prev.</span>
    </div>
  </div>
);

export default KPICard;
