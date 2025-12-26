import axios from "axios";

const BASE = process.env.REACT_APP_BACKEND_URL;

export const getToken = (room, name) => {
  return axios.post(`${BASE}/api/getToken`, { room, name });
};
