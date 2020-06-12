// import axios from 'axios'
import { axios } from '@/utils/request'
import { urlParam, downloadBlobFile } from '@/utils/util'

export function getRuleList(params) {
  return axios.post('/rule/list', params).then(response => {
    return response
  })
}

export function getDetail(id) {
  return axios.get('/rule/detailList/' + id).then(response => {
    return response
  })
}

export function save(parameter) {
  return axios.post('/rule/saveOrUpdate', parameter).then(response => {
    return response
  })
}

export function del(id) {
  return axios.delete(`/rule/delete/${id}`).then(response => {
    return response
  })
}

export function downloadExcel(parameter, fileName = '') {
  return axios({
    url: `/rule/export${urlParam(parameter)}`,
    method: 'get',
    responseType: 'blob'
  }).then(response => {
    const res = {}
    if (response) {
      res.code = 200
      res.msg = '下载成功'
      res.data = null
      downloadBlobFile(response, fileName)
    } else {
      res.code = 0
      res.msg = '下载失败'
      res.data = null
    }
    return res
  })
}
