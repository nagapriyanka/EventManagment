    /**
    * This is the usersModel.
    * Creating schema for users
    *
    * @class usersModel
    */
var userSchema = new Schema({
    name: {type: String, required: true},
    email : {
        type: String,  
        required: true, 
        unique: true, 
        lowercase: true, 
        // validate: {
        //     $regex : /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        // }
    },
    password : {type : String},
    mobile: {type: String},
    aboutUser: {type: String},     
    isActive: {type: Boolean, default: true},
    isDelete: {type: Boolean, default: false},
}, {
    timestamps: true,
    versionKey: false
});

/*
 * create model from schema
 */
var user = mongoose.model('users', userSchema);


/*
 * export user model
 */
module.exports = user;