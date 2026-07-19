import api from './api';

// Login user and return auth data
export async function login(email, password) {
  const res = await api.post('/api/auth/login', { email, password });
  // return parsed data or throw
  return res.data?.data;
}

// Register new user and return auth data
export async function register(fullName, email, password) {
  const res = await api.post('/api/auth/register', {
    fullName,
    email,
    password,
  });
  return res.data?.data;
}

// Extract user and token from auth response data
export function extractAuthFromResponse(data) {
  // expect data: { user, token }
  return {
    user: data?.user || null,
    token: data?.token?.accessToken || null,
  };
}

// Change user password
export async function changePassword(
  oldPassword,
  newPassword,
  confirmPassword,
) {
  const res = await api.post('/api/auth/change-password', {
    oldPassword,
    newPassword,
    confirmPassword,
  });
}

// Request password reset link
export async function requestForgotPassword(email) {
  const res = await api.post('/api/auth/forget-password', { email });
  return res.data;
}

// Reset password with token
export async function resetPassword(token, newPassword, confirmPassword) {
  const res = await api.post(
    `/api/auth/reset-password/${encodeURIComponent(token)}`,
    {
      newPassword,
      confirmPassword,
    },
  );
  return res.data;
}


export default {
  login,
  extractAuthFromResponse,
  register,
  changePassword,
  requestForgotPassword,
  resetPassword,
};

