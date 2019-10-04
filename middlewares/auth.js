/**
 * This is the login authentication class.
 * It contains all the methods of authentication
 * @class authMiddleWare
 */

/* list of allowed URLs without login/authentication
 */
var jwt = require('jsonwebtoken');
var allowed = [
    {url: 'web/sns', method: 'GET'},
];

/**
 * Action for allowing all methods without authentication
 *
 * @method checkIfRouteExistInAllowedList
 * @param {route} URL of the API
 * @param {method} method, Ex: ALL or POST
 * @return {middleware} res - This funtion returns true or false.
 */

function checkIfRouteExistInAllowedList(route, method) {
    var evens = _.filter(allowed, function (obj) {
        return route.indexOf(obj.url) !== -1 && (obj.method === "ALL" || obj.method === method);
    });
    if (evens.length > 0) {
        return true;
    } else {
        return false;
    }
}
/**
 *  middleware enabled or not
 * @type Boolean
 */
var enabled = true;

/**
 * Action for authentication of the user
 *
 * @method middlewareFunction
 * @param {onoff} its a boolean value, Ex: on or off
 * @return {middleware} res - If query is sucess then it allows the user otherwise rejects user with some error.
 */
module.exports = function (onoff) {
    enabled = (onoff == 'on') ? true : false;
    return function (req, res, next) {
        global.requestLanguage = req.headers.language;
        var originalUrlAllowed = checkIfRouteExistInAllowedList(req.originalUrl, req.method);
        var token;
        if (enabled && originalUrlAllowed === false) {
            // check header or url parameters or post parameters for token
            token = req.headers['x-access-token'];
            // decode token
            if (typeof token !== 'undefined' && token)
            {
                // verifies secret and checks exp
                jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, decoded) {
                    if (err) {
                        helper.formatResponse('', res, "Failed to authenticate token.");
                    } else {
                        // if everything is good, save to request for use in other routes
                        req.decoded = decoded;                        
                        next();
                    }
                });
            } else {
                // if there is no token
                var error = {
                    httpstatus: 401,
                    msg: "missing authorisation token"
                };
                helper.formatResponse('', res, error);
            }
        } else {
            token = req.headers['x-access-token'];
            if (typeof token !== 'undefined' && token)
            {
                // verifies secret and checks exp
                //process.env.JWT_SECRET_KEY
                jwt.verify(token, JWT_SECRET_KEY, function (err, decoded) {
                    if (err) {
                        helper.formatResponse('', res, "Failed to authenticate token.");
                    } else {
                        // if everything is good, save to request for use in other routes
                        req.decoded = decoded;
                        if (typeof decoded._doc !== 'undefined') {
                            global.decoded = decoded;
                            global.requestUserId = decoded._id;
                        }
                        next();
                    }
                });
            } else {
                next();
            }

        }
    }
};