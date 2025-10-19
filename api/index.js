import registerHandler from './auth/register.js';
import loginHandler from './auth/login.js';
import meHandler from './auth/me.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const path = req.url || '';

  // Route to auth endpoints
  if (path.startsWith('/auth/register') || path === '/auth/register') {
    return registerHandler(req, res);
  }
  if (path.startsWith('/auth/login') || path === '/auth/login') {
    return loginHandler(req, res);
  }
  if (path.startsWith('/auth/me') || path === '/auth/me') {
    return meHandler(req, res);
  }

  // Health check
  if (path === '/health' || path === '/') {
    return res.json({ 
      status: 'ok', 
      message: 'GridShare API',
      endpoints: ['/auth/register', '/auth/login', '/auth/me']
    });
  }

  return res.status(404).json({ message: 'Endpoint not found', path });
}
