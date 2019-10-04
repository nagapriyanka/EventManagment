    /**
    * This is the eventTypeModel.
    * Creating schema for eventType
    *
    * @class eventTypeModel
    */
var eventTypeSchema = new Schema({
    name : {type: Schema.Types.ObjectId, ref: 'eventTypes'},
    isActive: {type: Boolean, default: true},
    isDelete: {type: Boolean, default: false},
}, {
    timestamps: true,
    versionKey: false
});

/*
 * create model from schema
 */
var eventType = mongoose.model('eventType', eventTypeSchema);


/*
 * export event model
 */
module.exports = eventType;