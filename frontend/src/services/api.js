const API_URL = 'http://localhost:5000/api';

export const api = {
  test: async () => {
    try {
      const response = await fetch(`${API_URL}/test`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
};