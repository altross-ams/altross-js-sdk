import Permissions from "../src/index"

const test = async () => {
  const permission = new Permissions(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFrc2hheWthbm5hbjk2NzdAZ21haWwuY29tIiwiaWF0IjoxNjI3NTY5NzkzfQ.2P3KKKkerfILaYRXgcwdSsq2-HgWsyEqna66nfypBKc",
    392
  )

  console.log("here1")
  await permission.init()
  console.log("here")

  let test = await permission.isActive(
    "4YU61E6WjKCi7uBYLiibzC",
    "1HZkLHz8L74z2LaQCGSskb",
    { submittedBy: "akshay" }
  )
  console.log(test)
  console.log("here3")
}

test()
