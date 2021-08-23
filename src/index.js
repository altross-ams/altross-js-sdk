import http from "http"
import { isEmpty, isNumeric, replaceChar, dlv } from "./util"
import { OPERATOR_HASH } from "./constants"

const ALTROSS_BASE_URL = "localhost"

export default class Permissions {
  constructor(authToken, orgid) {
    this.authToken = authToken
    this.orgid = orgid
    this.defaultRequest = {
      host: ALTROSS_BASE_URL,
      port: 5000,
      path: "/v1/getPermissions/users",
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
  async init(userId) {
    let param = JSON.stringify({ userId })
    this.createHeaders({ "Content-Length": param.length })
    this.createRequestData({})

    return new Promise((resolve, reject) => {
      const req = http.request(this.defaultRequest, (res) => {
        res.on("data", (d) => {
          let responseData = JSON.parse(d)
          let { data } = responseData || {}
          if (data) {
            this.activePermissions = data.permissions
            this.user = data.user
            resolve(this.activePermissions)
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
  hasPermission(permissionId, resource, targetResource, config) {
    let { force } = config || {}
    if (force) {
      return this.checkPermissionForce(permissionId, resource, targetResource)
    } else {
      return this.checkPermission(permissionId, resource, targetResource)
    }
  }
  checkPermissionForce(permissionId, resource, targetResource) {
    try {
      let { user } = this || {}
      let { userId } = user || {}
      let param = JSON.stringify({
        userId: userId,
        permissionId: permissionId,
        resource,
        targetResource,
      })

      if (isEmpty(resource)) delete param["resource"]
      if (isEmpty(targetResource)) delete param["targetResource"]

      this.createHeaders({ "Content-Length": param.length })
      this.createRequestData({ path: "/v1/hasPermission/users" })

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
  checkPermission(permissionId, resource, targetResource) {
    try {
      let { user: userRecord, activePermissions } = this || {}
      let currPermissionGroup = dlv(userRecord, "permissionGroup.0", null)
      let permissionRecord = activePermissions.find((permission) => {
        let { permissionId: currPermissionId } = permission || {}
        return currPermissionId === permissionId
      })

      let {
        conditions,
        conditionMatcher,
        users: permissionUsers,
      } = permissionRecord || {}
      let status

      if (this.userPermissionCheck(userRecord, permissionRecord)) {
        status = true
      } else {
        status = false
      }

      if (
        !isEmpty(conditions) &&
        !isEmpty(conditionMatcher) &&
        !isEmpty(resource)
      ) {
        let conditionsSatisfiedArray = conditions.map((condition) => {
          let {
            key,
            value,
            operator,
            dataType,
            permissionGroup,
            valueKey,
            valueType,
          } = condition
          let actualValue = resource[key]
          if (
            isEmpty(permissionGroup) ||
            (!isEmpty(permissionGroup) &&
              permissionGroup === currPermissionGroup)
          ) {
            if (
              !isEmpty(OPERATOR_HASH[dataType]) &&
              !isEmpty((OPERATOR_HASH[dataType] || {})[operator])
            ) {
              let selectedOperator = OPERATOR_HASH[dataType][operator]
              if (
                valueType === "DYNAMIC" &&
                !isEmpty(targetResource) &&
                !isEmpty(valueKey)
              ) {
                let val = targetResource[valueKey]
                return selectedOperator.action(actualValue, val)
              } else {
                return selectedOperator.action(actualValue, value)
              }
            }
          } else {
            let { id: currUserId } = userRecord

            if (permissionUsers.includes(currUserId)) return true
            else return false
          }
        })

        for (let i = 0; i < conditionMatcher.length; i++) {
          let charAtIndex = conditionMatcher.charAt(i)
          if (isNumeric(charAtIndex)) {
            let actualVal =
              conditionsSatisfiedArray[conditionMatcher.charAt(i) - 1]

            if (!isEmpty(actualVal)) {
              conditionMatcher = replaceChar(
                conditionMatcher,
                `${actualVal}`,
                i
              )
            } else {
              conditionMatcher = replaceChar(conditionMatcher, `${false}`, i)
            }
          }
        }

        conditionMatcher = conditionMatcher.replace(/and/g, "&&")
        conditionMatcher = conditionMatcher.replace(/or/g, "||")

        let finalStatus = eval(conditionMatcher)

        status = finalStatus
      }

      return status
    } catch (error) {
      return error
    }
  }

  userPermissionCheck(user, permission) {
    let { permissions } = user || {}
    let { id } = permission || {}
    return (permissions || []).includes(id)
  }
}
