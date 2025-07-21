import { useState, useEffect } from 'react';
import { login, getEvents } from './api';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [form, setForm] = useState({user:'', pass:''});
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      getEvents(token).then(setEvents).catch(() => setError('Failed to load events'));
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(form.user, form.pass);
      localStorage.setItem('token', data.token);
      setToken(data.token);
    } catch (e) {
      setError('Login failed');
    }
  };

  if (!token) {
    return (
      <div className="login">
        <h2>Login</h2>
        {error && <p>{error}</p>}
        <form onSubmit={handleLogin}>
          <input placeholder="username" value={form.user} onChange={e=>setForm({...form,user:e.target.value})} />
          <input type="password" placeholder="password" value={form.pass} onChange={e=>setForm({...form,pass:e.target.value})} />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="events">
      <h2>Events</h2>
      {error && <p>{error}</p>}
      <ul>
        {events.map(ev => <li key={ev.id}>{ev.title}</li>)}
      </ul>
    </div>
  );
}

export default App;
