import axios from 'axios';
import { useState, useEffect } from "react";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

const useFetch = (url) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshIndex, setRefreshIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axiosInstance.get(url);

                if (!response.data.success) {
                    throw new Error(response.data.message);
                }

                setData(response.data.data);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        if (url) {
            fetchData();
        }
    }, [url, refreshIndex]);

    const refetch = () => {
        setRefreshIndex(prev => prev + 1);
    };

    return { data, loading, error, refetch };
};

export { axiosInstance };
export default useFetch;