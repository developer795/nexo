
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/Login'
import Signup from './pages/Signup'
import Register from './pages/Register'
import EntityRegister from './pages/EntityRegister'
import VerifyEmail from './pages/VerifyEmail'
import ResetPassword from './pages/ResetPassword'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* إنشاء حساب فرد */}
        <Route path="/register" element={<Register />} />

        {/* إنشاء حساب جهة */}
        <Route path="/entity-register" element={<EntityRegister />} />

        {/* التحقق من الإيميل */}
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* إعادة تعيين كلمة المرور */}
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
