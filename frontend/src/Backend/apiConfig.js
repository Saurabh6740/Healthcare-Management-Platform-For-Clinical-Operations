// API configuration pointing to live Railway cloud microservices
const LIVE_BACKEND_URL = 'https://discerning-nourishment-production-ae12.up.railway.app/api';

export const API_BASE_URLS = {
  HEALTHCARE_SERVICE: LIVE_BACKEND_URL,
  PREDICTION_SERVICE: LIVE_BACKEND_URL,
  MODEL_SERVICE: 'http://localhost:8086/api', // Python AI backend
  KAFKA_WEBSOCKET: 'wss://discerning-nourishment-production-ae12.up.railway.app/ws-vitals'
};

export const ENDPOINTS = {
  PATIENTS: `${API_BASE_URLS.HEALTHCARE_SERVICE}/patients`,
  DOCTORS: `${API_BASE_URLS.HEALTHCARE_SERVICE}/doctors`,
  VITALS: `${API_BASE_URLS.HEALTHCARE_SERVICE}/vitals`,
  ALERTS: `${API_BASE_URLS.HEALTHCARE_SERVICE}/alerts`,
  PREDICT_RISK: `${API_BASE_URLS.PREDICTION_SERVICE}/predict`,
  ANOMALY_CHECK: `${API_BASE_URLS.MODEL_SERVICE}/anomaly-detect`,
  CAREPLAN: `${API_BASE_URLS.HEALTHCARE_SERVICE}/careplan`
};
