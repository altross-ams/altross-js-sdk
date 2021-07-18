import Permissions from "../src/index"

const test = async () => {
  const permission = new Permissions(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFrc2hheWthbm5hbjk2N0BnbWFpbC5jb20iLCJpYXQiOjE2MjY0MzkwNjV9.iuj9FxRQM3mnNkXCUBU0uF06G8EIn4NkftL1yuhqIzw",
    392
  )

  console.log("here1")
  await permission.init()
  console.log("here")

  let test = await permission.isActive(
    "Sf1ipQ8yt8V1fHaH66Arq3",
    "PVJzMpttyvfvtkfX8tFNPi",
    { mrr: 100, revenue: 78878777 }
  )
  console.log(test)
  console.log("here3")
}

test()
