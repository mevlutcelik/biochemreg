/**
 * Base fetch wrapper with common configuration
 */
const fetchAPI = async (endpoint, options = {}) => {
    const url = options.customUrl || `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`;
    
    const headers = {
        ...options.headers,
    };

    // Add authorization header if token provided
    if (options.bearerToken) {
        headers['Authorization'] = `Bearer ${options.bearerToken}`;
    }

    // Add CSRF token if provided
    if (options.csrfToken) {
        headers['X-CSRF-TOKEN'] = options.csrfToken;
    }

    // Set content type for non-FormData requests
    if (options.body && !(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers,
            credentials: 'include',
            body: options.body instanceof FormData 
                ? options.body 
                : options.body 
                    ? JSON.stringify(options.body) 
                    : undefined,
        });

        // Handle non-OK responses
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message || `HTTP Error ${response.status}: ${response.statusText}`
            );
        }

        return await response.json();
    } catch (error) {
        // Sadece beklenmeyen hataları logla (network errors vb.)
        if (error.message && !error.message.includes('HTTP Error')) {
            console.error(`API Error [${options.method || 'GET'}] ${url}:`, error);
        }
        throw error;
    }
};

/**
 * GET request
 */
export const get = async ({ endpoint, bearerToken = null, customUrl = null }) => {
    return fetchAPI(endpoint, {
        method: 'GET',
        bearerToken,
        customUrl,
    });
};

/**
 * POST request
 */
export const post = async ({ 
    endpoint, 
    body = null, 
    bearerToken = null, 
    csrfToken = null, 
    customUrl = null 
}) => {
    return fetchAPI(endpoint, {
        method: 'POST',
        body,
        bearerToken,
        csrfToken,
        customUrl,
    });
};

/**
 * PUT request (full update)
 */
export const put = async ({ 
    endpoint, 
    body = null, 
    bearerToken = null, 
    csrfToken = null, 
    customUrl = null 
}) => {
    return fetchAPI(endpoint, {
        method: 'PUT',
        body,
        bearerToken,
        csrfToken,
        customUrl,
    });
};

/**
 * PATCH request (partial update)
 */
export const patch = async ({ 
    endpoint, 
    body = null, 
    bearerToken = null, 
    csrfToken = null, 
    customUrl = null 
}) => {
    return fetchAPI(endpoint, {
        method: 'PATCH',
        body,
        bearerToken,
        csrfToken,
        customUrl,
    });
};

/**
 * DELETE request
 */
export const del = async ({ 
    endpoint, 
    body = null, 
    bearerToken = null, 
    csrfToken = null, 
    customUrl = null 
}) => {
    return fetchAPI(endpoint, {
        method: 'DELETE',
        body,
        bearerToken,
        csrfToken,
        customUrl,
    });
};