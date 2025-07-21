import React from 'react';
import ReactDOM from 'react-dom/client';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [token, setToken] = useState('');
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');

  const login = async () => {
    const res = await axios.post('http://localhost:3001/login', {email: 'demo@example.com', password: 'pass'});
    setToken(res.data.token);
  };

  const loadEvents = async () => {
    const res = await axios.get('http://localhost:3001/events', {headers:{Authorization:`Bearer ${token}`}});
    setEvents(res.data);
  };

  const addEvent = async () => {
    await axios.post('http://localhost:3001/events', {title}, {headers:{Authorization:`Bearer ${token}`}});
    setTitle('');
    loadEvents();
  };

  useEffect(() => { if (token) loadEvents(); }, [token]);

  return (
    <div style={{padding:20}}>
      {!token ? <Button variant="contained" onClick={login}>Login</Button> : (
      <div>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Event"/>
        <Button onClick={addEvent}>Add</Button>
        <ul>
          {events.map(e=><li key={e.id}>{e.title}</li>)}
        </ul>
      </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
