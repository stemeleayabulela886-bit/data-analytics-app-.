import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useContext } from 'react';
import { DataContext } from '../context/DataContext';

function AutoChart() {
  const { dashboardData } = useContext(DataContext);

  if (!dashboardData || dashboardData.length === 0) return <p>No data to display</p>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={dashboardData}>
        <XAxis dataKey="Date" /> {/* This matches your healed column name! */}
        <YAxis />
        <Tooltip />
        <Bar dataKey="Revenue" fill="#2563eb" />
      </BarChart>
    </ResponsiveContainer>
  );
}