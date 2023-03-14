import Axios, { AxiosInstance } from 'axios';

/**
 * Requests
 */
class Requests {
  static client: Requests;

  axios: AxiosInstance;

  constructor() {
    this.axios = Axios.create({
      baseURL: process.env.REACT_APP_API_END_POINT,
    });

    this.axios.defaults.timeout = 35000;
  }
  static getInstance = () => {
    if (!Requests.client) {
      Requests.client = new Requests();
    }
    return Requests.client;
  };

  trainModel = (formData: FormData) => this.axios.post('/api/train', formData);

  recognize = (formData: FormData) => this.axios.post('/api/recognize', formData);
}

export default Requests;