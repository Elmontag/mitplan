const API_URL = '/api';

export async function getSchools() {
  const res = await fetch(`${API_URL}/schools`);
  if (!res.ok) throw new Error('failed');
  return res.json();
}

export async function createSchool(name, token) {
  const res = await fetch(`${API_URL}/schools`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name })
  });
  if (!res.ok) throw new Error('failed');
  return res.json();
}

export async function login(username, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username, password})
  });
  if (!res.ok) throw new Error('login failed');
  return res.json();
}

export async function register(username, password, role, schoolId) {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username, password, role, schoolId})
  });
  if (!res.ok) throw new Error('register failed');
  return res.json();
}

export async function activate(token) {
  const res = await fetch(`${API_URL}/activate`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({token})
  });
  if (!res.ok) throw new Error('activate failed');
  return res.json();
}

export async function getEvents(token) {
  const res = await fetch(`${API_URL}/events`, {
    headers: {Authorization: `Bearer ${token}`}
  });
  if (!res.ok) throw new Error('failed');
  return res.json();
}

export async function createEvent(title, token) {
  const res = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({title})
  });
  if (!res.ok) throw new Error('failed');
  return res.json();
}

export async function getMyItems(token) {
  const res = await fetch(`${API_URL}/my-items`, {
    headers: {Authorization: `Bearer ${token}`}
  });
  if (!res.ok) throw new Error('failed');
  return res.json();
}

export async function getMe(token) {
  const res = await fetch(`${API_URL}/me`, {
    headers: {Authorization: `Bearer ${token}`}
  });
  if (!res.ok) throw new Error('failed');
  return res.json();
}

export async function updateMe(data, token) {
  const res = await fetch(`${API_URL}/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('failed');
  return res.json();
}
