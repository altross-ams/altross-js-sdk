import Permission from "./index"
import "babel-polyfill"

describe("insert", () => {
  const perm = new Permission(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFrc2hheWthbm5hbjk2N0BnbWFpbC5jb20iLCJpYXQiOjE2MjI0ODEyNDV9.MqdGeRgmV3JQRxhrmODLvS2PzZwJ1AibKq5ePKalc6c",
    392
  )
  beforeAll(async () => {
    await perm.init()
  })

  it("should insert a doc into collection", async () => {
    let isActive = await perm.isActive(
      "michael_scott_123",
      "workflow_management_123"
    )
    expect(isActive).toEqual(true)
  })
})
