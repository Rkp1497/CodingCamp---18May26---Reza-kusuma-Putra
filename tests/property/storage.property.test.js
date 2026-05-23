// Feature: life-dashboard, Property 2: Link serialization round-trip
// Validates: Requirements 5.6

'use strict';

const fc = require('fast-check');

// ---------------------------------------------------------------------------
// Mock localStorage and window so app.js can be loaded in Node/Jest
// ---------------------------------------------------------------------------
const localStorageStore = {};
const mockLocalStorage = {
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(localStorageStore, key)
      ? localStorageStore[key]
      : null;
  },
  setItem(key, value) {
    localStorageStore[key] = String(value);
  },
  removeItem(key) {
    delete localStorageStore[key];
  },
  clear() {
    Object.keys(localStorageStore).forEach((k) => delete localStorageStore[k]);
  },
};

global.localStorage = mockLocalStorage;
global.window = global;
global.document = {
  addEventListener: () => {},
};

// Load app.js — this executes the IIFE and sets window.__LifeDashboard
require('../../js/app.js');

const { Storage } = global.__LifeDashboard;

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/**
 * Generates a non-empty string of printable ASCII characters with length
 * between `min` and `max` (inclusive).
 */
function printableString(min, max) {
  return fc
    .string({ minLength: min, maxLength: max, unit: 'grapheme-ascii' })
    .filter((s) => s.trim().length > 0);
}

/**
 * Generates a valid URL string starting with http:// or https://.
 * Keeps it simple: "https://" + 1–100 printable non-whitespace chars.
 */
const validUrlArb = fc
  .tuple(
    fc.constantFrom('http://', 'https://'),
    fc.stringOf(
      fc.char().filter((c) => /\S/.test(c)),
      { minLength: 1, maxLength: 100 }
    )
  )
  .map(([scheme, rest]) => scheme + rest)
  .filter((url) => url.length <= 2048);

/**
 * Generates a single Link object with random id, label (1–50 chars), and
 * a valid URL.
 */
const linkArb = fc.record({
  id: fc.uuid(),
  label: printableString(1, 50),
  url: validUrlArb,
});

/** Generates an array of 0–20 Link objects. */
const linkArrayArb = fc.array(linkArb, { minLength: 0, maxLength: 20 });

// ---------------------------------------------------------------------------
// Property 2: Link serialization round-trip
// ---------------------------------------------------------------------------

describe('Property 2: Link serialization round-trip', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  /**
   * **Validates: Requirements 5.6**
   *
   * For any array of Link objects, Storage.save followed by Storage.load
   * must return an array that deep-equals the original.
   */
  it('Storage.load after Storage.save deep-equals the original Link array', () => {
    fc.assert(
      fc.property(linkArrayArb, (links) => {
        const KEY = 'life-dashboard-links';

        Storage.save(KEY, links);
        const loaded = Storage.load(KEY);

        // Same length
        expect(loaded).toHaveLength(links.length);

        // Same order and identical field values for each Link
        for (let i = 0; i < links.length; i++) {
          expect(loaded[i].id).toBe(links[i].id);
          expect(loaded[i].label).toBe(links[i].label);
          expect(loaded[i].url).toBe(links[i].url);
        }
      }),
      { numRuns: 100 }
    );
  });
});
