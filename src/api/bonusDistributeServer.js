import { axios } from '@/utils/request'
import { urlParam } from '@/utils/util'
export function getList(parameter) {
  const url = `/alloc/list${urlParam(parameter)}`
  return axios.get(url).then(response => {
    return response
  })
}

export function getPendingHandledList(parameter) {
  const url = `/alloc/collect${urlParam(parameter)}`
  return axios.get(url).then(response => {
    return response
  })
}

export function getDistributingSummary(parameter) {
  const url = `/alloc/summary${urlParam(parameter)}`
  return axios.get(url).then(response => {
    return response
  })
}

export function getDistributingMemberList(parameter) {
  const url = `/treeMember/allot/memberList`
  return axios.post(url, parameter).then(response => {
    return response
  })
}

export function save(parameter) {
  const url = `/alloc/save`
  return axios.post(url, parameter).then(response => {
    return response
  })
}

export function approval(parameter) {
  const url = `/alloc/fexamine`
  return axios.post(url, parameter).then(response => {
    return response
  })
}

export function distributeCompletion(parameter) {
  const url = `/alloc`
  return axios.post(url, parameter).then(response => {
    return response
  })
}

export function submitPendingUnit(parameter) {
  const url = `/alloc/submit${urlParam(parameter)}`
  return axios.get(url).then(response => {
    return response
  })
}

export function getSaveFeedback(parameter) {
  return axios({
    url: '/feedback/save',
    method: 'post',
    data: parameter
  })
}

export function getFeedbackList(parameter) {
  return axios({
    url: '/feedback/list',
    method: 'post',
    data: parameter
  })
}

export function deleteFocusMemberServe(parameter) {
  return axios({
    url: '/alloc/fouceon/remove',
    method: 'post',
    data: parameter
  })
}

export function communicateServe(parameter) {
  return axios({
    url: '/treeMember/allot/communicated',
    method: 'post',
    data: parameter
  })
}
