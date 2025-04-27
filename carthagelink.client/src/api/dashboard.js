import axios from 'axios';

const API_URL = '/api/Dashboard';

export const getCardData = async () => {
    const response = await axios.get(
        API_URL + "/CardData",
    );

    return response;
}

export const getMapData = async () => {
    const response = await axios.get(
        API_URL + "/MapData",
    );

    return response;
}