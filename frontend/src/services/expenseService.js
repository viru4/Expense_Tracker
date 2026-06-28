import axiosInstance from '../api/axios';

const expenseService = {
  /**
   * Retrieves a paginated list of expenses.
   * @param {number} page 
   * @param {number} perPage 
   * @returns {Promise<object>}
   */
  async getExpenses(page = 1, perPage = 10) {
    const response = await axiosInstance.get('/expenses', {
      params: { page, per_page: perPage }
    });
    return response.data;
  },

  /**
   * Creates a new expense.
   * @param {object} expenseData { title, amount, category }
   * @returns {Promise<object>}
   */
  async createExpense(expenseData) {
    const response = await axiosInstance.post('/expenses', expenseData);
    return response.data;
  },

  /**
   * Updates an existing expense.
   * @param {number} id 
   * @param {object} expenseData { title, amount, category }
   * @returns {Promise<object>}
   */
  async updateExpense(id, expenseData) {
    const response = await axiosInstance.put(`/expenses/${id}`, expenseData);
    return response.data;
  },

  /**
   * Deletes an expense by ID.
   * @param {number} id 
   * @returns {Promise<object>}
   */
  async deleteExpense(id) {
    const response = await axiosInstance.delete(`/expenses/${id}`);
    return response.data;
  },

  /**
   * Searches expenses by keyword (searches title and category on the backend).
   * @param {string} keyword 
   * @param {number} page 
   * @param {number} perPage 
   * @returns {Promise<object>}
   */
  async searchExpenses(keyword, page = 1, perPage = 10) {
    const response = await axiosInstance.get('/expenses/search', {
      params: { keyword, page, per_page: perPage }
    });
    return response.data;
  },

  /**
   * Filters expenses within a specified date range.
   * @param {string} startDate Format: DD-MM-YYYY
   * @param {string} endDate Format: DD-MM-YYYY
   * @param {number} page 
   * @param {number} perPage 
   * @returns {Promise<object>}
   */
  async filterExpensesByDate(startDate, endDate, page = 1, perPage = 10) {
    const response = await axiosInstance.get('/expenses/filter', {
      params: { start_date: startDate, end_date: endDate, page, per_page: perPage }
    });
    return response.data;
  },

  /**
   * Fetches monthly aggregates for user expenses (total, average, max, min, count).
   * @returns {Promise<object>}
   */
  async getAnalytics() {
    const response = await axiosInstance.get('/expenses/analytics');
    return response.data;
  }
};

export default expenseService;
