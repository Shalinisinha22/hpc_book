export const API_BASE_URL = 'http://localhost:8000';
export const API_ROUTES = {
  login: `${API_BASE_URL}/api/v1/login`,
  register: `${API_BASE_URL}/api/v1/register`,   
  rooms: `${API_BASE_URL}/api/v1/rooms`,
  offers: `${API_BASE_URL}/api/v1/offers`,
  halls: `${API_BASE_URL}/api/v1/halls`,
  promocodes: `${API_BASE_URL}/api/v1/promocodes`,
  users: {
    login: `${API_BASE_URL}/api/v1/users/login`,
  },
};