import { Role } from '../../domain/enums';
import { getCollection, insert, update, remove, findById, delay } from './db';
import { currentMaxId } from './seed';

function sanitize(user) {
  if (!user) return null;
  const { password: _password, ...rest } = user;
  return rest;
}

export async function listUsers(filters = {}) {
  await delay();
  let items = getCollection('users');
  if (filters.role) items = items.filter((u) => u.role === filters.role);
  return items.map(sanitize);
}

export async function getUser(id) {
  await delay();
  return sanitize(findById('users', Number(id)));
}

export async function createUser(data) {
  await delay(400);
  const id = currentMaxId('users') + 1;
  const user = {
    id,
    isActive: true,
    createdAt: new Date().toISOString(),
    password: data.password || 'Welcome123!',
    ...data,
  };
  insert('users', user);
  return sanitize(user);
}

export async function updateUser(id, patch) {
  await delay(300);
  return sanitize(update('users', Number(id), patch));
}

export async function deactivateUser(id) {
  await delay(250);
  return sanitize(update('users', Number(id), { isActive: false }));
}

export async function deleteUser(id) {
  await delay(250);
  remove('users', Number(id));
}

export async function listInterns(filters = {}) {
  const interns = await listUsers({ role: Role.INTERN });
  if (filters.teamId) return interns.filter((i) => i.teamId === Number(filters.teamId));
  return interns;
}

export async function listSupervisors() {
  return listUsers({ role: Role.SUPERVISOR });
}
