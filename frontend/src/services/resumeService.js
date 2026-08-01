// PHASE 2: Resume API calls.

import api from './api';

export const uploadResume = async (file) => {
  // When uploading files, we MUST use FormData instead of standard JSON
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getResume = async () => {
  const response = await api.get('/resume/');
  return response.data;
};

export const deleteResume = async () => {
  const response = await api.delete('/resume/');
  return response.data;
};

