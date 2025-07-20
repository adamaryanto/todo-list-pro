import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'


import Login from './Components Auth/Login'
import Registrasi from './Components Auth/Registrasi'

import Dashboard from './Componen Dashboard/Dashboard'
import PendingTasks from './Componen Dashboard/PendingTasks'
import CompleteTasks from './Componen Dashboard/CompleteTasks'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/regis' element={<Registrasi/>}/>
          
          <Route path='/dashboard' element={<Dashboard/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App