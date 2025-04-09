
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginForm from './pages/LoginForm'
import RegisterForm from './pages/RegisterForm'
import MainLayout from './Layouts/MainLayout'
import AuthLayout from './Layouts/AuthLayout'

function App() {

  return (
    <BrowserRouter>
      <Routes>

        <Route element={<MainLayout />}>
          <Route path="/" />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
