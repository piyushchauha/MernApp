import mongoose, { Document, Schema } from 'mongoose';

interface IBlacklistToken extends Document {
  token: string;
  blacklistAt: Date;
  expiresAt: Date;
}

const BlacklistTokenSchema: Schema<IBlacklistToken> = new Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    blacklistAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

BlacklistTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const blacklisttoken = mongoose.model<IBlacklistToken>(
  'BlacklistToken',
  BlacklistTokenSchema
);

export default blacklisttoken;
