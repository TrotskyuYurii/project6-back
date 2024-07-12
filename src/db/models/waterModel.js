import { model, Schema } from 'mongoose';

const waterSchema = new Schema(
  {
    // user_id: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'user',
    //   required: true,
    // },
    date: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);


export const WatersCollection = model('water', waterSchema);
