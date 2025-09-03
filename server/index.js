
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import qs from 'querystring';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import path from 'path';

dotenv.config();
const app = express();
app.use(express.json()); // Parse JSON bodies
// Configure CORS for production and development
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.FRONTEND_URL || 'https://bokbokpc.info']
  : ['http://localhost:5173', 'https://localhost:5173'];

app.use(cors({
	origin: allowedOrigins,
	credentials: true
}));
const PORT = process.env.PORT || 3000;

const YAHOO_CLIENT_ID = process.env.YAHOO_CLIENT_ID;
const YAHOO_CLIENT_SECRET = process.env.YAHOO_CLIENT_SECRET;
const YAHOO_REDIRECT_URI = process.env.YAHOO_REDIRECT_URI;


// Serve static files from the React app build directory
app.use(express.static(path.join(process.cwd(), '../dist')));

// Handle React routing - send all non-API requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), '../dist/index.html'));
});

// Get OAuth URL (for frontend to use)
app.get('/auth/yahoo/url', (req, res) => {
	const authUrl = `https://api.login.yahoo.com/oauth2/request_auth?client_id=${YAHOO_CLIENT_ID}&redirect_uri=${encodeURIComponent(YAHOO_REDIRECT_URI)}&response_type=code&language=en-us`;
	res.json({ authUrl });
});

// Step 1: Redirect user to Yahoo OAuth
app.get('/auth/yahoo', (req, res) => {
	const authUrl = `https://api.login.yahoo.com/oauth2/request_auth?client_id=${YAHOO_CLIENT_ID}&redirect_uri=${encodeURIComponent(YAHOO_REDIRECT_URI)}&response_type=code&language=en-us`;
	console.log('Redirecting to Yahoo OAuth:', authUrl);
	res.redirect(authUrl);
});


// Step 2: Yahoo redirects back with code
app.get('/auth/yahoo/callback', async (req, res) => {
	const code = req.query.code;
	if (!code) return res.status(400).send('Missing code');
	try {
		// Step 3: Exchange code for access token
		console.log('Exchanging code for access token...');
		
		const tokenRes = await axios.post('https://api.login.yahoo.com/oauth2/get_token',
			qs.stringify({
				client_id: YAHOO_CLIENT_ID,
				client_secret: YAHOO_CLIENT_SECRET,
				redirect_uri: YAHOO_REDIRECT_URI,
				code,
				grant_type: 'authorization_code',
			}), {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		);
		const { access_token, refresh_token } = tokenRes.data;
		console.log('Successfully got tokens, redirecting to frontend...');
		
		// Redirect back to frontend with tokens
		const frontendBaseUrl = process.env.NODE_ENV === 'production' 
			? (process.env.FRONTEND_URL || 'https://bokbokpc.info')
			: 'http://localhost:5173';
		const frontendUrl = `${frontendBaseUrl}/auth/success?access_token=${encodeURIComponent(access_token)}&refresh_token=${encodeURIComponent(refresh_token)}`;
		res.redirect(frontendUrl);
	} catch (err) {
		console.error('OAuth callback error:', err.message);
		console.error('Full error:', err.response?.data || err);
		
		// Redirect to frontend with error
		const frontendBaseUrl = process.env.NODE_ENV === 'production' 
			? (process.env.FRONTEND_URL || 'https://bokbokpc.info')
			: 'http://localhost:5173';
		const errorUrl = `${frontendBaseUrl}/auth/error?error=${encodeURIComponent(err.message)}`;
		res.redirect(errorUrl);
	}
});

// Refresh access token using refresh token
app.post('/auth/yahoo/refresh', async (req, res) => {
	const { refresh_token } = req.body;
	if (!refresh_token) {
		return res.status(400).json({ error: 'Missing refresh token' });
	}
	
	try {
		console.log('Refreshing access token...');
		
		const tokenRes = await axios.post('https://api.login.yahoo.com/oauth2/get_token',
			qs.stringify({
				client_id: YAHOO_CLIENT_ID,
				client_secret: YAHOO_CLIENT_SECRET,
				refresh_token: refresh_token,
				grant_type: 'refresh_token',
			}), {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		);
		
		const { access_token, refresh_token: new_refresh_token } = tokenRes.data;
		console.log('Successfully refreshed token');
		
		res.json({ 
			access_token,
			refresh_token: new_refresh_token || refresh_token // Use new refresh token if provided
		});
	} catch (err) {
		console.error('Token refresh error:', err.message);
		console.error('Full error:', err.response?.data || err);
		res.status(401).json({ error: 'Failed to refresh token' });
	}
});

// Step 5: Fetch Yahoo Fantasy Football user games
app.get('/yahoo/games', async (req, res) => {
	const accessToken = req.query.access_token;
	if (!accessToken) return res.status(400).send('Missing access_token');
	try {
		// Yahoo Fantasy API returns XML by default, but you can request JSON
		const url = 'https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games?format=json';
		const response = await axios.get(url, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
		res.json(response.data);
	} catch (err) {
		res.status(500).json({ error: err.message, details: err.response?.data });
	}
});
app.get('/yahoo/league', async (req, res) => {
	const accessToken = req.query.access_token;
	if (!accessToken) return res.status(400).send('Missing access_token');
	try {
		// Yahoo Fantasy API returns XML by default, but you can request JSON
		const url = 'https://fantasysports.yahooapis.com/fantasy/v2/league/461.l.146891/standings?format=json';
		const response = await axios.get(url, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
		res.json(response.data);
	} catch (err) {
		res.status(500).json({ error: err.message, details: err.response?.data });
	}

	
});
app.get('/yahoo/matchups', async (req, res) => {
	const accessToken = req.query.access_token;
	if (!accessToken) return res.status(400).send('Missing access_token');
	try {
		const url = 'https://fantasysports.yahooapis.com/fantasy/v2/league/461.l.146891/scoreboard?format=json';
		const response = await axios.get(url, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
		res.json(response.data);
	} catch (err) {
		res.status(500).json({ error: err.message, details: err.response?.data });
	}

	
});

// Serve static files from the React app build directory (production only)
if (process.env.NODE_ENV === 'production') {
	const buildPath = path.join(__dirname, '../dist');
	app.use(express.static(buildPath));
	
	// Handle React routing - send all non-API requests to React app
	app.get('*', (req, res) => {
		res.sendFile(path.join(buildPath, 'index.html'));
	});
}

// Start server (HTTP only - DigitalOcean handles HTTPS)
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
