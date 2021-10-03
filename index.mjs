import https from"https";const ALTROSS_BASE_URL="api.altross.com";class API{init({authToken:e,orgId:t}){this.authToken=e,this.orgId=t,this.defaultRequest={host:ALTROSS_BASE_URL,path:"",method:"POST"},this.defaultHeaders={"Content-Type":"application/json",Authorization:"Bearer "+this.authToken,orgid:this.orgId}}_createRequestData(e){let t={...this.defaultRequest,...e};this.defaultRequest={...t,headers:this.defaultHeaders}}_createHeaders(e){let t={...this.defaultHeaders,...e};this.defaultHeaders=t}_makeRequest(e){return new Promise(t=>{const s=https.request(this.defaultRequest,e=>{e.on("data",e=>{console.log(JSON.parse(e));let s=JSON.parse(e);t(s)})});s.on("error",e=>{t({data:null,error:e})}),s.write(e),s.end()})}post(e,t){let s=JSON.stringify(t);return this._createHeaders({"Content-Length":s.length}),this._createRequestData({path:e,method:"POST"}),this._makeRequest(s)}put(e,t){let s=JSON.stringify(t);return this._createHeaders({"Content-Length":s.length}),this._createRequestData({path:e,method:"PUT"}),this._makeRequest(s)}delete(e,t){let s=JSON.stringify(t);return this._createHeaders({"Content-Length":s.length}),this._createRequestData({path:e,method:"DELETE"}),this._makeRequest(s)}}const api=new API,dlv=(e,t,s,i,r)=>{for(t=t.split?t.split("."):t,i=0;i<t.length;i++)e=e?e[t[i]]:r;return e===r?s:e},isEmpty=e=>null==e||-1===Number(e)||"object"==typeof e&&0===Object.keys(e).length||"string"==typeof e&&0===e.trim().length,isNumeric=e=>"string"==typeof e&&(!isNaN(e)&&!isNaN(parseFloat(e))),replaceChar=(e,t,s)=>e.substr(0,s)+t+e.substr(s+1),OPERATOR_HASH={Number:{10:{name:"equal",action:(e,t)=>e===Number(t)},11:{name:"notequal",action:(e,t)=>e!==Number(t)},12:{name:"greaterthan",action:(e,t)=>e>t},13:{name:"greaterthanequal",action:(e,t)=>e>t||e===Number(t)},14:{name:"lesserthan",action:(e,t)=>e<t},15:{name:"lesserthanequal",action:(e,t)=>e<t||e===Number(t)},16:{name:"empty",action:e=>isEmpty(e)},17:{name:"notempty",action:e=>!isEmpty(e)}},String:{20:{name:"equal",action:(e,t)=>e===t},21:{name:"notequal",action:(e,t)=>e!==t},22:{name:"contains",action:(e,t)=>e.includes(t)},23:{name:"notcontains",action:(e,t)=>!e.includes(t)},24:{name:"startswith",action:(e,t)=>e.startsWith(t)},25:{name:"endswith",action:(e,t)=>e.endsWith(t)},26:{name:"empty",action:e=>isEmpty(e)},27:{name:"notempty",action:e=>!isEmpty(e)}},Boolean:{30:{name:"empty",action:e=>isEmpty(e)},31:{name:"notempty",action:e=>!isEmpty(e)},32:{name:"true",action:e=>e},33:{name:"false",action:e=>!e}},Array:{40:{name:"empty",action:e=>isEmpty(e)},41:{name:"notempty",action:e=>!isEmpty(e)},42:{name:"equal",action:(e,t)=>_.isEqual(e,t)},43:{name:"notequal",action:(e,t)=>!_.isEqual(e,t)}}},checkPermissionForce=async({permissionId:e,resource:t,targetResource:s,user:i})=>{try{let{userId:r}=i||{},a={userId:r,permissionId:e,resource:t,targetResource:s};isEmpty(t)&&delete a.resource,isEmpty(s)&&delete a.targetResource;let n=await api.post("/v1/hasPermission/users",a),{data:o}=n||{};if(o){let{status:e}=o||{};return"ACTIVE"===e}return!1}catch(e){return e}},checkPermission=({permissionId:permissionId,resource:resource,targetResource:targetResource,user:userRecord,activePermissions:activePermissions})=>{try{let currPermissionGroup=dlv(userRecord,"permissionGroup.0",null),permissionRecord=activePermissions.find(e=>{let{permissionId:t}=e||{};return t===permissionId}),{conditions:conditions,conditionMatcher:conditionMatcher,users:permissionUsers}=permissionRecord||{},status;if(status=!!userPermissionCheck(userRecord,permissionRecord),!isEmpty(conditions)&&!isEmpty(conditionMatcher)){isEmpty(resource)&&(status=!1);let conditionsSatisfiedArray=conditions.map(e=>{let{key:t,value:s,operator:i,dataType:r,permissionGroup:a,valueKey:n,valueType:o}=e,c=resource[t];if(!isEmpty(a)&&(isEmpty(a)||a!==currPermissionGroup)){let{id:e}=userRecord;return!!permissionUsers.includes(e)}if(!isEmpty(OPERATOR_HASH[r])&&!isEmpty((OPERATOR_HASH[r]||{})[i])){let e=OPERATOR_HASH[r][i];if("DYNAMIC"!==o||isEmpty(targetResource)||isEmpty(n))return e.action(c,s);{let t=targetResource[n];return e.action(c,t)}}});for(let e=0;e<conditionMatcher.length;e++){let t=conditionMatcher.charAt(e);if(isNumeric(t)){let t=conditionsSatisfiedArray[conditionMatcher.charAt(e)-1];conditionMatcher=isEmpty(t)?replaceChar(conditionMatcher,"false",e):replaceChar(conditionMatcher,""+t,e)}}conditionMatcher=conditionMatcher.replace(/and/g,"&&"),conditionMatcher=conditionMatcher.replace(/or/g,"||");let finalStatus=eval(conditionMatcher);status=finalStatus}return status}catch(e){return e}},userPermissionCheck=(e,t)=>{let{permissions:s}=e||{},{id:i}=t||{};return(s||[]).includes(i)},createRecord=async({moduleName:e,data:t})=>await api.post("/v1/create/"+e,t),updateRecord=async({moduleName:e,data:t,id:s})=>await api.put("/v1/update/"+e,{data:t,id:s}),deleteRecord=async({moduleName:e,id:t})=>await api.delete("/v1/delete/"+e,{id:t});class Permissions{constructor({authToken:e,orgId:t}){this.authToken=e,this.orgid=t,api.init({authToken:e,orgId:t})}async init(e){let t=await api.post("/v1/getPermissions/users",{userId:e}),{data:s}=t||{};return s?(this.activePermissions=s.permissions,this.user=s.user,this.activePermissions):new Error("NO records found")}async hasPermission({permissionId:e,resource:t,targetResource:s,config:i}){let{force:r}=i||{},{user:a,activePermissions:n}=this;return r?await checkPermissionForce({permissionId:e,resource:t,targetResource:s,user:a}):checkPermission({permissionId:e,resource:t,targetResource:s,user:a,activePermissions:n})}async create(e,{data:t}){return await createRecord({moduleName:e,data:t})}async update(e,{data:t,id:s}){return await updateRecord({moduleName:e,data:t,id:s})}async delete(e,{id:t}){return await deleteRecord({moduleName:e,id:t})}}export default Permissions;