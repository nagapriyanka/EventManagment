/**
 * This is the Events class.
 * It contains all the methods of Event
 * @class eventController
 */

module.exports = {
	/**
     * Action for adding Event data
     *
     * @method Event
     * @param {req} request
     * @param {res} response
     * @return {status} res -If it returns error then the status is false otherwise true. 
     */

    addEvent: function(req, res) {
        var requiredParams = ['title' , 'type','description','date', 'startTime','endTime'];
        helper.validateRequiredParams(req, res, requiredParams).then(function() {
            var postData = req.body;
            var where = {
                date : postData.date,
                startTime : {'$gte': new Date(postData.startTime)},
                endTime : {'$lt' : new Date(postData.endTime)}
            }
            models.event.findOne(where).exec(function(err, displayData) {
                if (_.isEmpty(displayData)) {
                    postData.createdBy = requestUserId;
                    postData.updatedBy = requestUserId;
                    /*making current user as organizer by default */
                    postData.organizer = postData.organizer || requestUserId;
                    var event = new models.event(postData);
                    event.save().then(function(eventData) {
                        var response = [];
                        response.data = eventData;
                        helper.formatResponse(response, res, '');
                    }).catch(function(error) {
                        helper.formatResponse('', res, error);
                    });                       
                } else {
                    error = {
                        httpstatus: 409,
                        msg: "The Selected Time slot is not availble , Please choose another slot."
                    };
                    helper.formatResponse('', res, error);
                }
            });

        });
    },
    /**
     * Action for updating Event data
     *
     * @method editEvent
     * @param {req} request
     * @param {res} response
     * @return {status} res -If it returns error then the status is false otherwise true. 
     */

    editEvent: function(req, res) {
        var requiredParams = ['title' , 'type','description','date', 'startTime','endTime'];
        helper.validateRequiredParams(req, res, requiredParams).then(function() {
            var modelName = models.event;
            var condition = { '_id': req.body._id, isDelete: false };
            var where = {
                date : postData.date,
                startTime : {'$gte': new Date(postData.startTime)},
                endTime : {'$lt' : new Date(postData.endTime)}
                _id : {'$ne':req.body._id}
            }
            var updateParams = req.body;
            updateParams.organizer = req.body.organizer|| requestUserId;
            updateParams.updatedBy = requestUserId;
            models.event.findOne({ name: { $regex: new RegExp("^" + req.body.name, "i") }, _id: { '$ne': req.body._id } }).exec(function(err, displayData) {
                if (_.isEmpty(displayData)) {
                    models.event.update(condition, updateParams).then(function(eventData) {
                        var response = [];
                        response.data = eventData;
                        helper.formatResponse(response, res, '');
                    }).catch(function(error) {
                        helper.formatResponse('', res, error);
                    });
                } else {
                    error = {
                        httpstatus: 409,
                        msg: "Sorry your requested slot is not available , please select another slot to update your event."
                    };
                    helper.formatResponse('', res, error);
                }
            });

        });
    },

    /**
     * Action for getting event list
     *
     * @method getevent
     * @param {req} request
     * @param {res} response
     * @return {data} res - If data is there then it returns event list otherwise it gives message.
     */

    getEvent: function(req, res) {
        /*Showing only isDelete false as we are going with soft delete*/
    	var where = {
    		isDelete : false
    	};
    	/* checking for whether any filteration is requesting*/
    	if(req.params.name){
    		where.name = { $regex: new RegExp("^" + req.body.name, "i") }
    	}
        models.event.find(where).then(function(data) {
            var result = {
                data: data,
            }
            var response = {};
            response = result;
            helper.formatResponse(response, res, '');
        }).catch(function(error) {
            helper.formatResponse('', res, error);
        });
    },

    /**
     * Action for getting event details
     *
     * @method geteventDetails
     * @param {req} request
     * @param {res} response
     * @return {data} res - If data is there then it returns event details otherwise it gives message.
     */

    getEventDetails: function(req, res) {
        var modelName = models.event;
        var condition = {
            _id: req.params.id,
            isDelete: false
        };
        /* fields --> to get some fields only 
        	more useful when we deals with mobile App */
        var fields = [""];
        modelName.findOne(condition).select(fields).exec(function(err, data) {
            if (err) {
                helper.formatResponse('', res, err);
            } else if (of data != 'undefined' && data != '' && data != null) {
                var response = [];
                response.data = data;
                helper.formatResponse(response, res, '');
            } else {
                helper.formatResponse('', res, 'your requested Data is not found');
            }
        }).catch(function(error) {
            helper.formatResponse('', res, error);
        });
    },

    /**
     * Action for delete event data
     *
     * @method deleteevent
     * @param {req} request
     * @param {res} response
     * @return {status} res -If it returns error then the status is false otherwise true. 
     */

    deleteEvent: function(req, res) {
        var modelName = models.event;
        var condition = { '_id': req.params.id };
        modelName.delete(condition).then(function() {
            var response = {};
            response.msg = "Data deleted successfully.";
            helper.formatResponse(response, res, '');
        }).catch(function(error) {
            helper.formatResponse('', res, error);
        });
    },
}