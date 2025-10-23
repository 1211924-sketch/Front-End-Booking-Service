export const environment = {
  production: false,
  apiBase: 'http://localhost:3000/api', // عدّلها إن لزم
  endpoints: {
    login:        '/auth/login',
    register:     '/auth/register',
    me:           '/auth/me',
    requestReset: '/auth/request-reset',
    reset:        '/auth/reset-password'
  }
};
