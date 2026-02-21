const API_URL = "http://localhost:5000/api";

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    // Handle specific error cases
    if (response.status === 401) {
      // Unauthorized - clear local storage and redirect
      localStorage.clear();
      window.location.href = '/auth';
    }
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }
  
  return data;
};

// Helper to get auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// GET request
export const getData = async (endpoint) => {
  try {
    const res = await fetch(`${API_URL}/${endpoint}`, {
      headers: {
        'Accept': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return await handleResponse(res);
  } catch (error) {
    console.error("API GET Error:", error);
    throw error;
  }
};

// POST request
export const postData = async (endpoint, data, isFormData = false) => {
  try {
    const headers = {
      'Accept': 'application/json',
      ...getAuthHeaders(),
    };
    
    // Don't set Content-Type for FormData, browser will set it with boundary
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const body = isFormData ? data : JSON.stringify(data);

    const res = await fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      headers,
      body,
    });
    return await handleResponse(res);
  } catch (error) {
    console.error("API POST Error:", error);
    throw error;
  }
};

// PUT request
export const putData = async (endpoint, data, isFormData = false) => {
  try {
    const headers = {
      'Accept': 'application/json',
      ...getAuthHeaders(),
    };
    
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const body = isFormData ? data : JSON.stringify(data);

    const res = await fetch(`${API_URL}/${endpoint}`, {
      method: "PUT",
      headers,
      body,
    });
    return await handleResponse(res);
  } catch (error) {
    console.error("API PUT Error:", error);
    throw error;
  }
};

// DELETE request
export const deleteData = async (endpoint) => {
  try {
    const res = await fetch(`${API_URL}/${endpoint}`, {
      method: "DELETE",
      headers: {
        'Accept': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return await handleResponse(res);
  } catch (error) {
    console.error("API DELETE Error:", error);
    throw error;
  }
};

// Auth endpoints
export const loginUser = async (credentials) => {
  return postData('users/login', credentials);
};

export const registerUser = async (userData) => {
  return postData('users/signup', userData);
};

export const getUserProfile = async () => {
  return getData('users/profile');
};

// Post endpoints
export const getPosts = async () => {
  const response = await getData('posts');
  // Handle different response structures
  return response.data || response;
};

export const getPost = async (id) => {
  const response = await getData(`posts/${id}`);
  return response.data || response;
};

export const createPost = async (postData, token) => {
  // Check if postData contains image (FormData)
  const isFormData = postData instanceof FormData;
  const response = await postData('posts', postData, isFormData);
  return response.data || response;
};

export const updatePost = async (id, postData) => {
  const isFormData = postData instanceof FormData;
  const response = await putData(`posts/${id}`, postData, isFormData);
  return response.data || response;
};

export const deletePost = async (id) => {
  return deleteData(`posts/${id}`);
};

export const likePost = async (id) => {
  const response = await putData(`posts/${id}/like`, {});
  return response.data || response;
};

export const unlikePost = async (id) => {
  const response = await putData(`posts/${id}/unlike`, {});
  return response.data || response;
};

// Comment endpoints
export const getComments = async (postId) => {
  const response = await getData(`comments/${postId}`);
  return response.data || response;
};

export const addComment = async (commentData, token) => {
  const response = await postData('comments', commentData);
  return response.data || response;
};

export const deleteComment = async (id) => {
  return deleteData(`comments/${id}`);
};

// Category endpoints
export const getCategories = async () => {
  const response = await getData('categories');
  return response.data || response;
};

export const createCategory = async (categoryData) => {
  const response = await postData('categories', categoryData);
  return response.data || response;
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }
    
    return data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};