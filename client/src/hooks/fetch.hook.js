import axios from 'axios';
import { useState, useEffect } from 'react';
import { getUsername } from '../helper/helper.js';

// specify backend domain
axios.defaults.baseURL = import.meta.env.VITE_APP_SERVER_DOMAIN;

/** custom hook */
export default function useFetch(query) {
    const [getData, setData] = useState({
        isLoading: false,
        apiData: undefined,
        status: null,
        serverError: null
    });

    useEffect(() => {
        // if there are values inside the query fetch data from query 
        const fetchData = async () => {
            try {
                //  if there is a valid request, make isLoading=true and make a request after it
                setData(prev => ({ ...prev, isLoading: true }));
                // specify any endpoint and get your data
                //  when we don’t have any token

                const { username } = !query ? await getUsername() : '';
                // if we don’t have query, then execute the true block or execute the false block
                const { data, status } = !query ? await axios.get(`api/user/${username}`) : await axios.get(`/api/${query}`);

                if (status === 201) {
                    setData(prev => ({ ...prev, isLoading: false }));
                    setData(prev => ({ ...prev, apiData: data, status: status }));
                }

                setData(prev => ({ ...prev, isLoading: false }));
            } catch (error) {
                // if there is an error, set loading: false and set serverError: error.
                setData(prev => ({ ...prev, isLoading: false, serverError: error }));
            }
        };
        fetchData();
    }, [query]);

    return [getData, setData];
}
