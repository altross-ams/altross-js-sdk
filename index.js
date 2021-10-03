import axios from 'axios';

class API {
  init({ authToken, orgId }) {
    this.authToken = authToken;
    this.orgId = orgId;
    axios.interceptors.request.use((config) => {
      config.headers.Authorization = "Bearer " + this.authToken;
      config.headers["orgid"] = this.orgId;

      config.url = `https://api.altross.com/${config.url}`;

      return config
    });

    axios.interceptors.response.use(
      function (response) {
        let { data } = response;
        return data
      },
      function (error) {
        console.log(error);
        return Promise.reject(error)
      }
    );
    this.request = axios;
  }
}

const api = new API();

const dlv = (obj, key, def, p, undef) => {
  key = key.split ? key.split(".") : key;
  for (p = 0; p < key.length; p++) {
    obj = obj ? obj[key[p]] : undef;
  }
  return obj === undef ? def : obj
};
const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    Number(value) === -1 ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  )
};
const isNumeric = (str) => {
  if (typeof str != "string") return false
  return !isNaN(str) && !isNaN(parseFloat(str))
};

const replaceChar = (origString, replaceChar, index) => {
  let firstPart = origString.substr(0, index);
  let lastPart = origString.substr(index + 1);

  let newString = firstPart + replaceChar + lastPart;
  return newString
};

const OPERATOR_HASH = {
  Number: {
    10: {
      name: "equal",
      action: (recordValue, conditionValue) =>
        recordValue === Number(conditionValue),
    },
    11: {
      name: "notequal",
      action: (recordValue, conditionValue) =>
        recordValue !== Number(conditionValue),
    },
    12: {
      name: "greaterthan",
      action: (recordValue, conditionValue) => recordValue > conditionValue,
    },
    13: {
      name: "greaterthanequal",
      action: (recordValue, conditionValue) =>
        recordValue > conditionValue || recordValue === Number(conditionValue),
    },
    14: {
      name: "lesserthan",
      action: (recordValue, conditionValue) => recordValue < conditionValue,
    },
    15: {
      name: "lesserthanequal",
      action: (recordValue, conditionValue) =>
        recordValue < conditionValue || recordValue === Number(conditionValue),
    },
    16: {
      name: "empty",
      action: (recordValue) => isEmpty(recordValue),
    },
    17: {
      name: "notempty",
      action: (recordValue) => !isEmpty(recordValue),
    },
  },
  String: {
    20: {
      name: "equal",
      action: (recordValue, conditionValue) => recordValue === conditionValue,
    },
    21: {
      name: "notequal",
      action: (recordValue, conditionValue) => recordValue !== conditionValue,
    },
    22: {
      name: "contains",
      action: (recordValue, conditionValue) =>
        recordValue.includes(conditionValue),
    },
    23: {
      name: "notcontains",
      action: (recordValue, conditionValue) =>
        !recordValue.includes(conditionValue),
    },
    24: {
      name: "startswith",
      action: (recordValue, conditionValue) =>
        recordValue.startsWith(conditionValue),
    },
    25: {
      name: "endswith",
      action: (recordValue, conditionValue) =>
        recordValue.endsWith(conditionValue),
    },
    26: {
      name: "empty",
      action: (recordValue) => isEmpty(recordValue),
    },
    27: {
      name: "notempty",
      action: (recordValue) => !isEmpty(recordValue),
    },
  },
  Boolean: {
    30: {
      name: "empty",
      action: (recordValue) => isEmpty(recordValue),
    },
    31: {
      name: "notempty",
      action: (recordValue) => !isEmpty(recordValue),
    },
    32: {
      name: "true",
      action: (recordValue) => recordValue,
    },
    33: {
      name: "false",
      action: (recordValue) => !recordValue,
    },
  },
  Array: {
    40: {
      name: "empty",
      action: (recordValue) => isEmpty(recordValue),
    },
    41: {
      name: "notempty",
      action: (recordValue) => !isEmpty(recordValue),
    },
    42: {
      name: "equal",
      action: (recordValue, conditionValue) =>
        _.isEqual(recordValue, conditionValue),
    },
    43: {
      name: "notequal",
      action: (recordValue, conditionValue) =>
        !_.isEqual(recordValue, conditionValue),
    },
  },
};

