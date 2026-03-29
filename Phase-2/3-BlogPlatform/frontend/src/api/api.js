const API_URL = "http://localhost:5000/api";
import { requestQueue } from '../utils/requestQueue';

// Remove these lines if they don't exist at the top of your file:
// let postsCache = null;
// let postsCacheTime = 0;
// const CACHE_DURATION = 60000; // 1 minute cache
// const requestDeduplicator = null; // This is not defined

// Helper function to handle API responses with better error handling
const handleResponse = async (response) => {
  let data;
  
  try {
    data = await response.json();
  } catch (e) {
    throw new Error('Server returned an invalid response');
  }
  
  if (!response.ok) {
    // Handle rate limiting specifically
    if (response.status === 429) {
      throw new Error('Too many requests. Please wait a few minutes before trying again.');
    }
    
    // Handle other specific error cases
    if (response.status === 401) {
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
      console.error('Server 500 Error:', data);
      throw new Error(data.message || 'Server error. Please try again later.');
    }
    
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
    console.log(`Queueing GET request to: ${API_URL}/${endpoint}`);
    
    const result = await requestQueue.add(async () => {
      console.log(`Executing GET request to: ${API_URL}/${endpoint}`);
      
      const res = await fetch(`${API_URL}/${endpoint}`, {
        headers: {
          'Accept': 'application/json',
          ...getAuthHeaders(),
        },
      });
      
      return await handleResponse(res);
    });
    
    return result;
  } catch (error) {
    console.error(`API GET Error (${endpoint}):`, error);
    error.message = `Failed to fetch ${endpoint}: ${error.message}`;
    throw error;
  }
};

// Update postData function
export const postData = async (endpoint, data, isFormData = false) => {
  try {
    console.log(`Queueing POST request to: ${API_URL}/${endpoint}`);
    
    const result = await requestQueue.add(async () => {
      console.log(`Executing POST request to: ${API_URL}/${endpoint}`);
      
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
    });
    
    return result;
  } catch (error) {
    console.error(`API POST Error (${endpoint}):`, error);
    error.message = `Failed to post to ${endpoint}: ${error.message}`;
    throw error;
  }
};

