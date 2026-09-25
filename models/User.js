import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      requred: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["candidate", "employer"],
      default: null,
    },
    phone_no: {
      type: String,
      trim: true,
      unique: true,
      default: null,
    },
    password: {
      type: String,
      default: null,
      select: false,
    },
    onboardingComplete: {
      type: Boolean,
      default: false,
    },
    profile: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    avatarPublicId: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      select: false,
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true,
      select: false,
    },
    facebookId: {
      type: String,
      unique: true,
      sparse: true,
      select: false,
    },
    linkedinId: {
      type: String,
      unique: true,
      sparse: true,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.refreshToken;
    return ret;
  },
});
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});
export const User = mongoose.model("User", userSchema);
