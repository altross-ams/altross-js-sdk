import Permissions from "../src/index"

const checkPermission = async () => {
  const permission = new Permissions(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFrc2hheWthbm5hbjk2NzdAZ21haWwuY29tIiwiaWF0IjoxNjI5NzMwNTE5fQ.jBauOYNjsRCbJ4MKwt31vo2jbsyPWN-1QAUcZZPhZ10",
    392
  )

  console.log("Initializing....")
  await permission.init("LVCk8VQWyX1gHv1HqrYnBZ")
  console.log("Initialized, checking status....")

  let test = await permission.hasPermission(
    "AB1QZGkukmjp3WNoyUGcLC",
    { email: 15, submittedBy: "akshay" },
    { name: "akshay" },
    { force: true }
  )
  console.log("Given user permission status -", test)
}

checkPermission()
