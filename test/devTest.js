import Permissions from "../src/index"

const test = async () => {
  const perm = new Permissions(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFrc2hheWthbm5hbjk2N0BnbWFpbC5jb20iLCJpYXQiOjE2MjI0ODEyNDV9.MqdGeRgmV3JQRxhrmODLvS2PzZwJ1AibKq5ePKalc6c",
    392
  )

  console.log("here1")
  await perm.init()
  console.log("here")

  console.log(perm.isActive("michael_scott_123", "workflow_management_123"))
  console.log(perm.isActive("P8uhx5FJ36HBebPm8aawzo", "asdu223uhc"))
  console.log(perm.getAllActiveLicenses())
}

test()
