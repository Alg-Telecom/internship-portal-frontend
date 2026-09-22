import { http, resolveFileUrl } from './httpClient';

function resolveUserUrls(user) {
  if (!user) return user;
  return { ...user, profilePhotoUrl: resolveFileUrl(user.profilePhotoUrl) };
}

export async function login(email, password) {
  const user = await http.post('/auth/login', { email, password });
  return resolveUserUrls(user);
}

export async function logout() {
  await http.post('/auth/logout');
}

export async function getSession() {
  try {
    const user = await http.get('/auth/me');
    return resolveUserUrls(user);
  } catch (error) {
    if (error.status === 401) return null;
    throw error;
  }
}

export async function changePassword(currentPassword, newPassword) {
  await http.patch('/auth/change-password', { currentPassword, newPassword });
  return true;
}

export async function forgotPassword(email) {
  return http.post('/auth/forgot-password', { email });
}

export async function resetPassword(token, newPassword) {
  return http.post('/auth/reset-password', { token, newPassword });
}
