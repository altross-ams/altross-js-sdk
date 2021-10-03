import Altross from "../src/index"

const checkPermission = async () => {
  const altross = new Altross({
    authToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFrc2hheUBhbHRyb3NzLmNvbSIsImlhdCI6MTYzMjYzMTU4OX0.zqieK8yazFBbPTtDn_qa-iWrXyhi7KzM9mw4IFd0VB0",
    orgId: 392,
  })

  console.log("Initializing....")
  await altross.init("LVCk8VQWyX1gHv1HqrYnBZ")
  console.log("Initialized, checking status....")

  // let test = await altross.hasPermission({
  //   permissionId: "AB1QZGkukmjp3WNoyUGcLC",
  //   resource: { email: 10, submittedBy: "Akshay" },
  //   targetResource: { name: "Akshay" },
  //   config: { force: true },
  // })
  // const record = await altross.create("permissions", {
  //   data: {
  //     name: "Test permissions",
  //     permissionId: "test_id",
  //     projects: [887],
  //   },
  // })
  // console.log("created", record)
  // const test = await altross.update("permissions", {
  //   data: {
  //     name: "new edited test permissions",
  //   },
  //   id: 5121,
  // })
  await altross.delete("permissions", {
    id: 7429,
  })
  console.log("deleted")
}

checkPermission()
