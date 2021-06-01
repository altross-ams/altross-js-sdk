import mongoose from "mongoose"

export const UserFeatureSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: 1,
    id: 1,
    displayName: "ID",
    displayType: "ID",
  },
  name: { type: String, required: true, id: 2, displayName: "Name" },
  status: {
    id: 3,
    type: String,
    enum: ["ACTIVE", "EXPIRED"],
    required: true,
    displayType: "STATE",
    displayName: "Status",
  },
  job: { id: 4, type: mongoose.Schema.Types.Mixed },
  features: {
    type: Array,
    id: 5,
    lookup: true,
    displayName: "Feature",
    displayType: "SINGLE_LOOKUP",
  },
  users: {
    type: Array,
    id: 6,
    lookup: true,
    displayName: "User",
    displayType: "SINGLE_LOOKUP",
  },
  userId: {
    type: String,
    required: true,
    id: 7,
    displayName: "User Id",
    displayType: "COPY",
  },
  featureId: {
    type: String,
    required: true,
    id: 8,
    displayName: "Feature Id",
    displayType: "COPY",
  },
})

export default mongoose.model("userFeature", UserFeatureSchema)
