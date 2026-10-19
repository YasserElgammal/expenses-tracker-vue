import api from './api';

export default {
  register(payload) {
    return api.post('/register', payload);
  },
  login(credentials) {
    return api.post('/login', credentials);
  },
  logout() {
    return api.post('/logout');
  },
};
