import axios from 'axios'
import Swal from 'sweetalert2'

const apiUrl = process.env.REACT_APP_API_URL
const accessToken = localStorage.getItem('accessToken')

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${accessToken}`,
    'Access-Control-Allow-Origin': '*',
    'ngrok-skip-browser-warning': 'true',
  },
})

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
