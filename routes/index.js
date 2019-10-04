var users = require('./users.ctrl.js');
var eventType = require('./eventType.ctrl.js');
var event = require('./event.ctrl.js');

/*Routing for the user module*/

router.post('/registration', users.registration);
router.post('/login', users.login);

/*Routing for the EventType Module*/

router.post('/eventType',eventType.addEventType);
router.get('/eventType/:name?',eventType.getEventType); // name is an optional parameter for filteration
router.get('/eventType/:id',eventType.getEventTypeDetails);
router.put('/eventType',eventType.editEventType);
router.delete('/eventType',eventType.deleteEventType);

/*Routing for the Event Module*/

router.post('/event',event.addEvent);
router.get('/event/:name?',event.getEvent); // name is an optional parameter for filteration
router.get('/event/:id',eventType.getEventDetails);
router.put('/event',event.editEvent);
router.delete('/event',event.deleteEvent);
