const knex = require('knex');
const app = require('../src/app');
const store = require('../src/store');
const { makeBookmarksArray } = require('./bookmarks.fixtures');

describe.only('Bookmarks Endpoints', () => {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  });

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db('bookmarks').truncate())

  afterEach('cleanup', () => db('bookmarks').truncate())

  describe(`GET /bookmarks`, () => {
    context(`Given no bookmarks`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/bookmarks')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, [])
      })
    });

    context('Given there are bookmarks in the database', () => {
      const testBookmarks= makeBookmarksArray()

      beforeEach('insert bookmarks', () => {
        return db
          .into('bookmarks')
          .insert(testBookmarks)
      })

      it('gets bookmarks from store', () => {
        return supertest(app)
          .get('/bookmarks')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, testBookmarks)
      })
    })
  });

  describe(`GET /bookmarks/:id`, () => {
    context(`Given no bookmarks`, () => {
      it(`responds with 404`, () => {
        const bookmarksId = 123456
        return supertest(app)
          .get(`/bookmarks/${bookmarksId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(404, { 
            error: { message: `Bookmarks doesn't found` } 
          })
      })
    });

  //   context('Given there are bookmakrs in the database', () => {
  //     const testBookmarks = makeBookmarksArray()

  //     beforeEach('insert bookmarks', () => {
  //       return db
  //         .into('bookmarks')
  //         .insert(testBookmarks)
  //     })

  //     it('responds with 200 and the specified bookmarks', () => {
  //       const bookmarksId = 2
  //       const expectedBookmarks = testBookmarks[bookmarksId - 1]
  //       return supertest(app)
  //         .get(`/bookmarks/${bookmarksId}`)
  //         .expect(200, expectedBookmarks)
  //     })
  //   })
  });

  







});
