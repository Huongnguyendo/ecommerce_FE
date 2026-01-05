/**
 * Utility functions for data transformation and type safety
 * Ensures consistent data handling across components
 */

/**
 * Safely extracts category name from various formats
 * @param {string|object|null|undefined} category - Category value (string, object with name, or null)
 * @param {string} fallback - Fallback value if category is invalid
 * @returns {string} Category name as string
 */
export const extractCategoryName = (category, fallback = 'N/A') => {
  if (!category) return fallback;
  
  if (typeof category === 'string') {
    return category;
  }
  
  if (typeof category === 'object' && category?.name) {
    return String(category.name);
  }
  
  return fallback;
};

/**
 * Safely extracts user/buyer name from various formats
 * @param {string|object|null|undefined} user - User value (string, object with name, or null)
 * @param {string} fallback - Fallback value if user is invalid
 * @returns {string} User name as string
 */
export const extractUserName = (user, fallback = 'Unknown') => {
  if (!user) return fallback;
  
  if (typeof user === 'string') {
    return user;
  }
  
  if (typeof user === 'object' && user?.name) {
    return String(user.name);
  }
  
  return fallback;
};

/**
 * Safely converts value to number
 * @param {any} value - Value to convert
 * @param {number} fallback - Fallback value if conversion fails
 * @returns {number} Number value
 */
export const toNumber = (value, fallback = 0) => {
  if (value === null || value === undefined) return fallback;
  const num = Number(value);
  return isNaN(num) ? fallback : num;
};

/**
 * Safely converts value to string
 * @param {any} value - Value to convert
 * @param {string} fallback - Fallback value if conversion fails
 * @returns {string} String value
 */
export const toString = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  return String(value);
};

/**
 * Formats price with 2 decimal places
 * @param {number|string} price - Price value
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
  const num = toNumber(price);
  return num.toFixed(2);
};

