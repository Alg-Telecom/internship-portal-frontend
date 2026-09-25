import { http, resolveFileUrl } from './httpClient';

function resolveUserUrls(user) {
  if (!user) return user;
  return { ...user, profilePhotoUrl: resolveFileUrl(user.profilePhotoUrl) };
}

export async function getUsers(role) {
  const query = role ? `?role=${encodeURIComponent(role)}` : '';
  const users = await http.get(`/users${query}`);
  return users.map(resolveUserUrls);
}

export async function getUser(id) {
  const user = await http.get(`/users/${id}`);
  return resolveUserUrls(user);
}

export async function createUser(data) {
  const user = await http.post('/users', data);
  return resolveUserUrls(user);
}

export async function updateUser(id, patch) {
  const user = await http.patch(`/users/${id}`, patch);
  return resolveUserUrls(user);
}

export async function deleteUser(id) {
  await http.delete(`/users/${id}`);
  return true;
}

export async function updateOwnProfile(data) {
  const user = await http.patch('/users/me', data);
  return resolveUserUrls(user);
}

export async function uploadOwnPhoto(file) {
  const formData = new FormData();
  formData.append('photo', file);
  const user = await http.post('/users/me/photo', formData, { isFormData: true });
  return resolveUserUrls(user);
}

// Self-service withdrawal (e.g. an intern cancelling their own internship
// from SettingsPage) — deactivates the account and clears the session
// cookie server-side.
export async function deactivateOwnAccount() {
  await http.post('/users/me/deactivate');
  return true;
}