import React, { useEffect, useState } from 'react';
import '../Styling/Dashboard/Complete.css';
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';
function CompleteTasks({tasks}) {
  
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Yakin ingin menghapus tugas ini?');
    const token = localStorage.getItem('token')
    axios.delete(`http://localhost:5000/api/tasks/${id}`,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
  };

  useEffect(()=>{
    const token = localStorage.getItem('token')
     axios.get('http://localhost:5000/api/tasks',{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    .then((res)=>{
      setCompletedTasks(res.data)
    })
    .catch((err)=>{
      console.error('Gagal ambil tasks:', err.response?.data || err.message);
    })
  })
  return (
    <div className="completed-container">
      <h1>Tugas Selesai</h1>
      <p>Berikut adalah daftar tugas yang telah diselesaikan.</p>

      <table className="completed-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Tugas</th>
            <th>Deskripsi</th>
            <th>Tenggat Waktu</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {completedTasks.map((task, index) => (
            <tr key={task.id}>
              <td data-label="No">{index + 1}</td>
              <td data-label="Nama Tugas">{task.title}</td>
              <td data-label="description">{task.description}</td>
              <td data-label="Tenggat Waktu">{task.due_date}</td>
              <td data-label="Aksi">
                <button
                  className="action-btn delete"
                  onClick={() => handleDelete(task.id)}
                  title="Hapus"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CompleteTasks;
