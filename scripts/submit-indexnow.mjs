import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

// This verification key is intentionally public; it grants no account access.
const origin = 'https://anxinlaw.xyz';
const key = (await readFile(new URL('../public/indexnow-key.txt', import.meta.url), 'utf8')).trim();
assert.match(key, /^[a-zA-Z0-9-]{8,128}$/);
const keyLocation = origin + '/indexnow-key.txt';
const get = async (url) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, url);
  return response.text();
};
assert.equal((await get(keyLocation)).trim(), key, 'Deploy and verify the public key before submitting');
const sitemap = await get(origin + '/sitemap.xml');
const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.ok(urlList.length > 0 && urlList.length <= 10000);
for (const url of urlList) assert.equal(new URL(url).origin, origin);
if (!process.argv.includes('--live')) {
  console.log(JSON.stringify({ mode: 'dry-run', urls: urlList.length, keyVerified: true }));
} else {
  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: new URL(origin).host, key, keyLocation, urlList }),
    signal: AbortSignal.timeout(30000),
  });
  const body = await response.text();
  console.log(JSON.stringify({ mode: 'live', urls: urlList.length, status: response.status, body,
    result: response.status === 200 ? 'received' : response.status === 202 ? 'received; key validation pending' : 'failed',
    note: 'Receipt is not confirmation of indexing or ranking.' }));
  assert.ok([200, 202].includes(response.status), 'IndexNow rejected the submission');
}
