import axios from 'axios';

export default axios.create({
    /*baseURL: 'http://localhost:3002/api/', */
    baseURL: `${process.env.REACT_APP_API_URL}`,
    withCredentials: true,
});