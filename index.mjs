import axios from"axios";class API{init({authToken:e,orgId:t}){this.authToken=e,this.orgId=t,axios.interceptors.request.use(e=>(e.headers.Authorization="Bearer "+this.authToken,e.headers.orgid=this.orgId,e.url="https://api.altross.com/"+e.url,e)),axios.interceptors.response.use((function(e){let{data:t}=e;return t}),(function(e){return console.log(e),Promise.reject(e)})),this.request=axios}}const api=new API,dlv=(e,t,r,s,i)=>{for(t=t.split?t.split("."):t,s=0;s<t.length;s++)e=e?e[t[s]]:i;return e===i?r:e},isEmpty=e=>null==e||-1===Number(e)||"object"==typeof e&&0===Object.keys(e).length||"string"==typeof e&&0===e.trim().length,isNumeric=e=>"string"==typeof e&&(!isNaN(e)&&!isNaN(parseFloat(e))),replaceChar=(e,t,r)=>e.substr(0,r)+t+e.substr(r+1),OPERATOR_HASH={Number:{10:{name:"equal",action:(e,t)=>e===Number(t)},11:{name:"notequal",action:(e,t)=>e!==Number(t)},12:{name:"greaterthan",action:(e,t)=>e>t},13:{name:"greaterthanequal",action:(e,t)=>e>t||e===Number(t)},14:{name:"lesserthan",action:(e,t)=>e<t},15:{name:"lesserthanequal",action:(e,t)=>e<t||e===Number(t)},16:{name:"empty",action:e=>isEmpty(e)},17:{name:"notempty",action:e=>!isEmpty(e)}},String:{20:{name:"equal",action:(e,t)=>e===t},21:{name:"notequal",action:(e,t)=>e!==t},22:{name:"contains",action:(e,t)=>e.includes(t)},23:{name:"notcontains",action:(e,t)=>!e.includes(t)},24:{name:"startswith",action:(e,t)=>e.startsWith(t)},25:{name:"endswith",action:(e,t)=>e.endsWith(t)},26:{name:"empty",action:e=>isEmpty(e)},27:{name:"notempty",action:e=>!isEmpty(e)}},Boolean:{30:{name:"empty",action:e=>isEmpty(e)},31:{name:"notempty",action:e=>!isEmpty(e)},32:{name:"true",action:e=>e},33:{name:"false",action:e=>!e}},Array:{40:{name:"empty",action:e=>isEmpty(e)},41:{name:"notempty",action:e=>!isEmpty(e)},42:{name:"equal",action:(e,t)=>_.isEqual(e,t)},43:{name:"notequal",action:(e,t)=>!_.isEqual(e,t)}}},checkPermissionForce=async({permissionId:e,resource:t,targetResource:r,user:s})=>{try{let{userId:i}=s||{},a={userId:i,permissionId:e,resource:t,targetResource:r};isEmpty(t)&&delete a.resource,isEmpty(r)&&delete a.targetResource;let n=await api.request.post("v1/hasPermission/users",a),{data:o}=n||{};if(o){let{status:e}=o||{};return"ACTIVE"===e}return!1}catch(e){return{data:null,error:e}}},checkPermission=({permissionId:permissionId,resource:resource,targetResource:targetResource,user:userRecord,activePermissions:activePermissions})=>{try{let currPermissionGroup=dlv(userRecord,"permissionGroup.0",null),permissionRecord=activePermissions.find(e=>{let{permissionId:t}=e||{};return t===permissionId}),{conditions:conditions,conditionMatcher:conditionMatcher,users:permissionUsers}=permissionRecord||{},status;if(status=!!userPermissionCheck(userRecord,permissionRecord),!isEmpty(conditions)&&!isEmpty(conditionMatcher)){isEmpty(resource)&&(status=!1);let conditionsSatisfiedArray=conditions.map(e=>{let{key:t,value:r,operator:s,dataType:i,permissionGroup:a,valueKey:n,valueType:o}=e,c=resource[t];if(!isEmpty(a)&&(isEmpty(a)||a!==currPermissionGroup)){let{id:e}=userRecord;return!!permissionUsers.includes(e)}if(!isEmpty(OPERATOR_HASH[i])&&!isEmpty((OPERATOR_HASH[i]||{})[s])){let e=OPERATOR_HASH[i][s];if("DYNAMIC"!==o||isEmpty(targetResource)||isEmpty(n))return e.action(c,r);{let t=targetResource[n];return e.action(c,t)}}});for(let e=0;e<conditionMatcher.length;e++){let t=conditionMatcher.charAt(e);if(isNumeric(t)){let t=conditionsSatisfiedArray[conditionMatcher.charAt(e)-1];conditionMatcher=isEmpty(t)?replaceChar(conditionMatcher,"false",e):replaceChar(conditionMatcher,""+t,e)}}conditionMatcher=conditionMatcher.replace(/and/g,"&&"),conditionMatcher=conditionMatcher.replace(/or/g,"||");let finalStatus=eval(conditionMatcher);status=finalStatus}return status}catch(e){return e}},userPermissionCheck=(e,t)=>{let{permissions:r}=e||{},{id:s}=t||{};return(r||[]).includes(s)},createRecord=async({moduleName:e,data:t})=>{try{return await api.request.post("v1/create/"+e,t)}catch(e){return{data:null,error:e}}},updateRecord=async({moduleName:e,data:t,id:r})=>{try{return await api.request.put("v1/update/"+e,{data:t,id:r})}catch(e){return{data:null,error:e}}},deleteRecord=async({moduleName:e,id:t})=>{try{return await api.request.delete("v1/delete/"+e,{id:t})}catch(e){return{data:null,error:e}}};class Permissions{constructor({authToken:e,orgId:t}){this.authToken=e,this.orgid=t,api.init({authToken:e,orgId:t})}async setUserID(e){try{let{data:t,error:r}=await api.request.post("v1/getPermissions/users",{userId:e});if(r)throw r;return this.activePermissions=t.permissions,this.user=t.user,this.activePermissions}catch(e){return{data:null,error:e}}}async hasPermission({permissionId:e,resource:t,targetResource:r,config:s}){let{force:i}=s||{},{user:a,activePermissions:n}=this;return i?await checkPermissionForce({permissionId:e,resource:t,targetResource:r,user:a}):checkPermission({permissionId:e,resource:t,targetResource:r,user:a,activePermissions:n})}async create(e,{data:t}){return await createRecord({moduleName:e,data:t})}async update(e,{data:t,id:r}){return await updateRecord({moduleName:e,data:t,id:r})}async delete(e,{id:t}){return await deleteRecord({moduleName:e,id:t})}}export default Permissions;
