const axios = require('axios');
const url = 'https://www.thesportsdb.com/api/v1/json/3';

const searchPlayers = async (keyword) => {
    try {
        const response = await axios.get(`${url}/searchplayers.php?p=${keyword}`);
        return response.data.player;
    } catch (err) {
        console.log(err);
    }
};

const lookUpId = async (id) => {
    try {
        const response = await axios.get(`${url}/lookupplayer.php?id=${id}`);
        return response.data.players[0];
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    searchPlayers,
    lookUpId
};





