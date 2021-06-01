import Permissions from "./build/index"

const test = async () => {
  const perm = new Permissions("392-Saas_392-aksjdksjds")

  console.log("here1")
  await perm.init()
  console.log("here")

  console.log(
    await perm.isActive("michael_scott_123", "workflow_management_123")
  )
}

test()
