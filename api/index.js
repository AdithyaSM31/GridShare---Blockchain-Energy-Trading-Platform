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

  // Get the path - Vercel might pass /api/auth/register or just /auth/register
  let path = req.url || '';
  
  // Remove /api prefix if present (Vercel routing adds it)
  if (path.startsWith('/api')) {
    path = path.substring(4);
  }
  
  // Remove query string if present
  const queryIndex = path.indexOf('?');
  if (queryIndex !== -1) {
    path = path.substring(0, queryIndex);
  }

  // Route to auth endpoints
  if (path.includes('/auth/register')) {
    return registerHandler(req, res);
  }
  if (path.includes('/auth/login')) {
    return loginHandler(req, res);
  }
  if (path.includes('/auth/me')) {
    return meHandler(req, res);
  }

  // Health check
  if (path === '/health' || path === '/' || path === '') {
    return res.json({ 
      status: 'ok', 
      message: 'GridShare API',
      endpoints: ['/api/auth/register', '/api/auth/login', '/api/auth/me'],
      receivedPath: req.url
    });
  }

  return res.status(404).json({ 
    message: 'Endpoint not found', 
    requestedPath: req.url,
    parsedPath: path,
    availableEndpoints: ['/api/auth/register', '/api/auth/login', '/api/auth/me']
  });
}
