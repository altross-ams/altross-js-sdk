import api from "../utils/api"

export const createRecord = async ({ moduleName, data }) => {
  try {
    let response = await api.request.post(`v1/create/${moduleName}`, data)
    return response
  } catch (error) {
    return { data: null, error }
  }
}

export const updateRecord = async ({ moduleName, data, id }) => {
  try {
    let response = await api.request.put(`v1/update/${moduleName}`, {
      data,
      id,
    })
    return response
  } catch (error) {
    return { data: null, error }
  }
}

export const deleteRecord = async ({ moduleName, id }) => {
  try {
    let response = await api.request.delete(`v1/delete/${moduleName}`, { id })
    return response
  } catch (error) {
    return { data: null, error }
  }
}
