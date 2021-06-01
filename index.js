import dotenv from "dotenv"
import path from "path"
import UserFeatureModel from "./model/userFeature.model"
import mongoose from "mongoose"

dotenv.config({
  path: path.resolve(__dirname + "/config/.env"),
})

export default class Permissions {
  constructor(authToken) {
    this.authToken = authToken
    let authSplitted = authToken.split("-")
    this.dbName = authSplitted[1]
    this.orgId = authSplitted[0]
  }
  async init() {
    let { dbName } = this
    let url =
      process.env.MONGO_ACCESS_TOKEN_FIRST +
      dbName +
      process.env.MONGO_ACCESS_TOKEN_LAST

    let conn = await mongoose.connect(url, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    this.connection = conn
  }
  async isActive(userId, featureId) {
    try {
      let record = await UserFeatureModel.findOne({ userId, featureId })

      let { status } = record || {}

      return status === "ACTIVE"
    } catch (error) {
      return error
    }
  }
}
