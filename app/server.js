const express = require('express');
const app = express();
const cors = require('cors');
const dns = require('dns');

// CORS must be registered before routes
app.use(cors({ origin: "https://labdeploy-webapp-Jeremy.azurewebsites.net" }));

app.get('/ping', (req, res) => {
  const host = req.query.host;
  if (!host) return res.status(400).send('host required');

  if (!/^[A-Za-z0-9.-]{1,253}$/.test(host)) {
    return res.status(400).send('invalid host');
  }

  dns.lookup(host, (err, address) => {
    if (err) return res.status(500).send('lookup failed');
    res.send(`Resolved ${host} -> ${address}`);
  });
});

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

app.get('/admin', (req, res) => {
  if (!process.env.ADMIN_PASSWORD) {
    return res.status(500).send("Admin password missing — please configure ADMIN_PASSWORD.");
  }

  const pw = req.query.pw;
  if (pw === ADMIN_PASSWORD) {
    res.send('Welcome admin');
  } else {
    res.status(401).send('Unauthorized');
  }
});

app.get('/', (req, res) => {
  res.send('App is running securely 🎉');
});

app.listen(process.env.PORT || 8080);
