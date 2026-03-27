const API_URL = "http://localhost:5000/api";

// Helper function to handle API responses with better error handling
const handleResponse = async (response) => {
  let data;
  
  try {
    data = await response.json();
  } catch (e) {
    throw new Error('Server returned an invalid response');
  }
  
  if (!response.ok) {
    // Handle specific error cases
    if (response.status === 401) {
      // Unauthorized - clear local storage and redirect
      localStorage.clear();
      window.location.href = '/auth';
      throw new Error('Your session has expired. Please login again.');
    }
    
    if (response.status === 403) {
      throw new Error('You do not have permission to perform this action');
    }
    
    if (response.status === 404) {
      throw new Error('The requested resource was not found');
    }
    
    if (response.status === 500) {
      // Log the full error for debugging
      console.error('Server 500 Error:', data);
      throw new Error(data.message || 'Server error. Please try again later.');
    }
    
    // Throw the error message from server or a default message
    throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
  }
  
  return data;
};

// Helper to get auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// GET request with error handling
export const getData = async (endpoint) => {
  try {
    console.log(`GET Request to: ${API_URL}/${endpoint}`);
    
    const res = await fetch(`${API_URL}/${endpoint}`, {
      headers: {
        'Accept': 'application/json',
        ...getAuthHeaders(),
      },
    });
    
    return await handleResponse(res);
  } catch (error) {
    console.error(`API GET Error (${endpoint}):`, error);
    
    // Enhance error with endpoint info
    error.message = `Failed to fetch ${endpoint}: ${error.message}`;
    throw error;
  }
};

// POST request with error handling
export const postData = async (endpoint, data, isFormData = false) => {
  try {
    console.log(`POST Request to: ${API_URL}/${endpoint}`);
    console.log('Request data:', isFormData ? 'FormData (see network tab)' : data);
    
    const headers = {
      'Accept': 'application/json',
      ...getAuthHeaders(),
    };
    
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
    console.error(`API POST Error (${endpoint}):`, error);
    
    // Check if it's a network error
    if (error.message === 'Failed to fetch') {
      error.message = 'Network error: Could not connect to server. Please check if the backend is running.';
    }
    
    // Enhance error with endpoint info
    error.message = `Failed to post to ${endpoint}: ${error.message}`;
    throw error;
  }
};

// PUT request with error handling
export const putData = async (endpoint, data, isFormData = false) => {
  try {
    console.log(`PUT Request to: ${API_URL}/${endpoint}`);
    
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
    console.error(`API PUT Error (${endpoint}):`, error);
    
    if (error.message === 'Failed to fetch') {
      error.message = 'Network error: Could not connect to server.';
    }
    
    error.message = `Failed to update ${endpoint}: ${error.message}`;
    throw error;
  }
};

// DELETE request with error handling
export const deleteData = async (endpoint) => {
  try {
    console.log(`DELETE Request to: ${API_URL}/${endpoint}`);
    
    const res = await fetch(`${API_URL}/${endpoint}`, {
      method: "DELETE",
      headers: {
        'Accept': 'application/json',
        ...getAuthHeaders(),
      },
    });
    
    return await handleResponse(res);
  } catch (error) {
    console.error(`API DELETE Error (${endpoint}):`, error);
    
    if (error.message === 'Failed to fetch') {
      error.message = 'Network error: Could not connect to server.';
    }
    
    error.message = `Failed to delete ${endpoint}: ${error.message}`;
    throw error;
  }
};

// Auth endpoints
export const loginUser = async (credentials) => {
  try {
    return await postData('users/login', credentials);
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Login failed. Please check your credentials.');
  }
};

export const registerUser = async (userData) => {
  try {
    return await postData('users/signup', userData);
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error(error.message || 'Registration failed. Please try again.');
  }
};

