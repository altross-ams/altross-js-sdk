import api from "../utils/api"
import { isEmpty, isNumeric, replaceChar, dlv } from "../utils/helpers"
import { OPERATOR_HASH } from "../constants"

export const checkPermissionForce = async ({
  permissionId,
  resource,
  targetResource,
  user,
}) => {
  try {
    let { userId } = user || {}
    let param = {
      userId: userId,
      permissionId: permissionId,
      resource,
      targetResource,
    }

    if (isEmpty(resource)) delete param["resource"]
    if (isEmpty(targetResource)) delete param["targetResource"]

    let response = await api.request.post("v1/hasPermission/users", param)
    let { data } = response || {}
    if (data) {
      let { status } = data || {}

      return status === "ACTIVE" ? true : false
    } else {
      return false
    }
  } catch (error) {
    return { data: null, error }
  }
}

export const checkPermission = ({
  permissionId,
  resource,
  targetResource,
  user: userRecord,
  activePermissions,
}) => {
  try {
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

    if (userPermissionCheck(userRecord, permissionRecord)) {
      status = true
    } else {
      status = false
    }

    if (!isEmpty(conditions) && !isEmpty(conditionMatcher)) {
      if (isEmpty(resource)) {
        status = false
      }
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
          (!isEmpty(permissionGroup) && permissionGroup === currPermissionGroup)
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
            conditionMatcher = replaceChar(conditionMatcher, `${actualVal}`, i)
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

const userPermissionCheck = (user, permission) => {
  let { permissions } = user || {}
  let { id } = permission || {}
  return (permissions || []).includes(id)
}
