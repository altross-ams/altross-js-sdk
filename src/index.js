import axios from "axios"
import api from "./utils/api"
import { checkPermissionForce, checkPermission } from "./methods/hasPermission"
import { createRecord, deleteRecord, updateRecord } from "./methods/crud"

export default class Permissions {
  constructor({ authToken, orgId }) {
    this.authToken = authToken
    this.orgid = orgId
    api.init({ authToken, orgId })
  }
  async setUserID(userId) {
    try {
      let { data, error } = await api.request.post("v1/getPermissions/users", {
        userId,
      })
      if (error) {
        throw error
      } else {
        this.activePermissions = data.permissions
        this.user = data.user
        return this.activePermissions
      }
    } catch (error) {
      return { data: null, error }
    }
  }
  async hasPermission({ permissionId, resource, targetResource, config }) {
    let { force } = config || {}
    let { user, activePermissions } = this
    if (force) {
      return await checkPermissionForce({
        permissionId,
        resource,
        targetResource,
        user,
      })
    } else {
      return checkPermission({
        permissionId,
        resource,
        targetResource,
        user,
        activePermissions,
      })
    }
  }
  async create(moduleName, { data }) {
    return await createRecord({ moduleName, data })
  }
  async update(moduleName, { data, id }) {
    return await updateRecord({ moduleName, data, id })
  }
  async delete(moduleName, { id }) {
    return await deleteRecord({ moduleName, id })
  }
}
