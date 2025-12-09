import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { apiFetch } from '../api';

function SignupPage({ onSignup }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // EXPECT: backend punya POST /api/auth/signup
      const data = await apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });

      // misal backend juga langsung kirim token + user
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        onSignup?.(data.user);
      }

      navigate('/app/home');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Gagal membuat akun');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Sign up</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Nama lengkap
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama kamu"
            />
          </label>
          <label>
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@student.sch.id"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
            />
          </label>

          {error && (
            <p className="auth-error" style={{ color: '#b23a48', fontSize: '0.8rem' }}>
              {error}
            </p>
          )}

          <div className="auth-actions">
            <button type="submit" className="btn-red full" disabled={loading}>
              {loading ? 'Memproses...' : 'Sign up'}
            </button>
          </div>
        </form>

        <p className="auth-switch">
          Sudah punya akun? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
