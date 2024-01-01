import axiosInstance from 'axios';
import { useState } from 'react';
const axios = axiosInstance.create({
  baseURL: 'https://api.countrystatecity.in/v1'
});

axios.interceptors.request.use(async (config: any) => {
  if (['post', 'get', 'put', 'delete'].includes(config.method)) {
    try {
      config.headers['X-CSCAPI-KEY'] =
        //@ts-ignore
        import.meta?.env?.VITE_LOCATION_API_KEY;
      config.headers['Access-Control-Allow-Origin'] = '*';
    } catch (e) {
      console.error(e);
    }
    return config;
  }
});
export const useLocationApi = () => {
  const [countries, setCountries] = useState<any[]>([]);
  const [state, setState] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const getCountries = async () => {
    try {
      const response = await axios.get('/countries');
      setCountries(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  const getStates = async (country?: string) => {
    try {
      const response = await axios.get(country ? `/countries/${country}/states` : '/states');
      setState(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  const getCities = async (state?: string, country?: string) => {
    try {
      const response = await axios.get(!state && country ? `/countries/${country}/cities` : `/countries/${country}/states/${state}/cities`);
      setCities(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  return {
    countries,
    state,
    cities,
    getCountries,
    getStates,
    getCities
  };
};
