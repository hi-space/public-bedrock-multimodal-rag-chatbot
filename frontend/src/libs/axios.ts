import axios from 'axios'

const axiosIns = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_HOST,
  timeout: 50000,
  headers: { 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS' }
})

export default axiosIns
