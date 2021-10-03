import api from "./utils/api"
import { checkPermissionForce, checkPermission } from "./methods/hasPermission"
import { createRecord, deleteRecord, updateRecord } from "./methods/crud"

export default class Permissions {
  constructor({ authToken, orgId }) {
    this.authToken = authToken
    this.orgid = orgId
    api.init({ authToken, orgId })
  }
  async init(userId) {
    let response = await api.post("/v1/getPermissions/users", { userId })
    let { data } = response || {}
    if (data) {
      this.activePermissions = data.permissions
      this.user = data.user
      return this.activePermissions
    } else {
      return new Error("NO records found")
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
