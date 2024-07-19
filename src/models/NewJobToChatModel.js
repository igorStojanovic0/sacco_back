const { Schema,model } = require("mongoose");
const { modelOption } = require("./config");

const NewJobToChatSchema = new Schema(
    {
        roomId: {
            type: String,
        },
        enableChat: {
            type: Boolean,
            default: false,
        },
        goal: {
            type: String,
            default: "enableChat",
        }
    },
    modelOption("newJobChatRoom")
);

model("NewJobToChat", NewJobToChatSchema);

const newJobChatRoomInit = async () => {
    try {
        const NewJobToChatModel = model("NewJobToChat");
        const newJobChatRoom = await NewJobToChatModel.findOne({});
        if (newJobChatRoom) return;
        else
        NewJobToChatModel.create({ roomId: "" }, (err, result) => {
            if (err) throw err;
            console.log("NewJobToChat : ", "Create NewJobToChat");
        });
    } catch (err) {
        console.log("NewJobToChat : ", err.message);
    }
};

newJobChatRoomInit();
  