// Update putData function
export const putData = async (endpoint, data, isFormData = false) => {
  try {
    console.log(`Queueing PUT request to: ${API_URL}/${endpoint}`);
    
    const result = await requestQueue.add(async () => {
      console.log(`Executing PUT request to: ${API_URL}/${endpoint}`);
      
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
    });
    
    return result;
  } catch (error) {
    console.error(`API PUT Error (${endpoint}):`, error);
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
    const response = await postData('users/login', credentials);
    
    // Store user data
    if (response && response._id) {
      localStorage.setItem('userId', response._id);
      localStorage.setItem('userName', response.name);
      localStorage.setItem('userEmail', response.email);
      localStorage.setItem('userRole', response.role);
      localStorage.setItem('token', response.token);
      
      // Store avatar if available
      if (response.avatar) {
        localStorage.setItem('userAvatar', response.avatar);
      }
    }
    
    return response;
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

// Post endpoints - FIXED: removed requestDeduplicator
export const getPosts = async (forceRefresh = false) => {
  try {
    // Simple cache implementation
    const cacheKey = 'posts_cache';
    const cacheTimeKey = 'posts_cache_time';
    const CACHE_DURATION = 60000; // 1 minute cache
    
    if (!forceRefresh) {
      const cached = localStorage.getItem(cacheKey);
      const cacheTime = localStorage.getItem(cacheTimeKey);
      
      if (cached && cacheTime && (Date.now() - parseInt(cacheTime)) < CACHE_DURATION) {
        console.log('Returning cached posts');
        return JSON.parse(cached);
      }
    }
    
    const response = await getData('posts');
    const data = response.data || response;
    
    // Store in cache
    localStorage.setItem(cacheKey, JSON.stringify(data));
    localStorage.setItem(cacheTimeKey, Date.now().toString());
    
    return data;
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
    
    // Clear posts cache after creating a new post
    localStorage.removeItem('posts_cache');
    localStorage.removeItem('posts_cache_time');
    
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
    
    // Clear posts cache after updating a post
    localStorage.removeItem('posts_cache');
    localStorage.removeItem('posts_cache_time');
    
    return response.data || response;
  } catch (error) {
    console.error('Update post error:', error);
    throw new Error(error.message || 'Failed to update post. Please try again.');
  }
};

export const deletePost = async (id) => {
  try {
    const response = await deleteData(`posts/${id}`);
    
    // Clear posts cache after deleting a post
    localStorage.removeItem('posts_cache');
    localStorage.removeItem('posts_cache_time');
    
    return response;
  } catch (error) {
    console.error('Delete post error:', error);
    throw new Error(error.message || 'Failed to delete post. Please try again.');
  }
};

export const likePost = async (id) => {
  try {
    const response = await putData(`posts/${id}/like`, {});
    
    // Clear posts cache after liking a post
    localStorage.removeItem('posts_cache');
    localStorage.removeItem('posts_cache_time');
    
    return response.data || response;
  } catch (error) {
    console.error('Like post error:', error);
    throw new Error(error.message || 'Failed to like post. Please try again.');
  }
};

export const unlikePost = async (id) => {
  try {
    const response = await putData(`posts/${id}/unlike`, {});
    
    // Clear posts cache after unliking a post
    localStorage.removeItem('posts_cache');
    localStorage.removeItem('posts_cache_time');
    
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
    const response = await putData('users/profile', data, isFormData);
    
    // Update localStorage with new user data
    if (response && response.user) {
      if (response.user.name) localStorage.setItem('userName', response.user.name);
      if (response.user.email) localStorage.setItem('userEmail', response.user.email);
      if (response.user.avatar) {
        localStorage.setItem('userAvatar', response.user.avatar);
      }
    }
    
    return response;
  } catch (error) {
    console.error('Update profile error:', error);
    throw new Error(error.message || 'Failed to update profile. Please try again.');
  }
};

// uploadAvatar function
export const uploadAvatar = async (file, retryCount = 0) => {
  try {
    let formData;
    if (file instanceof FormData) {
      formData = file;
    } else {
      formData = new FormData();
      formData.append('avatar', file);
    }
    
    if (retryCount > 0) {
      await new Promise(resolve => setTimeout(resolve, 2000 * retryCount));
    }
    
    console.log('Uploading avatar, file size:', file.size || 'unknown');
    
    const response = await putData('users/avatar', formData, true);
    
    // Extract avatar URL from response - should be relative path
    let avatarUrl = null;
    if (response && response.avatar) {
      avatarUrl = response.avatar;
    } else if (response && response.user && response.user.avatar) {
      avatarUrl = response.user.avatar;
    }
    
    // Update localStorage with new avatar
    if (avatarUrl) {
      localStorage.setItem('userAvatar', avatarUrl);
    }
    
    return { success: true, avatar: avatarUrl, data: response };
  } catch (error) {
    console.error('Avatar upload error:', error);
    
    if (error.message.includes('Too many requests') && retryCount < 1) {
      console.log('Rate limited, retrying after delay...');
      return await uploadAvatar(file, retryCount + 1);
    }
    
    throw new Error(error.message || 'Failed to upload avatar. Please try again later.');
  }
};

// Follow/Unfollow endpoints
export const followUser = async (userId) => {
  try {
    return await postData(`users/${userId}/follow`, {});
  } catch (error) {
    console.error('Follow user error:', error);
    throw new Error(error.message || 'Failed to follow user');
  }
};

export const unfollowUser = async (userId) => {
  try {
    return await postData(`users/${userId}/unfollow`, {});
  } catch (error) {
    console.error('Unfollow user error:', error);
    throw new Error(error.message || 'Failed to unfollow user');
  }
};

export const getFollowers = async (userId) => {
  try {
    return await getData(`users/${userId}/followers`);
  } catch (error) {
    console.error('Get followers error:', error);
    throw error;
  }
};

export const getFollowing = async (userId) => {
  try {
    return await getData(`users/${userId}/following`);
  } catch (error) {
    console.error('Get following error:', error);
    throw error;
  }
};

export const checkFollowing = async (userId) => {
  try {
    return await getData(`users/${userId}/is-following`);
  } catch (error) {
    console.error('Check following error:', error);
    return { following: false };
  }
};