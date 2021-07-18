import Permission from "../src/index"

describe("insert", () => {
  const permission = new Permission(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFrc2hheWthbm5hbjk2N0BnbWFpbC5jb20iLCJpYXQiOjE2MjY0MzkwNjV9.iuj9FxRQM3mnNkXCUBU0uF06G8EIn4NkftL1yuhqIzw",
    392
  )
  beforeAll(async () => {
    await permission.init()
  })

  it("Should check if license is active for a user", async () => {
    let trueVal = permission.isActive(
      "T9yczPKhbhM5jiJfvpbqzJ",
      "PVJzMpttyvfvtkfX8tFNPi"
    )
    let falseVal = permission.isActive("P8uhx5FJ36HBebPm8aawzo", "asdu223uhc")
    expect(trueVal).toEqual(true)
    expect(falseVal).toEqual(false)
  })
})
