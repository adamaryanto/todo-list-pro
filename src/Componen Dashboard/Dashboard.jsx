import React, { useEffect, useState } from 'react';
import '../Styling/Dashboard/Dashboard.css';
import { FaTasks, FaCheckCircle, FaHourglassHalf, FaSmile } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CompleteTasks from './CompleteTasks';
import PendingTasks from './PendingTasks';

function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [username, setUsername] = useState('');
  const [onProgress, setOnProgress] = useState('onProgress');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token) {
      navigate('/');
    }

    axios.get('http://localhost:5000/api/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      setUsername(res.data.name);
    })
    .catch((err) => {
      console.error('Gagal ambil user:', err.response?.data || err.message);
    });

    axios.get('http://localhost:5000/api/tasks', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      setTasks(res.data);
    })
    .catch((err) => {
      console.error('Gagal ambil tasks:', err.response?.data || err.message);
    });
  }, [tasks]);

  const dataDone = tasks.filter(task => task.status === 'completed');
  const dataOnProgress = tasks.filter(task => task.status !== 'completed');

  return (
    <div className="wrapperDashboard">
      {/* Card Sapaan */}
      <div className="greeting-card">
        <div className="greeting-icon">
          <FaSmile size={28} />
        </div>
        <div>
          <h2>Hai, {username} 👋</h2>
          <p>Semoga harimu produktif dan menyenangkan!</p>
          <button  className="btnLogout">Logout</button>
        </div>
      </div>

      {/* Cards Summary */}
      <div className="card-grid">
        <div className="wrapperCard card-blue">
          <FaTasks size={30} />
          <h2>Total Tugas</h2>
          <p>{tasks.length}</p>
        </div>
        <div className="wrapperCard card-green">
          <FaCheckCircle size={30} />
          <h2>Tugas Selesai</h2>
          <p>{dataDone.length}</p>
        </div>
        <div className="wrapperCard card-yellow">
          <FaHourglassHalf size={30} />
          <h2>Belum Selesai</h2>
          <p>{dataOnProgress.length}</p>
        </div>
      </div>

      <div className="test-buttons">
        <button onClick={() => setOnProgress('done')}>Complete</button>
        <button onClick={() => setOnProgress('onProgress')}>Pending</button>
      </div>

      <div className="wrapperTask">
        {onProgress === 'onProgress' ? (
          <PendingTasks tasks={dataOnProgress} />
        ) : (
          <CompleteTasks tasks={dataDone} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
