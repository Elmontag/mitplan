const API_URL = '/api';

export async function login(username, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username, password})
  });
  if (!res.ok) throw new Error('login failed');
  return res.json();
}

export async function getEvents(token) {
  const res = await fetch(`${API_URL}/events`, {
    headers: {Authorization: `Bearer ${token}`}
  });
  if (!res.ok) throw new Error('failed');
  return res.json();
}
