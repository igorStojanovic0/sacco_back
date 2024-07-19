import { model, Document, Schema } from "mongoose";

interface TokenDoc extends Document {
    token: string;
    user: string;
    expirationDate: Date;
};

const TokenSchema = new Schema({
    token: { type: String, required: true },
    user: { type: String, required: true },
    expirationDate: { type: Date, required: true },
},{
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret.__v;
        }
    },
    timestamps: true
});

export const Token = model<TokenDoc>("Token", TokenSchema);