/**
 * This is the EventTypes class.
 * It contains all the methods of EventType
 * @class eventTypeController
 */

module.exports = {
	/**
     * Action for adding EventType data
     *
     * @method EventType
     * @param {req} request
     * @param {res} response
     * @return {status} res -If it returns error then the status is false otherwise true. 
     */

    addEventType: function(req, res) {
        var requiredParams = ['name'];
        helper.validateRequiredParams(req, res, requiredParams).then(function() {
            var postData = req.body;
            models.eventType.findOne({ name: { $regex: new RegExp("^" + req.body.name, "i") } }).exec(function(err, displayData) {
                if (_.isEmpty(displayData)) {
                    postData.createdBy = requestUserId;
                    postData.updatedBy = requestUserId;
                    var eventType = new models.eventType(postData);
                    eventType.save().then(function(eventTypeData) {
                        var response = [];
                        response.data = eventTypeData;
                        helper.formatResponse(response, res, '');
                    }).catch(function(error) {
                        helper.formatResponse('', res, error);
                    });                       
                } else {
                    error = {
                        httpstatus: 409,
                        msg: "EventType already exists."
                    };
                    helper.formatResponse('', res, error);
                }
            });

        });
    },
    /**
     * Action for updating EventType data
     *
     * @method editEventType
     * @param {req} request
     * @param {res} response
     * @return {status} res -If it returns error then the status is false otherwise true. 
     */

    editEventType: function(req, res) {
        var requiredParams = ['name'];
        helper.validateRequiredParams(req, res, requiredParams).then(function() {
            var modelName = models.eventType;
            var condition = { '_id': req.body._id, isDelete: false };
            var updateParams = req.body;
            updateParams.updatedBy = requestUserId;
            models.eventType.findOne({ name: { $regex: new RegExp("^" + req.body.name, "i") }, _id: { '$ne': req.body._id } }).exec(function(err, displayData) {
                if (_.isEmpty(displayData)) {
                    models.eventType.update(condition, updateParams).then(function(eventTypeData) {
                        var response = [];
                        response.data = eventTypeData;
                        helper.formatResponse(response, res, '');
                    }).catch(function(error) {
                        helper.formatResponse('', res, error);
                    });
                } else {
                    error = {
                        httpstatus: 409,
                        msg: "Event Type with the name already Exists."
                    };
                    helper.formatResponse('', res, error);
                }
            });

        });
    },

    /**
     * Action for getting eventType list
     *
     * @method geteventType
     * @param {req} request
     * @param {res} response
     * @return {data} res - If data is there then it returns eventType list otherwise it gives message.
     */

    getEventType: function(req, res) {
        /*Showing only isDelete false as we are going with soft delete*/
    	var where = {
    		isDelete : false
    	};
    	/* checking for whether any filteration is requesting*/
    	if(req.params.name){
    		where.name = { $regex: new RegExp("^" + req.body.name, "i") }
    	}
        models.eventType.find(where).then(function(data) {
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
     * Action for getting eventType details
     *
     * @method geteventTypeDetails
     * @param {req} request
     * @param {res} response
     * @return {data} res - If data is there then it returns eventType details otherwise it gives message.
     */

    getEventTypeDetails: function(req, res) {
        var modelName = models.eventType;
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
            } else if (typeof data != 'undefined' && data != '' && data != null) {
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
     * Action for delete eventType data
     *
     * @method deleteeventType
     * @param {req} request
     * @param {res} response
     * @return {status} res -If it returns error then the status is false otherwise true. 
     */

    deleteEventType: function(req, res) {
        var modelName = models.eventType;
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