import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const origin = 'https://anxinlaw.xyz';
const live = process.argv.includes('--live');
const get = async (path) => {
  if (!live)
    return {
      text: await readFile(
        'vercel-static' + (path.endsWith('/') ? path + 'index.html' : path),
        'utf8',
      ),
      status: 200,
      headers: new Headers(),
    };
  const r = await fetch(origin + path, { signal: AbortSignal.timeout(30000) });
  return { text: await r.text(), status: r.status, headers: r.headers };
};
const robots = await get('/robots.txt');
assert.equal(robots.status, 200);
assert.match(robots.text, /Allow: \/(?:\r?\n|$)/i);
assert.doesNotMatch(robots.text, /Disallow: \/(?:\r?\n|$)/i);
assert.ok(robots.text.includes(origin + '/sitemap.xml'));
const sitemap = await get('/sitemap.xml');
assert.equal(sitemap.status, 200);
const urls = [...sitemap.text.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
assert.ok(urls.length > 0);
assert.equal(new Set(urls).size, urls.length);
const titles = new Set();
const links = new Set();
const pages = [];
for (const url of urls) {
  assert.equal(new URL(url).origin, origin);
  const path = new URL(url).pathname;
  const { text: html, status, headers } = await get(path);
  assert.equal(status, 200, path);
  assert.doesNotMatch(headers.get('x-robots-tag') || '', /noindex|none/i, path);
  assert.doesNotMatch(
    html,
    /chatgpt\.site|jianghuai-family-law-seven\.vercel\.app/,
    path,
  );
  const tags = [...html.matchAll(/<meta\b[^>]*>/g)].map((m) => m[0]);
  assert.ok(
    tags.some((t) => /name="description"/.test(t) && /content="[^"]+"/.test(t)),
    path + ' description',
  );
  for (const t of tags.filter((t) => /name="(?:robots|googlebot)"/.test(t)))
    assert.doesNotMatch(t, /noindex|nofollow|nosnippet|noai/i, path);
  const canon = [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*>/g)].map(
    (m) => m[0],
  );
  assert.equal(canon.length, 1, path);
  assert.ok(canon[0].includes('href="' + url + '"'), path + ' canonical');
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  assert.ok(title, path + ' title');
  assert.ok(!titles.has(title), path + ' duplicate title');
  titles.add(title);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, path + ' H1');
  assert.match(html, /<html[^>]*lang="zh-CN"/);
  const nodes = [
    ...html.matchAll(
      /<script\b[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs,
    ),
  ].flatMap((m) => JSON.parse(m[1])['@graph']);
  assert.ok(
    nodes.some((n) => n['@type'] === 'LegalService'),
    path + ' firm',
  );
  assert.ok(
    nodes.some((n) => n['@type'] === 'WebSite'),
    path + ' website',
  );
  assert.ok(
    nodes.some(
      (n) =>
        n.url === url &&
        [
          'WebPage',
          'AboutPage',
          'ContactPage',
          'CollectionPage',
          'ProfilePage',
        ].includes(n['@type']),
    ),
    path + ' webpage',
  );
  for (const n of nodes) {
    if (n['@type'] === 'ItemList') {
      assert.equal(
        n.numberOfItems,
        n.itemListElement.length,
        path + ' list count',
      );
      for (const [i, item] of n.itemListElement.entries()) {
        assert.equal(item.position, i + 1);
        assert.ok(urls.includes(item.url), path + ' list URL');
        assert.ok(
          html.includes('href="' + new URL(item.url).pathname + '"'),
          path + ' list item visible',
        );
      }
    }
    if (n['@id'])
      assert.ok(n['@id'].startsWith(origin + '/'), path + ' schema id');
    if (n['@type'] === 'BreadcrumbList')
      assert.ok(
        n.itemListElement.every(
          (item, i) =>
            item.position === i + 1 && item.item.startsWith(origin + '/'),
        ),
      );
  }
  for (const m of html.matchAll(/<a\b[^>]*href="([^"?#]*)/g)) {
    if (m[1].startsWith('/')) links.add(origin + m[1]);
  }
  pages.push({
    path,
    status,
    schemaTypes: [...new Set(nodes.map((n) => n['@type']))],
  });
}
for (const link of links)
  assert.ok(urls.includes(link), 'Internal page missing from sitemap: ' + link);
if (live) {
  for (const ua of [
    'Googlebot',
    'bingbot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'Claude-SearchBot',
    'PerplexityBot',
  ]) {
    const r = await fetch(origin + '/', {
      headers: { 'User-Agent': ua },
      signal: AbortSignal.timeout(30000),
    });
    assert.equal(r.status, 200, ua);
    assert.ok((await r.text()).includes('家事有分寸'), ua + ' readable HTML');
  }
  const missing = await fetch(origin + '/not-a-real-seo-page/', {
    signal: AbortSignal.timeout(30000),
  });
  assert.equal(missing.status, 404);
  const old = await fetch(
    'https://jianghuai-family-law-seven.vercel.app/services/divorce/?seo-check=1',
    { redirect: 'manual', signal: AbortSignal.timeout(30000) },
  );
  assert.ok([301, 308].includes(old.status), 'old host redirect');
  assert.equal(
    old.headers.get('location'),
    origin + '/services/divorce/?seo-check=1',
  );
}
console.log(
  JSON.stringify(
    {
      mode: live ? 'live' : 'export',
      pages: pages.length,
      internalLinks: links.size,
      passed: true,
      details: pages,
    },
    null,
    2,
  ),
);
