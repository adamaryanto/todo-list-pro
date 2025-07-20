import React, { useState } from 'react'
import '../Styling/Form Auth/Login.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
function Login() {
  const navigate = useNavigate()
  const [newUsername,setNewUsername] = useState('')
  const [newPassword,setNewPassword] = useState('')
  const dataAkun = {
    name: newUsername,
    password: newPassword
  }

  const onLogin = (e)=>{
    e.preventDefault()
    axios.post('http://localhost:5000/api/login', dataAkun)
    .then((ress)=>{
      localStorage.setItem('token', (ress.data.token))
      alert('login berhasil')
      navigate('/dashboard')
    })
    .catch((err)=>{
      alert(err.response.data.message)
    })
    console.log(dataAkun)
  }

  return (
    <div className='wrapperLogin'>
      <form className='formLogin' onSubmit={onLogin}>
      <h1>Welcome Back</h1><br/>
        <input type='text' placeholder='Username' className='username' onChange={(e)=> setNewUsername(e.target.value)}/>
        <br/>
        <input type='password' placeholder='********' onChange={(e)=> setNewPassword(e.target.value)}/><br/>
        <p className='forgotPassword'>Lupa Password?</p><br/>
        <button>Login</button>
        <p >Belum Punya Akun?<span onClick={()=> navigate('/regis')}>Daftar</span></p>
      </form>
    </div>
  )
}

export default Login