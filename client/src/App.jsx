import { useState, useEffect } from 'react';
import { login, register, activate, getEvents } from './api';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [view, setView] = useState(token ? 'events' : 'login');
  const [form, setForm] = useState({user: '', pass: ''});
  const [regForm, setRegForm] = useState({user: '', pass: ''});
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [activationToken, setActivationToken] = useState('');
  const [activationInput, setActivationInput] = useState('');

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
      setView('events');
    } catch (e) {
      setError('Login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const data = await register(regForm.user, regForm.pass);
      setActivationToken(data.activationToken);
      setView('activate');
    } catch (e) {
      setError('Registration failed');
    }
  };

  const handleActivate = async (e) => {
    e.preventDefault();
    try {
      await activate(activationInput || activationToken);
      setView('login');
    } catch (e) {
      setError('Activation failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setView('login');
  };

  if (view === 'login') {
    return (
      <Container maxWidth="sm" className="login">
        <Typography variant="h4" gutterBottom>Login</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Box component="form" onSubmit={handleLogin} sx={{display:'flex',flexDirection:'column',gap:2}}>
          <TextField label="Username" value={form.user} onChange={e=>setForm({...form,user:e.target.value})} />
          <TextField label="Password" type="password" value={form.pass} onChange={e=>setForm({...form,pass:e.target.value})} />
          <Button variant="contained" type="submit">Login</Button>
        </Box>
        <Button onClick={()=>{setError('');setView('register');}} sx={{mt:2}}>Register</Button>
      </Container>
    );
  }

  if (view === 'register') {
    return (
      <Container maxWidth="sm" className="register">
        <Typography variant="h4" gutterBottom>Register</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Box component="form" onSubmit={handleRegister} sx={{display:'flex',flexDirection:'column',gap:2}}>
          <TextField label="Username" value={regForm.user} onChange={e=>setRegForm({...regForm,user:e.target.value})} />
          <TextField label="Password" type="password" value={regForm.pass} onChange={e=>setRegForm({...regForm,pass:e.target.value})} />
          <Button variant="contained" type="submit">Register</Button>
        </Box>
        <Button onClick={()=>{setError('');setView('login');}} sx={{mt:2}}>Back to Login</Button>
      </Container>
    );
  }

  if (view === 'activate') {
    return (
      <Container maxWidth="sm" className="activate">
        <Typography variant="h4" gutterBottom>Activate Account</Typography>
        <Typography>Your activation token: {activationToken}</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Box component="form" onSubmit={handleActivate} sx={{display:'flex',flexDirection:'column',gap:2,mt:2}}>
          <TextField label="Token" value={activationInput} onChange={e=>setActivationInput(e.target.value)} />
          <Button variant="contained" type="submit">Activate</Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container className="events">
      <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <Typography variant="h4">Events</Typography>
        <Button onClick={logout}>Logout</Button>
      </Box>
      {error && <Typography color="error">{error}</Typography>}
      <ul>
        {events.map(ev => <li key={ev.id}>{ev.title}</li>)}
      </ul>
    </Container>
  );
}

export default App;
