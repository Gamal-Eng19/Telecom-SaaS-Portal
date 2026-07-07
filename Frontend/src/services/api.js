const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

export async function getJson(path){
  const res = await fetch(`${API_BASE}/${path}`);
  return res.json();
}

export default { getJson };
