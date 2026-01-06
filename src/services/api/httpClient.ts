import axios from 'axios';

export const httpClient = axios.create({
  baseURL: import.meta.env.BACKEND_SWYPER_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
