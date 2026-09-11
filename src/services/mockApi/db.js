/** A namespace prefix so this app's keys don't collide with anything else stored in localStorage on the same domain. Every key this module touches starts with imp:. */
const STORAGE_PREFIX = 'imp:';

/** Reads the raw JSON string stored at imp:<name> and parses it into an array. If nothing is stored yet, returns an empty array ([]) instead of null/undefined — this means callers never have to null-check. */
export function getCollection(name) {
  const raw = localStorage.getItem(STORAGE_PREFIX + name);
  return raw ? JSON.parse(raw) : [];
}

/** The inverse: serializes an array to JSON and writes it to imp:<name>. Returns the same array back (useful for chaining). */
export function setCollection(name, items) {
  localStorage.setItem(STORAGE_PREFIX + name, JSON.stringify(items));
  return items;
}

/** Simulates an auto-incrementing primary key, like AUTO_INCREMENT in MySQL. It keeps a separate counter at imp:<name>:seq, reads the current value (defaulting to 0), increments it, saves it back, and returns the new number. */
export function nextId(name) {
  const key = STORAGE_PREFIX + name + ':seq';
  const current = Number(localStorage.getItem(key) || '0') + 1;
  localStorage.setItem(key, String(current));
  return current;
}


/** Simulates INSERT INTO <table>. Loads the collection, pushes the new record onto the array, saves the whole array back, and returns the inserted record. */
export function insert(name, record) {
  const items = getCollection(name);
  items.push(record);
  setCollection(name, items);
  return record;
}

/** Simulates UPDATE <table> SET ... WHERE id = ?. Finds the record by id using findIndex. If it doesn't exist, throws an error (mimicking a failed update). Otherwise it merges the patch into the existing record with { ...items[index], ...patch } (shallow merge — patch fields overwrite existing ones), saves the array, and returns the updated record. */
export function update(name, id, patch) {
  const items = getCollection(name);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) throw new Error(`${name} #${id} not found`);
  items[index] = { ...items[index], ...patch };
  setCollection(name, items);
  return items[index];
}


/** Simulates DELETE FROM <table> WHERE id = ?. Filters out the matching record and saves the rest back. */
export function remove(name, id) {
  const items = getCollection(name).filter((item) => item.id !== id);
  setCollection(name, items);
}

/** Simulates SELECT * FROM <table> WHERE id = ? LIMIT 1. Returns the matching record, or null if not found. */
export function findById(name, id) {
  return getCollection(name).find((item) => item.id === id) || null;
}


/** A simple boolean flag stored at imp:seeded. This lets the app check "have I already populated this fake database with initial/demo data?" so seeding logic only runs once (e.g., on first load) rather than duplicating data every time. */
export function isSeeded() {
  return localStorage.getItem(STORAGE_PREFIX + 'seeded') === 'true';
}


/**  */
export function markSeeded() {
  localStorage.setItem(STORAGE_PREFIX + 'seeded', 'true');
}

/** A dev/testing utility: iterates over every key in localStorage, and removes any key that starts with the imp: prefix — effectively wiping the entire mock database (all collections, sequences, and the seeded flag) without touching unrelated localStorage data from other apps/scripts on the page. */
export function resetDatabase() {
  Object.keys(localStorage)
    .filter((key) => key.startsWith(STORAGE_PREFIX))
    .forEach((key) => localStorage.removeItem(key));
}

/* Simulated network latency so loading states are visible & real-feeling. */
export function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
