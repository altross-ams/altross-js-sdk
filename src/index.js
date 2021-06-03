import axios from "axios"

const ALTROSS_BASE_URL = "http://localhost:5000/api"

export default class Permissions {
  constructor(authToken, orgid) {
    this.authToken = authToken
    this.orgid = orgid
    this.defaultRequest = {
      baseURL: ALTROSS_BASE_URL,
      url: "",
      method: "POST",
      headers: {
        Authorization: "Bearer " + authToken,
        orgid: orgid,
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    }
  }
  async init() {
    let param = { filter: { status: "ACTIVE" } }
    let url = "v1/modules/list/userFeature"
    let data = this.createRequest({ data: param, url })
    try {
      let response = await axios(data)
      let { data: records, meta } = response.data
      if (records) this.userFeatures = this.serializeRecords(records, meta)
    } catch (error) {
      return error
    }
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
  createRequest(data) {
    let options = { ...this.defaultRequest, ...data }

    return options
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
        console.log(features)
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
