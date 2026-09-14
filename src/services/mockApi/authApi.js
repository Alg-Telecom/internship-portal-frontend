import { getCollection, update, delay } from './db';

const SESSION_KEY = 'imp:session';

function sanitize(user) {
  if (!user) return null;
  const { password: _password, ...rest } = user;
  return rest;
}

export async function login(email, password) {
  await delay();
  const users = getCollection('users');
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    const error = new Error('Invalid email or password.');
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }
  if (!user.isActive) {
    const error = new Error('This account has been deactivated.');
    error.code = 'ACCOUNT_INACTIVE';
    throw error;
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id }));
  return sanitize(user);
}

export async function logout() {
  await delay(100);
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Internal helper used by seed.js — not delayed, and not a real logout
 * (no API call to await). Whenever the demo data gets reseeded, any
 * session from before points at users that may no longer match, so it
 * gets dropped along with the rest of the old data.
 */
export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export async function getSession() {
  await delay(150);
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  const { userId } = JSON.parse(raw);
  const user = getCollection('users').find((u) => u.id === userId);
  return sanitize(user);
}

export async function changePassword(userId, { currentPassword, newPassword }) {
  await delay();
  const user = getCollection('users').find((u) => u.id === userId);
  if (!user) throw new Error('User not found.');
  if (user.password !== currentPassword) {
    const error = new Error('Current password is incorrect.');
    error.code = 'WRONG_PASSWORD';
    throw error;
  }
  update('users', userId, { password: newPassword });
  return true;
}
