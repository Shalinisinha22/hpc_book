export const API_BASE_URL = 'https://hpc-backend.vercel.app'
// 'https://hpc-backend.vercel.app';
export const API_ROUTES = {
  login: `${API_BASE_URL}/api/v1/users/login`,
  register: `${API_BASE_URL}/api/v1/users/register`,   
  rooms: `${API_BASE_URL}/api/v1/rooms`,
  offers: `${API_BASE_URL}/api/v1/offers`,
  halls: `${API_BASE_URL}/api/v1/halls`,
  promocodes: `${API_BASE_URL}/api/v1/promocodes`,
  bookings: {
    all: `${API_BASE_URL}/api/v1/bookings`,
    cancelled: `${API_BASE_URL}/api/v1/bookings/cancelled`,
    bookingDetails:`${API_BASE_URL}/api/v1/bookings`, 
  },
  setRoomUnavilable: `${API_BASE_URL}/api/v1/rooms/unavailable`,
  members:`${API_BASE_URL}/api/v1/users`,
  users: {
    login: `${API_BASE_URL}/api/v1/users/login`,
  },
  unavailabilities: `${API_BASE_URL}/api/v1/room-availability/unavailabilities`,
  eventBookings:`${API_BASE_URL}/api/v1/event-bookings`,
  roles:`${API_BASE_URL}/api/v1/roles`,
  changePassword: `${API_BASE_URL}/api/v1/users/change-password`,
  dining:`${API_BASE_URL}/api/v1/dining`,
  diningBookings: `${API_BASE_URL}/api/v1/dining-bookings`,
};