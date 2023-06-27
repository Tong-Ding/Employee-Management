import axios from 'axios'
import store from '@/store'
import Router from '@/router'
import { removeToken, getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true,
  timeout: 500000
})


// axios请求拦截器
service.interceptors.request.use(
  config => {
    let token = getToken()
    if (token) {
      config.headers['token'] = token
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)


//axios响应拦截器
service.interceptors.response.use(
  res => {
    if (res.data.code === 0 && res.data.msg === 'NOT_LOGIN') {
      // If the response indicates that the user is not logged in, redirect to the login page
      console.log('User not logged in, redirecting to the login page')
      removeToken()
      Router.replace('/login')
      return res
    } else {
      // For other responses, simply return the response
      return res
    }
  },
  error => {
    console.log('Error: ' + error)
    let { message } = error
    if (message == 'Network Error') {
      message = 'Backend API connection exception'
    } else if (message.includes('timeout')) {
      message = 'System API request timed out'
    } else if (message.includes('Request failed with status code')) {
      message = 'System API ' + message.substr(message.length - 3) + ' exception'
    }
    return Promise.reject(error)
  }
)


export default service
