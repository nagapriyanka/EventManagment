
var nodemailer = require('nodemailer');
var smtp = require('nodemailer-smtp-transport');

module.exports = {
     /**
    * Action for validating required params in body
    *
    * @method validateRequiredParams
    * @param {req} request
    * @param {res} response
    * @param {object} requiredParams - requiredParams
    * @return {promise} res - It returns error when missing some params in body
    * return ===> error = httpstatus 422, success = true.
    */

    validateRequiredParams: function (req, res, requiredParams) {
        return new Promise(function (resolve, reject) {
            var errorCount = 0;
            var missingParams = [];
            requiredParams.forEach(function (obj) {
                if (typeof req.body[obj] == 'undefined' || req.body[obj] == '') {
                    errorCount++;
                    missingParams.push(obj);
                }
            });
            if (errorCount > 0) {
                var error = {
                    success: false,
                    httpstatus: 422,
                    msg: 'Missing required parameters',
                    data: {
                        missingParams: missingParams
                    }
                };
                helper.formatResponse(error, res);
            } else {
                resolve({
                    success: true,
                    data: []
                });
            }

        })
    },
    /**
    * Action for formatting response
    *
    * @method formatResponse
    * @param {object} response
    * @param {res} response(It is used for giving response)
    * @param {object} error - error
    * @return {data} res -It returns json output format all error and success response to maintain common format.
    */

    formatResponse: function (response, res, error) {
        
        var httpstatus = 200;
        if (typeof response.httpstatus != 'undefined' && response.httpstatus != '') {
            httpstatus = response.httpstatus;
        }
        var output = {};
        var successStatus;
        if (response !== '') {
            successStatus = true;
            output['success'] = successStatus;
            if (typeof response.msg != 'undefined' && response.msg != '') {
                var responseMessage = response.msg;
                output['msg'] = responseMessage;
            }
            if (typeof response.data != 'undefined' && response.data != '') {
                var responseData = response.data;
                output['data'] = responseData;
            }
        } else {
            successStatus = false;

            if (typeof error.httpstatus != 'undefined' && error.httpstatus != '') {
                httpstatus = error.httpstatus;
                delete error.httpstatus;
            }
            output = {
                success: successStatus,
                msg: error.msg,
            }
        }
        
        res.status(httpstatus).json(output)
    },
    sendEmail : function(options){
        var mailHelper = {};
        /**
         * Gmail SMTP configuration object
         */
        mailHelper.gmailConfig = {
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure:  false, // use SSL
            auth: {
                user: 'username',
                pass: 'pwd'
            }
        };

        var mailOptions = {
        from : '"'+ fromName + '"<' + sourceEmail + '>',
        to   : toEmails,
        cc   : ccEmails,
        bcc  : bccEmails,
        subject: subject,
        text : subject,
        html : emailBody,
        attachments : attachments
    };
    // send mail with defined transport object 
    transporter.sendMail(mailOptions, function (error, info) {
     if (error) {
              console.log(error,"error")
            reject({status: false,'error':error});
        } else {
            console.log(info,"info")
            resolve({status: true, 'info':info});
        }
    });

    }
}