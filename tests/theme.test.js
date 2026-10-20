const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function boot({ blocked = false, stored = null, animation = false } = {}) {
  let theme = 'light', click, level, saved;
  const context = {
    document: {
      body: { getAttribute: () => theme, setAttribute: (_, value) => { theme = value; } },
      getElementById: () => ({ addEventListener: (_, handler) => { click = handler; } }),
      querySelectorAll: () => [{ getAttribute: () => '85%', style: { setProperty: (_, value) => { level = value; } } }],
    },
    localStorage: {
      getItem() { if (blocked) throw new Error('Storage unavailable'); return stored; },
      setItem(_, value) { if (blocked) throw new Error('Storage unavailable'); saved = value; },
    },
  };
  if (animation) context.AOS = { init() {} };
  vm.runInNewContext(fs.readFileSync(`${__dirname}/../script.js`, 'utf8'), context);
  return { click: () => click(), theme: () => theme, level: () => level, saved: () => saved };
}

test('theme controls and skill bars work when browser storage is unavailable', () => {
  const page = boot({ blocked: true, animation: true });
  assert.equal(page.level(), '85%');
  page.click();
  assert.equal(page.theme(), 'dark');
});

test('optional animation failures do not prevent skill-bar initialization', () => {
  const page = boot();
  assert.equal(page.level(), '85%');
  page.click();
  assert.equal(page.saved(), 'dark');
});

test('invalid saved themes fall back to light', () => {
  assert.equal(boot({ stored: 'invalid', animation: true }).theme(), 'light');
});
