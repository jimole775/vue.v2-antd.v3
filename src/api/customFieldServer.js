// import axios from 'axios'
import { axios } from '@/utils/request'

export function getCache(params) {
  return axios.post('/assigneeConfig/list', params).then(response => {
    return response
  })
}

export function saveCache(params) {
  return axios.post('/assigneeConfig/saveOrUpdate', params).then(response => {
    return response
  })
}
