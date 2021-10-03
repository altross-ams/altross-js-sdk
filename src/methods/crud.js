import api from "../utils/api"

export const createRecord = async ({ moduleName, data }) => {
  let response = await api.post(`/v1/create/${moduleName}`, data)
  return response
}

export const updateRecord = async ({ moduleName, data, id }) => {
  let response = await api.put(`/v1/update/${moduleName}`, { data, id })
  return response
}

export const deleteRecord = async ({ moduleName, id }) => {
  let response = await api.delete(`/v1/delete/${moduleName}`, { id })
  return response
}
