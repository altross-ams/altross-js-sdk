import Permission from "../src/index"

describe("insert", () => {
  const permission = new Permission(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFrc2hheWthbm5hbjk2NzdAZ21haWwuY29tIiwiaWF0IjoxNjI5NzMwNTE5fQ.jBauOYNjsRCbJ4MKwt31vo2jbsyPWN-1QAUcZZPhZ10",
    392
  )
  beforeAll(async () => {
    await permission.init()
  })

  it("Should check if license is active for a user", async () => {
    let trueVal = await permission.hasPermission(
      "LVCk8VQWyX1gHv1HqrYnBZ",
      "AB1QZGkukmjp3WNoyUGcLC",
      { email: 15, submittedBy: "akshay" },
      { name: "akshay" }
    )
    expect(trueVal).toEqual(true)
  })
})
