export const API_BASE_URL = 'http://localhost:8000'
// 'https://hpc-backend.vercel.app';
export const API_ROUTES = {
  login: `${API_BASE_URL}/api/v1/login`,
  register: `${API_BASE_URL}/api/v1/register`,   
  rooms: `${API_BASE_URL}/api/v1/rooms`,
  offers: `${API_BASE_URL}/api/v1/offers`,
  halls: `${API_BASE_URL}/api/v1/halls`,
  promocodes: `${API_BASE_URL}/api/v1/promocodes`,
  bookings: {
    all: `${API_BASE_URL}/api/v1/bookings`,
    cancelled: `${API_BASE_URL}/api/v1/bookings/cancelled`
  },
  setRoomUnavilable: `${API_BASE_URL}/api/v1/rooms/unavailable`,
  members:`${API_BASE_URL}/api/v1/users`,
  users: {
    login: `${API_BASE_URL}/api/v1/users/login`,
  },
};