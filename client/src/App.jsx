import { useState, useEffect } from 'react';
import { login, register, activate, getEvents, createEvent, getMyItems, getMe, updateMe, getSchools, createSchool, getPendingUsers, approveUser, getEventItems, takeItem } from './api';
import { Container, TextField, Button, Typography, Box, AppBar, Toolbar, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import './App.css';

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [view, setView] = useState(token ? 'events' : 'login');
  const [user, setUser] = useState(token ? parseJwt(token) : null);
  const [form, setForm] = useState({user: '', pass: ''});
  const [regForm, setRegForm] = useState({user: '', pass: '', role: 'parent', school: ''});
  const [schools, setSchools] = useState([]);
  const [events, setEvents] = useState([]);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [activationToken, setActivationToken] = useState('');
  const [activationInput, setActivationInput] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [profilePass, setProfilePass] = useState('');
  const [pendingUsers, setPendingUsers] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventItems, setEventItems] = useState([]);

  useEffect(() => {
    if (token) {
      const info = parseJwt(token);
      setUser(info);
      getEvents(token).then(setEvents).catch(() => setError('Failed to load events'));
      getMyItems(token).then(setItems).catch(() => {});
      getMe(token).then(setUser).catch(() => {});
    }
  }, [token]);

  useEffect(() => {
    if (view === 'register' || view === 'schools') {
      getSchools().then(setSchools).catch(() => {});
    }
    if (view === 'approve') {
      getPendingUsers(token).then(setPendingUsers).catch(() => {});
    }
  }, [view, token]);

  useEffect(() => {
    if (view === 'eventDetail' && selectedEvent) {
      getEventItems(selectedEvent.id, token)
        .then(setEventItems)
        .catch(() => {});
    }
  }, [view, selectedEvent, token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(form.user, form.pass);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setView('events');
      const info = parseJwt(data.token);
      setUser(info);
      getEvents(data.token).then(setEvents).catch(()=>{});
      getMyItems(data.token).then(setItems).catch(()=>{});
      getMe(data.token).then(setUser).catch(()=>{});
    } catch {
      setError('Login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const data = await register(regForm.user, regForm.pass, regForm.role, regForm.school);
      setActivationToken(data.activationToken);
      setView('activate');
    } catch {
      setError('Registration failed');
    }
  };

  const handleActivate = async (e) => {
    e.preventDefault();
    try {
      await activate(activationInput || activationToken);
      setView('login');
    } catch {
      setError('Activation failed');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await createEvent(newEventTitle, token);
      setNewEventTitle('');
      getEvents(token).then(setEvents);
      setView('events');
    } catch {
      setError('Create failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setItems([]);
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
          <TextField select SelectProps={{native:true}} label="Rolle" value={regForm.role} onChange={e=>setRegForm({...regForm,role:e.target.value})}>
            <option value="parent">Elternteil</option>
            <option value="teacher">Lehrer</option>
            <option value="leader">Schulleitung</option>
          </TextField>
          <TextField select SelectProps={{native:true}} label="Schule" value={regForm.school} onChange={e=>setRegForm({...regForm,school:e.target.value})}>
            <option value="">-- bitte wählen --</option>
            {schools.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
          </TextField>
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

  const topBar = (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" onClick={()=>setView('events')}>Meine Events</Button>
        {user && ['teacher','admin','leader'].includes(user.role) && (
          <Button color="inherit" onClick={()=>setView('newEvent')}>Neues Event</Button>
        )}
        {user?.role === 'admin' && (
          <Button color="inherit" onClick={()=>setView('schools')}>Schulen</Button>
        )}
        <Button color="inherit" onClick={()=>setView('tasks')}>Meine Aufgaben</Button>
        {user && ['admin','leader'].includes(user.role) && (
          <Button color="inherit" onClick={()=>setView('approve')}>Freischalten</Button>
        )}
        <Box sx={{ml:'auto'}}>
          <Button color="inherit" onClick={()=>setDrawerOpen(true)}>Menü</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );

  const drawer = (
    <Drawer anchor="right" open={drawerOpen} onClose={()=>setDrawerOpen(false)}>
      <Box sx={{width:250}} role="presentation" onClick={()=>setDrawerOpen(false)}>
        <List>
          <ListItem><ListItemText primary={user?`User: ${user.username}`:''} /></ListItem>
          <ListItemButton onClick={()=>setView('profile')}><ListItemText primary="Profil" /></ListItemButton>
          {user?.role === 'admin' && (
            <ListItemButton onClick={()=>setView('schools')}><ListItemText primary="Schulen" /></ListItemButton>
          )}
          {user && ['admin','leader'].includes(user.role) && (
            <ListItemButton onClick={()=>setView('approve')}><ListItemText primary="Freischalten" /></ListItemButton>
          )}
          <ListItemButton onClick={logout}><ListItemText primary="Logout" /></ListItemButton>
        </List>
      </Box>
    </Drawer>
  );

  let content = null;
  if (view === 'events') {
    content = (
      <Box sx={{p:2}}>
        <Typography variant="h5" gutterBottom>Events</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Box sx={{display:'flex',flexDirection:'column',gap:1}}>
          {events.map(ev => (
            <Button key={ev.id} variant="outlined" onClick={() => {setSelectedEvent(ev);setView('eventDetail');}}>
              {ev.title}
            </Button>
          ))}
        </Box>
      </Box>
    );
  } else if (view === 'eventDetail' && selectedEvent) {
    content = (
      <Box sx={{p:2}}>
        <Button onClick={() => setView('events')}>Zurück</Button>
        <Typography variant="h5" gutterBottom>{selectedEvent.title}</Typography>
        <Typography sx={{mb:2}}>Klassenlehrer: {selectedEvent.teacher}</Typography>
        <Typography variant="h6">Todos</Typography>
        <ul>
          {eventItems.map(it => (
            <li key={it.id}>
              {it.description} - Zuständig: {it.taken_by_username || '-'}
              {!it.taken_by && (
                <Button size="small" onClick={() => takeItem(it.id, token).then(() => getEventItems(selectedEvent.id, token).then(setEventItems))}>Übernehmen</Button>
              )}
            </li>
          ))}
        </ul>
      </Box>
    );
  } else if (view === 'newEvent') {
    content = (
      <Box component="form" onSubmit={handleCreateEvent} sx={{display:'flex',flexDirection:'column',gap:2,p:2}}>
        <Typography variant="h5">Neues Event</Typography>
        <TextField label="Titel" value={newEventTitle} onChange={e=>setNewEventTitle(e.target.value)} />
        <Button variant="contained" type="submit">Anlegen</Button>
      </Box>
    );
  } else if (view === 'tasks') {
    content = (
      <Box sx={{p:2}}>
        <Typography variant="h5">Meine Aufgaben</Typography>
        <ul>
          {items.map(it=> <li key={it.id}>{it.description} ({it.event_title})</li>)}
        </ul>
      </Box>
    );
  } else if (view === 'profile') {
    content = (
      <Box component="form" onSubmit={e=>{e.preventDefault();updateMe({password:profilePass},token).catch(()=>setError('update failed'));setProfilePass('');}} sx={{display:'flex',flexDirection:'column',gap:2,p:2}}>
        <Typography variant="h5">Profil</Typography>
        <Typography>Nutzername: {user?.username}</Typography>
        <TextField label="Neues Passwort" type="password" value={profilePass} onChange={e=>setProfilePass(e.target.value)} />
        <Button variant="contained" type="submit">Speichern</Button>
      </Box>
    );
  } else if (view === 'schools' && user?.role === 'admin') {
    content = (
      <Box sx={{p:2}}>
        <Typography variant="h5">Schulen verwalten</Typography>
        <Box component="form" onSubmit={e=>{e.preventDefault();createSchool(newEventTitle, token).then(()=>getSchools().then(setSchools));setNewEventTitle('');}} sx={{display:'flex',gap:2,mb:2}}>
          <TextField label="Neue Schule" value={newEventTitle} onChange={e=>setNewEventTitle(e.target.value)} />
          <Button variant="contained" type="submit">Anlegen</Button>
        </Box>
        <ul>
          {schools.map(s=> <li key={s.id}>{s.name}</li>)}
        </ul>
      </Box>
    );
  } else if (view === 'approve' && user && ['admin','leader'].includes(user.role)) {
    content = (
      <Box sx={{p:2}}>
        <Typography variant="h5">Konten freischalten</Typography>
        <ul>
          {pendingUsers.map(u => (
            <li key={u.id}>
              {u.username} ({u.role})
              <Button size="small" onClick={()=>approveUser(u.id, token).then(()=>getPendingUsers(token).then(setPendingUsers))}>OK</Button>
            </li>
          ))}
        </ul>
      </Box>
    );
  }

  return (
    <Box>
      {topBar}
      {drawer}
      {content}
    </Box>
  );
}

export default App;
