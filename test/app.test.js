const { expect } = require('chai'); //assertion library to be used with mocha
const supertest = require('supertest'); //test http calls
const app = require('../app');

/*** app.js contains several endpoints but these tests just cover the /apps endpoint*/

describe('Apps Endpoint', () => {
    it('should return an array of apps at the endpoint', () => {
        supertest(app)
          .get('/apps')
          .expect('Content-Type', /json/)
          .expect(200)
          .then(res => {
            expect(res.body).to.be.an('array');
        });
    });

    it('should return 400 if genre is not an expected value', () => {
        return supertest(app)
          .get('/apps')
          .query({ genre: 'Sci-Fi' })
          .expect(400, `Genre must be one of ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card']`);
    });

  /*  it('should return a filtered list of apps by genre', () => {
        return supertest(app)
          .get('/apps')
          .query( {genre: 'Action'} )
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => {
              expect(res.body).to.be.an('array');
              expect(res.body).to.deep.include({'Genres': 'Action'});
          });
    });*/

    it('should sort by rating', () => {
        return supertest(app)
          .get('/apps')
          .query({sort: 'Rating'})
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => {
              expect(res.body).to.be.an('array');
              let sorted = true;
              let i = 0;

              while(i < res.body.length - 1){
                  const appAtI = res.body[i].Rating;
                  const appAtIPlus1 = res.body[i+1].Rating;

                  if (appAtIPlus1 < appAtI){
                      sorted = false;
                      break;
                  }
                  i++;
              }
              expect(sorted).to.be.true;
          });
    });
});