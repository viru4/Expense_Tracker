import axiosInstance from '../api/axios';

const authService = {
  /**
   * Logs a user in with their email and password.
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<object>} The login API response (including access_token).
   */
  async login(email, password) {
    const response = await axiosInstance.post('/login', { email, password });
    return response.data;
  },

  /**
   * Registers a new user.
   * @param {string} username 
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<object>} The registration API response.
   */
  async register(username, email, password) {
    const response = await axiosInstance.post('/register', { username, email, password });
    return response.data;
  },

  /**
   * Fetches the profile details of the currently authenticated user.
   * @returns {Promise<object>} The profile API response (including user profile data).
   */
  async getProfile() {
    const response = await axiosInstance.get('/profile');
    return response.data;
  },

  /**
   * Deletes the currently authenticated user's account.
   * @returns {Promise<object>} The delete account API response.
   */
  async deleteAccount() {
    const response = await axiosInstance.delete('/delete-account');
    return response.data;
  }
};

export default authService;
