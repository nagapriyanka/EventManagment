var swig = require('swig');
var jwt = require('jsonwebtoken');
var bcrypt = require("bcrypt-nodejs");

module.exports = {
	/*
		For registering an user
	*/
	registerUser : function(req, res){
		var requiredParams = ['name','email','mobile'];
        helper.validateRequiredParams(req, res, requiredParams).then(function() {
            var postData = req.body;
            models.users.findOne({ email: { $regex: new RegExp("^" + req.body.email, "i") } }).exec(function(err, displayData) {
                if (_.isEmpty(displayData)) {
                    postData.password = bcrypt.hashSync(postData.password);
                    /*We can place all the validations for password too */
                    var users = new models.users(postData);
                    users.save().then(function(usersData) {
                        var response = [];
                        response.data = usersData;
                        helper.formatResponse(response, res, '');
                    }).catch(function(error) {
                        helper.formatResponse('', res, error);
                    });                       
                } else {
                    error = {
                        httpstatus: 409,
                        msg: "users already exists with this email."
                    };
                    helper.formatResponse('', res, error);
                }
            });

        });
    },
    /**
     * Action for login the user
     *
     * @method Login
     * @param {req} request
     * @param {res} response
     * @return {status} res -If it returns error then the status is false otherwise true. 
     */
    login: function(req, res) {
        var modelName = models.users;
        var condition = {
            email: req.body.email,
            isDelete: false
        };
        var requiredParams = ['email', 'password'];
        helper.validateRequiredParams(req, res, requiredParams).then(function() {
            modelName.findOne(condition).exec(function(err, data) {
                if (err) {
                    helper.formatResponse('', res, err);
                } else if (typeof data != 'undefined' && data != '' && data != null) {
                    var result = bcrypt.compareSync(req.body.password, data.password);
                    if(result){
                        var response = [];
                        response.data = data;
                        /*
                         * JWT token generation
                         */
                        var token = jwt.sign(JSON.stringify(resData), JWT_SECRET_KEY); //process.env.JWT_SECRET_KEY
                        res.setHeader('x-access-token', token);
                        helper.formatResponse(response, res, '');
                    }else{
                        helper.formatResponse('', res, 'you entered wrong password.');
                    }
                } else {
                    helper.formatResponse('', res, 'your requested Data is not found');
                }
            }).catch(function(error) {
                helper.formatResponse('', res, error);
            });
        }
    },
}
