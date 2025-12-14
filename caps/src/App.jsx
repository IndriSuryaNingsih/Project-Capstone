import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import DashboardLayout from './components/DashboardLayout.jsx'
import HomePage from './pages/HomePage.jsx'
import ProgressPage from './pages/ProgressPage.jsx'
import AssignmentPage from './pages/AssignmentPage.jsx'
import FocusModePage from './pages/FocusModePage.jsx'
import FocusSettingsPage from './pages/FocusSettingsPage.jsx'
import FeedbackPage from './pages/FeedbackPage.jsx'
import AccountSettingsPage from './pages/AccountSettingsPage.jsx'
import DisplaySettingsPage from './pages/DisplaySettingsPage.jsx'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = window.localStorage.getItem('asah_user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        setUser(null)
      }
    }
  }, [])

  const handleLogin = (payload) => {
    const fakeUser = {
      name: payload.name || 'Student',
      email: payload.email,
    }
    setUser(fakeUser)
    window.localStorage.setItem('asah_user', JSON.stringify(fakeUser))
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('asah_user')
  }

  return (
    <BrowserRouter>
      <Routes>
        {!user && (
          <>
            <Route
              path="/"
              element={<Navigate to="/login" replace />}
            />
            <Route
              path="/login"
              element={<LoginPage onLogin={handleLogin} />}
            />
            <Route
              path="/signup"
              element={<SignupPage onSignup={handleLogin} />}
            />
            <Route
              path="*"
              element={<Navigate to="/login" replace />}
            />
          </>
        )}

        {user && (
          <>
            <Route
              path="/"
              element={<Navigate to="/app/home" replace />}
            />
            <Route
              path="/login"
              element={<Navigate to="/app/home" replace />}
            />
            <Route
              path="/signup"
              element={<Navigate to="/app/home" replace />}
            />
            <Route
              path="/app"
              element={<DashboardLayout user={user} onLogout={handleLogout} />}
            >
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<HomePage user={user} />} />
              <Route path="progress" element={<ProgressPage />} />
              <Route path="assignments" element={<AssignmentPage />} />
              <Route path="focus" element={<FocusModePage />} />
              <Route path="focus-settings" element={<FocusSettingsPage />} />
              <Route path="feedback" element={<FeedbackPage />} />
              <Route path="account" element={<AccountSettingsPage user={user} />} />
              <Route path="display" element={<DisplaySettingsPage />} />
            </Route>
            <Route
              path="*"
              element={<Navigate to="/app/home" replace />}
            />
          </>
        )}
      </Routes>
    </BrowserRouter>
  )
}

export default App
