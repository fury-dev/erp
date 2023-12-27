import axios from 'axios';
import { useState } from 'react';

export const useLocationApi = () => {
  const [countries, setCountries] = useState<any[]>([]);
  const [state, setState] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  const getCountries = async () => {
    try {
      const response = await axios.get('/v1/countries');
      setCountries(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getStates = async (country?: string) => {
    try {
      const response = await axios.get(country ? `/v1/countries/${country}/state` : '/v1/states');
      setState(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  const getCities = async (state?: string, country?: string) => {
    try {
      const response = await axios.get(
        !state && country ? `/v1/countries/${country}/cities` : `/v1/countries/${country}/state/${state}/cities`
      );
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
