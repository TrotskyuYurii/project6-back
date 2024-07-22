import { Schema, model } from 'mongoose';

export const userSchema = new Schema(
  {
    name: { type: String, default: 'Guest' },
    email: { type: String, required: true },
    password: { type: String, required: true },
    weight: { type: Number, default: 0 },
    sportTime: { type: Number, default: 0 },
    waterNorma: { type: Number, default: 1.5 },
    gender: {
      type: String,
      enum: ['woman', 'man'],
      default: 'woman',
    },
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/dq1yd2tgi/image/upload/v1720815062/afjky5rbmft0oecah0cv.jpg',
    },
  },
  { timestamps: true, versionKey: false },
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UsersCollection = model('users', userSchema);
