import fetch from "node-fetch"

export default class Permissions {
  constructor(authToken, orgid) {
    this.authToken = authToken
    this.orgid = orgid
  }
  async init() {
    let filter = { filter: { status: "ACTIVE" } }
    let response = await fetch(
      "http://localhost:5000/api/v1/modules/list/userFeature",
      {
        method: "post",
        body: JSON.stringify(filter),
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          orgid: this.orgid,
        },
      }
    )
    let jsonResponse = await response.json()
    let { data } = jsonResponse
    this.userFeatures = data
  }
  async isActive(userId, featureId) {
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
}
