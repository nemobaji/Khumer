import axios from "axios";
import https from "https";
import { BASE_URL } from "./config/api.js";

const agent = new https.Agent({
    rejectUnauthorized: false,
});

const getSeats = async () => {
  try {
    const response = await axios.get(BASE_URL, {httpsAgent: agent});
    const seatData = response.data.data;

    // 좌석 정보에서 name, seatTime 추출하여 배열로 반환
    return seatData.map((seat) => ({
      name: seat.name,
      isOccupied: !!seat.seatTime,
    }));
  } catch (error) {
    console.error(':: error occurred: ', error);
    return [];
  }
};

export default getSeats;