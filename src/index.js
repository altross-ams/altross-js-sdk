import http from "http"
import util from "./util"

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
          if (data && meta) {
            this.userFeatures = this.serializeRecords(data, meta)
            resolve(this.userFeatures)
          } else {
            reject(new Error("No records found"))
          }
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
  isActive(userId, featureId, resource, actor) {
    try {
      let { userFeatures } = this
      let selectedUserFeature = userFeatures.find((record) => {
        return userId === record.userId && featureId === record.featureId
      })

      let param = JSON.stringify({
        userId: userId,
        featureId: featureId,
        resource,
        actor,
      })

      if (util.isEmpty(resource)) delete param["resource"]
      if (util.isEmpty(actor)) delete param["actor"]

      this.createHeaders({ "Content-Length": param.length })
      this.createRequestData({ path: "/api/v1/modules/hasPermission/users" })

      return new Promise((resolve, reject) => {
        const req = http.request(this.defaultRequest, (res) => {
          res.on("data", (d) => {
            let responseData = JSON.parse(d)
            let { data } = responseData || {}
            if (data) {
              let { status } = data || {}

              resolve(status === "ACTIVE" ? true : false)
            } else {
              reject(new Error("No records found"))
            }
          })
        })

        req.on("error", (error) => {
          reject(error)
        })

        req.write(param)
        req.end()
      })
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
