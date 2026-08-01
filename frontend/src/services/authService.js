// PHASE 1: Auth API calls.

import api from './api';

export const registerUser = async (fullName, email, password) => {
  const response = await api.post('/auth/register', {
    full_name: fullName,
    email: email,
    password: password,
  });
  return response.data;
};

export const loginUser = async (email, password) => {
  // We send Form Data (URLSearchParams) to match OAuth2PasswordRequestForm
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  const response = await api.post('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data; // returns { access_token: "...", token_type: "bearer" }
};