const checkPermissionForce = async ({
  permissionId,
  resource,
  targetResource,
  user,
}) => {
  try {
    let { userId } = user || {};
    let param = {
      userId: userId,
      permissionId: permissionId,
      resource,
      targetResource,
    };

    if (isEmpty(resource)) delete param["resource"];
    if (isEmpty(targetResource)) delete param["targetResource"];

    let response = await api.request.post("v1/hasPermission/users", param);
    let { data } = response || {};
    if (data) {
      let { status } = data || {};

      return status === "ACTIVE" ? true : false
    } else {
      return false
    }
  } catch (error) {
    return { data: null, error }
  }
};

const checkPermission = ({
  permissionId,
  resource,
  targetResource,
  user: userRecord,
  activePermissions,
}) => {
  try {
    let currPermissionGroup = dlv(userRecord, "permissionGroup.0", null);
    let permissionRecord = activePermissions.find((permission) => {
      let { permissionId: currPermissionId } = permission || {};
      return currPermissionId === permissionId
    });

    let {
      conditions,
      conditionMatcher,
      users: permissionUsers,
    } = permissionRecord || {};
    let status;

    if (userPermissionCheck(userRecord, permissionRecord)) {
      status = true;
    } else {
      status = false;
    }

    if (!isEmpty(conditions) && !isEmpty(conditionMatcher)) {
      if (isEmpty(resource)) {
        status = false;
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
        } = condition;
        let actualValue = resource[key];
        if (
          isEmpty(permissionGroup) ||
          (!isEmpty(permissionGroup) && permissionGroup === currPermissionGroup)
        ) {
          if (
            !isEmpty(OPERATOR_HASH[dataType]) &&
            !isEmpty((OPERATOR_HASH[dataType] || {})[operator])
          ) {
            let selectedOperator = OPERATOR_HASH[dataType][operator];
            if (
              valueType === "DYNAMIC" &&
              !isEmpty(targetResource) &&
              !isEmpty(valueKey)
            ) {
              let val = targetResource[valueKey];
              return selectedOperator.action(actualValue, val)
            } else {
              return selectedOperator.action(actualValue, value)
            }
          }
        } else {
          let { id: currUserId } = userRecord;

          if (permissionUsers.includes(currUserId)) return true
          else return false
        }
      });

      for (let i = 0; i < conditionMatcher.length; i++) {
        let charAtIndex = conditionMatcher.charAt(i);
        if (isNumeric(charAtIndex)) {
          let actualVal =
            conditionsSatisfiedArray[conditionMatcher.charAt(i) - 1];

          if (!isEmpty(actualVal)) {
            conditionMatcher = replaceChar(conditionMatcher, `${actualVal}`, i);
          } else {
            conditionMatcher = replaceChar(conditionMatcher, `${false}`, i);
          }
        }
      }

      conditionMatcher = conditionMatcher.replace(/and/g, "&&");
      conditionMatcher = conditionMatcher.replace(/or/g, "||");

      let finalStatus = eval(conditionMatcher);

      status = finalStatus;
    }

    return status
  } catch (error) {
    return error
  }
};

const userPermissionCheck = (user, permission) => {
  let { permissions } = user || {};
  let { id } = permission || {};
  return (permissions || []).includes(id)
};

const createRecord = async ({ moduleName, data }) => {
  try {
    let response = await api.request.post(`v1/create/${moduleName}`, data);
    return response
  } catch (error) {
    return { data: null, error }
  }
};

const updateRecord = async ({ moduleName, data, id }) => {
  try {
    let response = await api.request.put(`v1/update/${moduleName}`, {
      data,
      id,
    });
    return response
  } catch (error) {
    return { data: null, error }
  }
};

const deleteRecord = async ({ moduleName, id }) => {
  try {
    let response = await api.request.delete(`v1/delete/${moduleName}`, { id });
    return response
  } catch (error) {
    return { data: null, error }
  }
};

class Permissions {
  constructor({ authToken, orgId }) {
    this.authToken = authToken;
    this.orgid = orgId;
    api.init({ authToken, orgId });
  }
  async setUserID(userId) {
    try {
      let { data, error } = await api.request.post("v1/getPermissions/users", {
        userId,
      });
      if (error) {
        throw error
      } else {
        this.activePermissions = data.permissions;
        this.user = data.user;
        return this.activePermissions
      }
    } catch (error) {
      return { data: null, error }
    }
  }
  async hasPermission({ permissionId, resource, targetResource, config }) {
    let { force } = config || {};
    let { user, activePermissions } = this;
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

export default Permissions;
