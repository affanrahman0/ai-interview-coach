// PHASE 3: Interview API calls.

import api from './api';

export const startInterview = async (interviewData) => {
  // interviewData = { interview_type: "Python", difficulty: "Medium", num_questions: 5 }
  const response = await api.post('/interview/start', interviewData);
  return response.data;
};

export const submitAnswer = async (questionId, text) => {
  const response = await api.post('/interview/answer', {
    question_id: questionId,
    text: text,
  });
  return response.data;
};

export const getInterviewSession = async (interviewId) => {
  const response = await api.get(`/interview/${interviewId}`);
  return response.data;
};

// PHASE 4: Evaluation calls
export const completeInterview = async (interviewId) => {
  const response = await api.post(`/evaluation/${interviewId}/complete`);
  return response.data;
};

export const getReport = async (interviewId) => {
  const response = await api.get(`/evaluation/${interviewId}/report`);
  return response.data;
};
