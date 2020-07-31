import axios from 'axios';
import API_URL from './API';

const setupAxios = () => {
  axios.defaults.baseURL = API_URL;
  axios.defaults.headers.common['Content-Type'] = 'application/json';
  axios.defaults.headers.common['Accept-Version'] = 'v1';
  axios.defaults.headers.common.Authorization =
    'Client-ID NmSRgRl-asNSb56kpRBLMepUKj3FHI7j82Oy_b2IEWM';
};

export default setupAxios;
