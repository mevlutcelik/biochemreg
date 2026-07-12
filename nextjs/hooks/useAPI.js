import { useState, useCallback } from 'react';
import * as api from '@/lib/api';

/**
 * Custom hook for API requests with loading and error state management
 * 
 * @example
 * const { request, loading, error } = useAPI();
 * 
 * const handleSubmit = async () => {
 *   try {
 *     const data = await request('post', {
 *       endpoint: 'auth/login',
 *       body: { email, password }
 *     });
 *     console.log(data);
 *   } catch (err) {
 *     console.error(err);
 *   }
 * };
 */
export const useAPI = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (method, options) => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await api[method](options);
            return result;
        } catch (err) {
            setError(err.message || 'An error occurred');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return { 
        request, 
        loading, 
        error,
        clearError
    };
};

export default useAPI;
