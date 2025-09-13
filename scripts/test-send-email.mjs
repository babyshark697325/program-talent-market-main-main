import handler from '../api/send-email.js';

function makeRes() {
  return {
    _status: 200,
    _json: null,
    status(code) { this._status = code; return this; },
    json(obj) { this._json = obj; return this; }
  };
}

async function run() {
  // Enable dry-run to avoid real network calls
  process.env.RESEND_DRY_RUN = '1';
  delete process.env.RESEND_API_KEY;

  // 1) Method not allowed
  {
    const req = { method: 'GET', body: {} };
    const res = makeRes();
    await handler(req, res);
    console.log('GET status:', res._status, 'body:', res._json);
  }

  // 2) Missing fields
  {
    const req = { method: 'POST', body: { to: 'test@example.com' } };
    const res = makeRes();
    await handler(req, res);
    console.log('POST missing fields status:', res._status, 'body:', res._json);
  }

  // 3) Happy path (dry-run)
  {
    const req = { method: 'POST', body: { to: 'test@example.com', subject: 'Hello', text: 'Hi there' } };
    const res = makeRes();
    await handler(req, res);
    console.log('POST success status:', res._status, 'body:', res._json);
  }
}

run().catch(err => { console.error(err); process.exit(1); });

