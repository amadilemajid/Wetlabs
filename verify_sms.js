const crypto = require('crypto');
const http = require('http');

const SECRET = "dummy_AT_hmac_secret";
const BODY   = JSON.stringify({ from: "+256770000000", text: "WET KYO01 FLOOD HIGH" });

const signature = crypto
  .createHmac('sha256', SECRET)
  .update(BODY)
  .digest('hex');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/v1/sms/callback',
  method: 'POST',
  headers: {
    'Content-Type':   'application/json',
    'x-at-signature': signature,
    'Content-Length': BODY.length
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Response: ${data}`);
  });
});

req.on('error', (e) => { console.error(`Problem with request: ${e.message}`); });
req.write(BODY);
req.end();
