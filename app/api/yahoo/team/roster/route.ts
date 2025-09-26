app.get('/yahoo/team/roster', async (req, res) => {

	const accessToken = req.query.access_token;
	if (!accessToken) return res.status(400).send('Missing access_token');
	try {
		const url = `https://fantasysports.yahooapis.com/fantasy/v2/team/461.l.146891.t.${req.query.teamId}//roster?format=json`;
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