// Simple admin access check using local-auth
const user = window.localAuth ? localAuth.getCurrentUser() : null;
if (!user || (user.role !== 'admin' && user.role !== 'root')) {
  window.location.href = 'login.html';
}
