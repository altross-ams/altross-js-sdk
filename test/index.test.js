import Permission from "../src/index"

describe("insert", () => {
  const perm = new Permission(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFrc2hheWthbm5hbjk2N0BnbWFpbC5jb20iLCJpYXQiOjE2MjI4MTQzNjR9.rNEXhnoIKLzEgp6bTxkcDfbTv58WzJ0dR4Vd_q9-RBI",
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
