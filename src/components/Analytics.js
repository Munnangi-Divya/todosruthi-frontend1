


import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Analytics() {
  const [stats, setStats] = useState(null);

  // Fetch stats (completed vs pending)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await API.get('/todos/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching analytics:', err.message);
      }
    };

    fetchStats();
  }, []);

  // If no stats yet, show loader or nothing
  if (!stats) return <p>Loading analytics...</p>;

  // Chart data
  const data = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        label: 'Todos',
        data: [stats.completed, stats.pending],
        backgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Todo Analytics' },
    },
  };

  return (
    <div className="analytics">
      <h3>Simple Analytics</h3>
      <Bar data={data} options={options} />
    </div>
  );
}
