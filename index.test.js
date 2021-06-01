import Permission from "./index"
import "babel-polyfill"

describe("insert", () => {
  const perm = new Permission("392-Saas_392-aksjdksjds")
  beforeAll(async () => {
    await perm.init()
  })

  it("should insert a doc into collection", async () => {
    let isActive = await perm.isActive(
      "michael_scott_123",
      "workflow_management_123"
    )
    console.log(isActive)
    expect(isActive).toEqual(true)
  })
})
