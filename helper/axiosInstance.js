// axiosInstance.js
const axios =  require("axios");
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/', // Replace with your API base URL
  timeout: 5000, // Specify a timeout (optional)
});


module.exports = axiosInstance
