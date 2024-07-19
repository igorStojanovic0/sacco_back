const { Schema, model } = require('mongoose');
const { modelOption } = require('./config');


const NewJobsSchema = new Schema(
{
    userId:{
        type: Schema.Types.ObjectId,
        trim: true,
        ref: "User",
    },
    summary:{
        type: String,
        maxlength: 100,
    },
    detail:{
        type:String,
        maxlength: 500,
        default:"",
    },
    type: {
        type:String,
    },
    workTime: {
        type:String,
        default:"",
    },
    rate: {
        type:Number,
    },
    deadline:{
        type:String,
    },
    // stacks:[{
    //     type:String,
    // }],
    where:{
        type:String,
    },
    // status:{
    //     type:String,
    //     default:"ongoing"
    // },
    // earnedScore:{
    //     type:Number,
    //     default:0
    // },
    date:{
        type:String,
    }
    // isArchived: {
    //     type: Boolean,
    //     required: true,
    //     default: false,
    // },
}, 
{
    timestamps:true,
},
modelOption('newJobs'));

model('NewJobs', NewJobsSchema)
