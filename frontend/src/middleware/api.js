import axios from 'axios'
import { setAccessToken, removeAccessToken, setLoading,setRefreshing } from '../slices/authSlice'
import store from '../store/store'
const backendUrl = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;
if (!backendUrl) {
    console.warn("VITE_BACKEND_URL is not defined. Please add it to your .env file and restart Vite.");
}

const api = axios.create({
    baseURL: backendUrl,
    withCredentials: true
})

api.interceptors.request.use((config) => {
    const accessToken = store.getState().auth.accessToken
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
},
    (error) => Promise.reject(error)
)
// Used for Handling Responses IF User Is not Verified
api.interceptors.response.use((response) => response,
    async (error) => {
        const originalRequest = error.config // Request that has failed
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                store.dispatch(setLoading())
                store.dispatch(setRefreshing(true));
                const { data } = await api.post("/auth/refresh-token")
                store.dispatch(setAccessToken(data.accessToken))
                store.dispatch(setRefreshing(false))
                originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`
                api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`
                return api(originalRequest)
            }
            catch (err) {
                console.log(err)
                store.dispatch(setRefreshing(false));
                store.dispatch(removeAccessToken())
                window.location.href = "/login"
            }

        }
        return Promise.reject(error)
    }
)

export default api