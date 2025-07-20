import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../Styling/Form Auth/Registrasi.css'
import axios from 'axios'
function Registrasi() {
  const navigate = useNavigate('/')
  const [newEmail,setNewEmail] = useState('')
  const [newPassword,setNewPassword] = useState('')
  const [newUsername,setNewUsername] = useState('')
  const dataAkun = 
    {
      name:newUsername,
      email:newEmail,
      password: newPassword
    }
  
  const onSubmit = (e) =>{
    e.preventDefault()
    axios.post('http://localhost:5000/api/register',dataAkun)
    .then((res)=>{
      alert(res.data.message)
      navigate('/')
    })
    .catch((err)=>{
      alert(err.response.data.message)

    })
  }
  return (
    <div className='wrapperRegistrasi'>
      <form className='formRegistrasi' onSubmit={onSubmit}>
      <h1> Welcome</h1>
          <input type='email' placeholder='youremail@gmail.com' onChange={(e)=> setNewEmail(e.target.value)}/><br/>
          <input type='text' placeholder='username' onChange={((e)=> setNewUsername(e.target.value))}/><br/>
          <input type='password' placeholder='*****' onChange={((e)=> setNewPassword(e.target.value))}/><br/>
          <button>Daftar</button><br/>
          <p >Sudah Punya Akun?<span onClick={()=> navigate('/')}>Login</span></p>
      </form>
    </div>
  )
}

export default Registrasi