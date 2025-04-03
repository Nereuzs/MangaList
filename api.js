const axios = require('axios');
require('dotenv').config();

const searchAnime = async (query) => {
  const response = await axios.get(`https://api.myanimelist.net/v2/anime?q=${query}&limit=5`, {
    headers: {
      'X-MAL-CLIENT-ID': process.env.MAL_CLIENT_ID
    }
  });
  return response.data.data;
};

module.exports = { searchAnime };