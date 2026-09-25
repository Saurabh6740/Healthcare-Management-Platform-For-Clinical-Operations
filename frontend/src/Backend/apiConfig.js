// API configuration pointing to local microservices or WebSocket endpoints

export const API_BASE_URLS = {
  HEALTHCARE_SERVICE: 'http://localhost:8080/api',
  PREDICTION_SERVICE: 'http://localhost:8080/api',
  MODEL_SERVICE: 'http://localhost:8086/api', // Python/Java AI backend
  KAFKA_WEBSOCKET: 'ws://localhost:8082/ws-vitals'
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
