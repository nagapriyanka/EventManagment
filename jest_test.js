const request = require('supertest');
const app = require('./app');

/*
  declare the token variable in a scope accessible
  by the entire test suite
*/
let token;
/*Runs the at first and as we are using basic Authentication 
	writing the test cases without breaking our Authentication
*/
beforeAll((done) => {
  request(app)
    .post('/login')
    .send({
      username: 'someusername',
      password: 'xxxpwdxxx',
    })
    .end((err, response) => {
      token = response.headers['x-access-token']; // save the token!
      done();
    });
});

/* As I added a new endpoint to check the server status is UP or not 

	So we can test the server status by this test 
*/

describe('For checking the server status', () => {
    test('Response the GET method with 200 status', () => {
        return request(app).get("/").then(response => {
            expect(response.statusCode).toBe(200)
        })
    });
});

/*
		writing the testcase for One of the post API
			Here I am taking , adding an event Type 
		We can see how to pass our payload Data for testing 
			with the ** Authentication ** 
*/
describe('Adding Event Type checking', () => {
	test('It responds with 200', () => {
	return request(app)
	  .post('/eventType')
	  .send({
	  	name : 'EventType 1'
	  })
	  .set('x-access-token', `Bearer ${token}`)
	  .then((response) => {
	    expect(response.statusCode).toBe(200);
	    expect(response.type).toBe('application/json');
	  });
	});
});


/*For Users registration chekcing with whether we can able to get a 

		response of 200 and the response.data was getting or not
	*/
describe('User Registration', () => {
	test('It responds with 200', () => {
	return request(app)
	  .post('/registration')
	  .send({
	  	name : 'username',
	  	email : "userEmail@gmail.com",
	  	password : "Secretpwd",
	  	mobile : "8923234622"
	  })
	  .then((response) => {
	    expect(response.statusCode).toBe(200);
	    expect(response.type).toBe('application/json');
	    expect(typeof response).toBe('object');
	  });
	});
});