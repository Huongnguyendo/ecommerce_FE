import axios from "axios";
import { enqueueSnackbar } from 'notistack';

const api = axios.create({
  baseURL: (process.env.REACT_APP_BACKEND_API || "http://localhost:5001") + "/api",
  headers: {
    "Content-Type": "application/json",
    // "authorization": "Bearer " + localStorage.getItem("accessToken")
  },
});

/**
 * console.log all requests and responses
 */
api.interceptors.request.use(
  (request) => {
    if(localStorage.getItem('accessToken')) {
      request.headers.authorization = `Bearer ${localStorage.getItem('accessToken')}`
    }
    // console.log("Starting Request", request);
    return request;
  },
  function (error) {
    // Log request errors for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error("REQUEST ERROR", error);
    }
  }
);

api.interceptors.response.use(
  (response) => {
    // console.log("Response:", response);

    // if (response.data.data && response.data.data.accessToken) {
    //   console.log('replacing access token', response.data.data.accessToken)
    //   api.defaults.headers.common["authorization"] =
    //     "Bearer " + response.data.data.accessToken;
    // }
    return response;
  },
  function (error) {
    const errorData = error.response?.data || {};
    // Extract error message from different possible locations
    let errorMsg = "";
    
    // Check for error in data.error (our custom format)
    if (errorData.data?.error) {
      if (typeof errorData.data.error === 'string') {
        errorMsg = errorData.data.error;
        // If there are details, append them
        if (errorData.data.details && Array.isArray(errorData.data.details)) {
          errorMsg += ': ' + errorData.data.details.join(', ');
        }
      } else {
        errorMsg = errorData.data.error.message || JSON.stringify(errorData.data.error);
      }
    }
    // Check for error in data.errors (validation errors from express-validator)
    else if (errorData.errors) {
      if (typeof errorData.errors === 'string') {
        errorMsg = errorData.errors;
      } else if (errorData.errors.message) {
        errorMsg = errorData.errors.message;
      } else if (Array.isArray(errorData.errors)) {
        // Handle express-validator format: [{ "field": "message" }, ...]
        errorMsg = errorData.errors.map(err => {
          if (typeof err === 'string') return err;
          // Extract field name and message from objects like { "name": "Missing name" }
          const entries = Object.entries(err);
          return entries.map(([field, msg]) => `${field}: ${msg}`).join(', ');
        }).join('; ');
      } else if (typeof errorData.errors === 'object') {
        // Handle object format: { "field": "message" }
        errorMsg = Object.entries(errorData.errors)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join(', ');
      }
    }
    // Check for error.message
    else if (errorData.message) {
      errorMsg = errorData.message;
    }
    // Fallback
    else {
      errorMsg = error.message || "An error occurred";
    }
    
    if (errorMsg) {
      enqueueSnackbar(errorMsg, { variant: 'error' });
    }
    return Promise.reject(error);
  }
);

export default api;
