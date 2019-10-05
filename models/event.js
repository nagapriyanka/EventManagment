    /**
    * This is the EventsModel.
    * Creating schema for Events
    *
    * @class EventsModel
    */
var eventSchema = new Schema({
    title: {type: String, required: true},
    type : {type: Schema.Types.ObjectId, ref: 'eventTypes'},
    organizer: {type: Schema.Types.ObjectId, ref: 'users'},
    description : {type : String},
    date: {type: Date, required: true},
    startTime: {type: Date , required :true},
    endTime: {type: Date , required:true},
    createdBy: {type: Schema.Types.ObjectId, ref: 'users'},
    updatedBy: {type: Schema.Types.ObjectId, ref: 'users'},
    isActive: {type: Boolean, default: true},
    isDelete: {type: Boolean, default: false},
}, {
    timestamps: true,
    versionKey: false
});

/*
 * create model from schema
 */
var event = mongoose.model('events', eventSchema);


/*
 * export event model
 */
module.exports = event;