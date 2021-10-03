import https from "https"

const ALTROSS_BASE_URL = "api.altross.com"
class API {
  init({ authToken, orgId }) {
    this.authToken = authToken
    this.orgId = orgId
    this.defaultRequest = {
      host: ALTROSS_BASE_URL,
      path: "",
      method: "POST",
    }
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.authToken,
      orgid: this.orgId,
    }
  }
  _createRequestData(data) {
    let requests = { ...this.defaultRequest, ...data }

    this.defaultRequest = { ...requests, headers: this.defaultHeaders }
  }
  _createHeaders(data) {
    let headers = { ...this.defaultHeaders, ...data }

    this.defaultHeaders = headers
  }
  _makeRequest(param) {
    return new Promise((resolve) => {
      const req = https.request(this.defaultRequest, (res) => {
        res.on("data", (d) => {
          console.log(JSON.parse(d))
          let responseData = JSON.parse(d)
          resolve(responseData)
        })
      })

      req.on("error", (error) => {
        resolve({ data: null, error })
      })

      req.write(param)
      req.end()
    })
  }
  post(path, params) {
    let param = JSON.stringify(params)
    this._createHeaders({ "Content-Length": param.length })
    this._createRequestData({ path: path, method: "POST" })
    return this._makeRequest(param)
  }
  put(path, params) {
    let param = JSON.stringify(params)
    this._createHeaders({ "Content-Length": param.length })
    this._createRequestData({ path: path, method: "PUT" })

    return this._makeRequest(param)
  }
  delete(path, params) {
    let param = JSON.stringify(params)
    this._createHeaders({ "Content-Length": param.length })
    this._createRequestData({ path: path, method: "DELETE" })

    return this._makeRequest(param)
  }
}
const api = new API()
export default api
