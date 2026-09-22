// Runs on GitHub's own servers (via the Actions workflow), not in anyone's browser or on
// the office network - so whatever was silently blocking script.google.com/workers.dev on
// that network never comes into play here at all. Fetches the PMT sheet and saves it as a
// plain JSON file in this repo; the dashboard then reads that saved file directly instead
// of waiting on a live request to Google, so there is no function-timeout race to lose.
var fs = require('fs');

var url = 'https://script.google.com/macros/s/AKfycbwFC54L_-c5nrPra_KyG0ya-io24R3vAp-JoNcunokJ4CtXuZGTTZDmmcBbmKBzs9XOww/exec?tab=pmt&_cb=' + Date.now();

fetch(url).then(function (res) {
  if (!res.ok) {
    throw new Error('Upstream responded with ' + res.status);
  }
  return res.text();
}).then(function (body) {
  var parsed;
  try {
    parsed = JSON.parse(body);
  } catch (e) {
    throw new Error('Response was not valid JSON: ' + e.message);
  }
  if (!Array.isArray(parsed)) {
    throw new Error('Response was valid JSON but not an array (got: ' + JSON.stringify(parsed).slice(0, 200) + ')');
  }
  fs.mkdirSync('data', { recursive: true });
  fs.writeFileSync('data/pmt-data.json', body);
  console.log('Wrote ' + parsed.length + ' rows (' + body.length + ' bytes) to data/pmt-data.json');
}).catch(function (err) {
  console.error('Fetch failed: ' + err.message);
  process.exit(1);
});
