import React, { useEffect, useState } from 'react';
import '../Styling/Dashboard/PendingTasks.css';
import { FaCheckCircle, FaTrash } from 'react-icons/fa';
import axios from 'axios';

function PendingTasks() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
  });
  const dataTodos = {
    title: formData.title,
    description: formData.description,
    due_date: formData.due_date,
  }
  const [tasks, setTasks] = useState([]);
  const [pendingTasks,setPendingtasks] = useState([])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(()=>{

    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/tasks',{
       headers: {
      Authorization: `Bearer ${token}`,
    }
    })
    .then((res)=>{
      setTasks(res.data)
    })
    .catch((err)=>{
      console.log(err)
    },[])
  })
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.due_date) {
      alert('Isi semua field!');
      return;
    }
    const token = localStorage.getItem('token');
    axios.post('http://localhost:5000/api/todos',dataTodos,{
       headers: {
      Authorization: `Bearer ${token}`,
    }
    })
    .then((res)=>{
      alert(res.data.message)
    })
    .catch((err)=>{
      const msg = err.response?.data?.message || 'Terjadi Kesalahan';
      alert(msg)
    })
    console.log(dataTodos)
    console.log(tasks)
  };

  const handleComplete = (id) => {
    const token = localStorage.getItem('token')
    axios.put(`http://localhost:5000/api/tasks/${id}`,{},{
      headers:{
        Authorization: `Bearer ${token}`,
      }
    })
    .then((res)=>{
      alert('Tugas diselesaikan!');
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    })
    .catch((err) => {
    console.error(err);
    alert('Gagal menyelesaikan tugas');
  });
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem('token')
    axios.delete(`http://localhost:5000/api/tasks/${id}`,{
      headers:{
        Authorization: `Bearer ${token}`,
      }
    })
  };
   const dataOnProgress = tasks.filter(task => task.status !== 'completed');

  return (
    <div className="tasks-container">
      <h1>Tugas Belum Selesai</h1>
      <p>Berikut adalah daftar tugas yang masih menunggu untuk diselesaikan.</p>

      <form className="task-form" onSubmit={handleAddTask}>
        <input
          type="text"
          name="title"
          placeholder="Nama Tugas"
          value={formData.title}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Deskripsi"
          value={formData.description}
          onChange={handleInputChange}
        />

        <input
          type="date"
          name="due_date"
          value={formData.due_date}
          onChange={handleInputChange}
        />
        <button type="submit" className="btnAdd">Tambah</button>
      </form>

      <table className="tasks-table">
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
  

    {dataOnProgress.map((task, index) => (
      <tr key={task.id}>
      <td data-label="No">{index + 1}</td>
      <td data-label="Nama Tugas">{task.title}</td>
      
      <td data-label="description">{task.description}</td>
      <td data-label="Tenggat Waktu">{task.due_date}</td>
      <td data-label="Aksi">
      <button className="action-btn complete" onClick={() => handleComplete(task.id)}>
      <FaCheckCircle />
      </button>
      <button className="action-btn delete" onClick={() => handleDelete(task.id)}>
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

export default PendingTasks;
