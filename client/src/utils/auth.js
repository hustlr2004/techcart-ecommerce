export function getStoredUser() {
  try {
    const rawUser = localStorage.getItem('user');
    return rawUser ? JSON.parse(rawUser) : null;
  } catch {
    return null;
  }
}

export function isAdminUser(user) {
  return Boolean(user && (user.role === 'admin' || user.isAdmin === true));
}
