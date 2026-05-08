const express = require('express');
const app = express();
const cors = require('cors');

const dns = require('dns');
 
app.get('/ping', (req, res) => {
const host = req.query.host;
if (!host) return res.status(400).send('host required');
 
// very basic validation: host must look like a hostname or IP
if (!/^[A-Za-z0-9.-]{1,253}$/.test(host)) {
return res.status(400).send('invalid host');
}
 
dns.lookup(host, (err, address) => {
if (err) return res.status(500).send('lookup failed');
res.send(`Resolved ${host} -> ${address}`);
});
});

// insecure: allows all origins
app.use(cors());

// insecure: uses a default password if env var missing
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

app.get('/admin', (req, res) => {
  const pw = req.query.pw;
  if (pw === ADMIN_PASSWORD) {
    res.send('Welcome admin');
  } else {
    res.status(401).send('Unauthorized');
  }
});

// verbose error (debug) enabled in production
app.get('/', (req, res) => {
  throw new Error('detailed error info: stack trace...');
});

app.listen(process.env.PORT || 8080);
