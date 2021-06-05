import http from "http"

const ALTROSS_BASE_URL = "localhost"

export default class Permissions {
  constructor(authToken, orgid) {
    this.authToken = authToken
    this.orgid = orgid
    this.defaultRequest = {
      host: ALTROSS_BASE_URL,
      port: 5000,
      path: "/api/v1/modules/list/userFeature",
      method: "POST",
    }
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.authToken,
      orgid: this.orgid,
    }
  }
  createRequestData(data) {
    let requests = { ...this.defaultRequest, ...data }

    this.defaultRequest = { ...requests, headers: this.defaultHeaders }
  }
  createHeaders(data) {
    let headers = { ...this.defaultHeaders, ...data }

    this.defaultHeaders = headers
  }
  async init() {
    let param = JSON.stringify({ filter: { status: "ACTIVE" } })
    this.createHeaders({ "Content-Length": param.length })
    this.createRequestData({})

    return new Promise((resolve, reject) => {
      const req = http.request(this.defaultRequest, (res) => {
        res.on("data", (d) => {
          let responseData = JSON.parse(d)
          let { data, meta } = responseData || {}
          this.userFeatures = this.serializeRecords(data, meta)
          resolve(this.userFeatures)
        })
      })

      req.on("error", (error) => {
        reject(error)
      })

      req.write(param)
      req.end()
    })
  }
  serializeRecords(listRecords, meta) {
    let finalRecord = []
    listRecords.forEach((record) => {
      let lookupFieldValues = {}
      Object.keys(meta).forEach((currMeta) => {
        if (Object.keys(record).includes(currMeta)) {
          lookupFieldValues[currMeta] = meta[currMeta].filter((metaValue) =>
            record[currMeta].includes(metaValue.id)
          )
        }
      })
      finalRecord.push({ ...record, ...lookupFieldValues })
    })
    return finalRecord
  }
  isActive(userId, featureId) {
    try {
      let { userFeatures } = this
      let selectedUserFeature = userFeatures.find((record) => {
        return userId === record.userId && featureId === record.featureId
      })

      let { status } = selectedUserFeature || {}
      return status === "ACTIVE" ? true : false
    } catch (error) {
      return error
    }
  }
  getAllActiveLicenses() {
    try {
      let { userFeatures } = this
      let selectedUserFeature = userFeatures.map((record) => {
        let { id, featureId, features } = record
        return {
          id,
          featureId,
          name: this.getFeatureNames(features),
        }
      })
      return selectedUserFeature
    } catch (error) {
      return error
    }
  }
  getFeatureNames(features) {
    return features.map((feature) => feature.name).find((feature) => feature)
  }
}
