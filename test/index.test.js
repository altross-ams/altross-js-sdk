import Permission from "../src/index"
import "babel-polyfill"

describe("insert", () => {
  const perm = new Permission(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFrc2hheWthbm5hbjk2N0BnbWFpbC5jb20iLCJpYXQiOjE2MjI0ODEyNDV9.MqdGeRgmV3JQRxhrmODLvS2PzZwJ1AibKq5ePKalc6c",
    392
  )
  beforeAll(async () => {
    await perm.init()
  })

  it("Should check if license is active for a user", async () => {
    let trueVal = perm.isActive("michael_scott_123", "workflow_management_123")
    let falseVal = perm.isActive("P8uhx5FJ36HBebPm8aawzo", "asdu223uhc")
    expect(trueVal).toEqual(true)
    expect(falseVal).toEqual(false)
  })
})