export const getUserProfile = async () => {
  try {
    return await getData('users/profile');
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

// Post endpoints
export const getPosts = async () => {
  try {
    const response = await getData('posts');
    return response.data || response;
  } catch (error) {
    console.error('Get posts error:', error);
    throw new Error('Failed to load posts. Please refresh the page.');
  }
};

export const getPost = async (id) => {
  try {
    const response = await getData(`posts/${id}`);
    return response.data || response;
  } catch (error) {
    console.error('Get post error:', error);
    throw new Error('Failed to load the post. Please try again.');
  }
};


export const createPost = async (data, token) => {
  try {
    const isFormData = data instanceof FormData;
    const response = await postData('posts', data, isFormData);
    if (response && response.post) {
      return { 
        success: true, 
        data: { post: response.post } 
      };
    }
    
    return response.data || response;
  } catch (error) {
    console.error('Create post error:', error);
    
    if (error.message.includes('next is not a function')) {
      throw new Error('Server configuration error. Please contact support.');
    } else if (error.message.includes('validation failed')) {
      throw new Error('Please check your input and try again.');
    } else {
      throw new Error(error.message || 'Failed to create post. Please try again.');
    }
  }
};

export const updatePost = async (id, postData) => {
  try {
    const isFormData = postData instanceof FormData;
    const response = await putData(`posts/${id}`, postData, isFormData);
    return response.data || response;
  } catch (error) {
    console.error('Update post error:', error);
    throw new Error(error.message || 'Failed to update post. Please try again.');
  }
};

export const deletePost = async (id) => {
  try {
    return await deleteData(`posts/${id}`);
  } catch (error) {
    console.error('Delete post error:', error);
    throw new Error(error.message || 'Failed to delete post. Please try again.');
  }
};

export const likePost = async (id) => {
  try {
    const response = await putData(`posts/${id}/like`, {});
    return response.data || response;
  } catch (error) {
    console.error('Like post error:', error);
    throw new Error(error.message || 'Failed to like post. Please try again.');
  }
};

export const unlikePost = async (id) => {
  try {
    const response = await putData(`posts/${id}/unlike`, {});
    return response.data || response;
  } catch (error) {
    console.error('Unlike post error:', error);
    throw new Error(error.message || 'Failed to unlike post. Please try again.');
  }
};

// Comment endpoints
export const getComments = async (postId) => {
  try {
    const response = await getData(`comments/${postId}`);
    return response.data || response;
  } catch (error) {
    console.error('Get comments error:', error);
    throw new Error('Failed to load comments. Please refresh the page.');
  }
};

export const addComment = async (commentData) => {
  try {
    const response = await postData('comments', commentData);
    return response.data || response;
  } catch (error) {
    console.error('Add comment error:', error);
    throw new Error(error.message || 'Failed to add comment. Please try again.');
  }
};

export const deleteComment = async (id) => {
  try {
    return await deleteData(`comments/${id}`);
  } catch (error) {
    console.error('Delete comment error:', error);
    throw new Error(error.message || 'Failed to delete comment. Please try again.');
  }
};

// Category endpoints
export const getCategories = async () => {
  try {
    const response = await getData('categories');
    return response.data || response;
  } catch (error) {
    console.error('Get categories error:', error);
    // Return empty array as fallback
    return [];
  }
};

export const createCategory = async (categoryData) => {
  try {
    const response = await postData('categories', categoryData);
    return response.data || response;
  } catch (error) {
    console.error('Create category error:', error);
    throw new Error(error.message || 'Failed to create category. Please try again.');
  }
};
// ─── User profile update (name, bio, avatar) ──────────────────────────────
export const updateUserProfile = async (data, isFormData = false) => {
  try {
    return await putData('users/profile', data, isFormData);
  } catch (error) {
    console.error('Update profile error:', error);
    throw new Error(error.message || 'Failed to update profile. Please try again.');
  }
};

// ─── Upload avatar only ───────────────────────────────────────────────────
export const uploadAvatar = async (file) => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    return await putData('users/avatar', formData, true);
  } catch (error) {
    console.error('Avatar upload error:', error);
    throw new Error(error.message || 'Failed to upload avatar. Please try again.');
  }
};