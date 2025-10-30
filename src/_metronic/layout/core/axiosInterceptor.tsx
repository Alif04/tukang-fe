import axios from 'axios'
import Swal from 'sweetalert2'

const apiUrl = process.env.REACT_APP_API_URL

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
    'ngrok-skip-browser-warning': 'true',
  },
})

// Set global axios default Authorization if token exists (covers modules using axios directly)
const existingToken = localStorage.getItem('accessToken')
if (existingToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${existingToken}`
}

// Attach the latest token on each axios-instance request and keep global axios default in sync
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      if (config.headers) config.headers.Authorization = `Bearer ${token}`
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      Swal.fire({
        title: 'Sesi Anda Telah Berakhir',
        text: 'Silahkan Logout dan Login Ulang Kembali',
        icon: 'warning',
        showConfirmButton: false,
      })

      setTimeout(() => {
        localStorage.clear()
        window.location.href = '/login'
      }, 2000)
    } else {
      console.error('Error while fetching data', error)
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
