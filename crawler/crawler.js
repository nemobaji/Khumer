import axios from "axios";
import https from "https";

const agent = new https.Agent({
    rejectUnauthorized: false,
});

const getSeats = async (url, location) => {
  try {
    const URL = `${url}${location}`;
    const response = await axios.get(URL, {httpsAgent: agent});
    const seatData = response.data.data;

    return seatData.map((seat) => ({
      name: seat.name,
      isOccupied: !!seat.seatTime,
      expiredTime: seat.seatTime?.expireTime ?? null,
      location: location
    }));
  } catch (error) {
    console.error(':: error occurred: ', error);
    return [];
  }
};

export default getSeats;