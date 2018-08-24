import axios from '@/libs/api.request'

export const login = ({
  username,
  password
}) => {
  const data = {
    username,
    password
  }
  return axios.request({
    url: 'session',
    data,
    method: 'post'
  })
}

export const getUserInfo = () => {
  return axios.request({
    url: 'session/user',
    method: 'get'
  })
}

export const logout = () => {
  return axios.request({
    url: 'session',
    method: 'delete'
  })
}
