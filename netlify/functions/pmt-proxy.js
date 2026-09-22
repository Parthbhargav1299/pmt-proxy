exports.handler = async function (event, context) {
  try {
    var upstreamUrl = 'https://script.google.com/macros/s/AKfycbwFC54L_-c5nrPra_KyG0ya-io24R3vAp-JoNcunokJ4CtXuZGTTZDmmcBbmKBzs9XOww/exec?tab=pmt&_cb=' + Date.now();
    var upstream = await fetch(upstreamUrl);
    var body = await upstream.text();
    if (!upstream.ok) {
      return {
        statusCode: 502,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Upstream responded with ' + upstream.status })
      };
    }
    return {
      statusCode: 200,
      headers: Object.assign({ 'Content-Type': 'application/json; charset=utf-8' }, corsHeaders()),
      body: body
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Proxy fetch failed: ' + (err && err.message ? err.message : String(err)) })
    };
  }
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': '*'
  };
}
