const { Schema, model } = require("mongoose");

const MemberSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["admin","ShopOwner","inventorymanager","buyer",],
            default: "buyer"
        },
        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = model("Member", MemberSchema);