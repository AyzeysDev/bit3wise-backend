import mongoose from "mongoose";

interface UserAttrs {
  userId: string;
  goal: number;
  createdAt: string;
  updatedAt: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

interface UserDoc extends mongoose.Document {
  userId: string;
  goal: number;
  createdAt: string;
  updatedAt: string;
}

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  goal: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
    default: () => new Date().toISOString(),
  },
  updatedAt: {
    type: String,
    required: true,
    default: () => new Date().toISOString(),
  },
});

userSchema.pre("save", function (done) {
  if (this.isModified("updatedAt")) {
    this.set("updatedAt", new Date().toISOString());
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
