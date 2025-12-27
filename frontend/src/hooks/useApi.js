import { useState, useCallback } from 'react';
import api from '../utils/api.js';

const useApi = (endpoint, method = 'GET') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (payload = null) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (method === 'GET') {
        response = await api.get(endpoint);
      } else if (method === 'POST') {
        response = await api.post(endpoint, payload);
      } else if (method === 'PUT') {
        response = await api.put(endpoint, payload);
      } else if (method === 'DELETE') {
        response = await api.delete(endpoint);
      }
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint, method]);

  return { data, loading, error, request };
};

export default useApi;
