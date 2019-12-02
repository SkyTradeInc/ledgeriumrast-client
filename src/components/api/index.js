import axios from 'axios';
import { baseURL } from '../../constants/defaultValues';

const defaultOptions = {
    baseURL,
};

const instance = axios.create(defaultOptions);

instance.interceptors.response.use( (response) => {
   return response;
}, (error) => {
  console.log(error.response)
   switch (error.response) {
        default:
            return error.response;
            break;
   }
return Promise.reject(error.response);
});

export default instance;
