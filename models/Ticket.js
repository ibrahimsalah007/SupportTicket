const Mongoose = require('mongoose');

const ticketSchema = Mongoose.Schema({
    message:{
        type:String
        },
    user:{
        name:String,
        phoneNumber:String,
        email:String
    },
    source:{
        type:String,
        required:true
    },
    observer:{
        type:String
    },
    service:{
        type:String
    },
    seen:{
        type:Boolean,
        required:true,
        default:false
    },
    Activities: 
        [
            {
            activity: {
               content:{
                type:String,
                required:true,
               },
                by:{
                    type: String,
                    required:true,
                },
                dateCreated:{
                    type: Date,
                    required:true,
                    default: Date.now()
                },
            }
        }
        ],
    status:{
        type:String,
        enum : ['New', 'Open', 'Closed'],
        default: 'New'
    },
    priority:{
        type:String,
        enum : ['1', '2', '3'],
        default: '1'
    },
    createdBy:{
        type:String,
        enum : ['User', 'Admin'],
        default:'User'
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    },
    updatedAt:{
        type:Date,
    },
});

// ticketSchema.pre('save', function (next) {
//     var ticket = this;
//     if (!ticket.isModified()) 
//         return next();
//     //here i set modifier 
//     next();
// });

ticketSchema.pre('save', function (next){
    this.updatedAt = Date.now();
    next();
});

module.exports = Mongoose.model('ticket', ticketSchema);