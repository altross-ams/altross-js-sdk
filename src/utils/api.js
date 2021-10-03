import axios from "axios"
class API {
  init({ authToken, orgId }) {
    this.authToken = authToken
    this.orgId = orgId
    axios.interceptors.request.use((config) => {
      config.headers.Authorization = "Bearer " + this.authToken
      config.headers["orgid"] = this.orgId

      config.url = `https://api.altross.com/${config.url}`

      return config
    })

    axios.interceptors.response.use(
      function (response) {
        let { data } = response
        return data
      },
      function (error) {
        console.log(error)
        return Promise.reject(error)
      }
    )
    this.request = axios
  }
}

const api = new API()

export default api
