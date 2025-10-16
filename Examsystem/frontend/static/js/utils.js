// Utility functions for the E-Assessment Platform

// Date and Time Utilities
function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

function getCurrentTime() {
  const now = new Date();
  return now.toTimeString().split(' ')[0].slice(0, 5);
}

function formatDateTime(date, time) {
  const dateObj = new Date(`${date}T${time}`);
  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getTimeRemaining(endDate, endTime) {
  const end = new Date(`${endDate}T${endTime}`);
  const now = new Date();
  const diff = end - now;
  
  if (diff <= 0) return null;
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { days, hours, minutes };
}

// Validation Utilities
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  return password && password.length >= 6;
}

function validateRequired(value) {
  return value && value.toString().trim().length > 0;
}

function validateNumber(value, min = 0, max = Infinity) {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
}

// Array and Object Utilities
function groupBy(array, key) {
  return array.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
}

function sortBy(array, key, direction = 'asc') {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (direction === 'asc') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    }
  });
}

function filterBy(array, filters) {
  return array.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      
      const itemValue = item[key];
      if (typeof itemValue === 'string') {
        return itemValue.toLowerCase().includes(value.toLowerCase());
      }
      return itemValue === value;
    });
  });
}

// Search Utilities
function searchItems(items, searchTerm, searchFields) {
  if (!searchTerm) return items;
  
  const term = searchTerm.toLowerCase();
  return items.filter(item => {
    return searchFields.some(field => {
      const value = item[field];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(term);
      } else if (Array.isArray(value)) {
        return value.some(v => 
          typeof v === 'string' && v.toLowerCase().includes(term)
        );
      }
      return false;
    });
  });
}

// Statistics Utilities
function calculateAverage(numbers) {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return Math.round((sum / numbers.length) * 100) / 100;
}

function calculatePercentage(part, total) {
  if (total === 0) return 0;
  return Math.round((part / total) * 100 * 100) / 100;
}

function getGradeFromPercentage(percentage) {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  return 'F';
}

// Chart Data Utilities
function generateChartColors(count) {
  const baseColors = [
    '#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F',
    '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'
  ];
  
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }
  
  return colors;
}

function prepareTimeSeriesData(data, dateField, valueField, groupBy = 'month') {
  const grouped = {};
  
  data.forEach(item => {
    const date = new Date(item[dateField]);
    let key;
    
    if (groupBy === 'month') {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    } else if (groupBy === 'week') {
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay());
      key = startOfWeek.toISOString().split('T')[0];
    } else {
      key = date.toISOString().split('T')[0];
    }
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item[valueField]);
  });
  
  return Object.entries(grouped).map(([key, values]) => ({
    label: key,
    value: calculateAverage(values)
  }));
}

// Local Storage Simulation (since localStorage is not available)
class StorageSimulator {
  constructor() {
    this.data = {};
  }
  
  setItem(key, value) {
    this.data[key] = JSON.stringify(value);
  }
  
  getItem(key) {
    const value = this.data[key];
    try {
      return value ? JSON.parse(value) : null;
    } catch {
      return value;
    }
  }
  
  removeItem(key) {
    delete this.data[key];
  }
  
  clear() {
    this.data = {};
  }
  
  key(index) {
    const keys = Object.keys(this.data);
    return keys[index] || null;
  }
  
  get length() {
    return Object.keys(this.data).length;
  }
}

// Create global storage simulator
window.storageSimulator = new StorageSimulator();

// Export utilities (for module systems)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getCurrentDate,
    getCurrentTime,
    formatDateTime,
    getTimeRemaining,
    validateEmail,
    validatePassword,
    validateRequired,
    validateNumber,
    groupBy,
    sortBy,
    filterBy,
    searchItems,
    calculateAverage,
    calculatePercentage,
    getGradeFromPercentage,
    generateChartColors,
    prepareTimeSeriesData,
    StorageSimulator
  };
}