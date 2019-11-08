const knex = require('knex');
const app = require('../src/app');
const store = require('../src/store');
const { makeBookmarksArray } = require('./bookmarks.fixtures');

describe('Bookmarks Endpoints', () => {
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
      const testBookmarks= makeBookmarksArray();

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
            error: { message: `Bookmarks doesn't exist` } 
          })
      })
    });

    context('Given there are bookmakrs in the database', () => {
      const testBookmarks = makeBookmarksArray();

      beforeEach('insert bookmarks', () => {
        return db
          .into('bookmarks')
          .insert(testBookmarks)
      });

      it('responds with 200 and the specified bookmarks', () => {
        const bookmarksId = 2
        const expectedBookmarks = testBookmarks[bookmarksId - 1]
        return supertest(app)
          .get(`/bookmarks/${bookmarksId}`)
          .expect(200, expectedBookmarks)
      });
    });

  });

  describe(`POST /bookmarks`, () => {
    it(`creates bookmark, responding with 201 and the new bookmark`,  function() {
      const newBookmark = {
        title: 'haribo',
        url: 'https://www.haribo.com/enUS/home.html',
        description: 'haribo gummy',
        rating: '4'
      }
      return supertest(app)
        .post('/bookmarks')
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .send(newBookmark)
        .expect(201)
        .expect(res => {
          expect(res.body.title).to.eql(newBookmark.title)
          expect(res.body.url).to.eql(newBookmark.url)
          expect(res.body.description).to.eql(newBookmark.description)
          expect(res.body.rating).to.eql(newBookmark.rating)
        })
    });

    const requireFields = ['title', 'url', 'description', 'rating'];

    requireFields.forEach(field => {
      const newBookmark = {
        title: 'haribo',
        url: 'https://www.haribo.com/enUS/home.html',
        description: 'haribo gummy',
        rating: '4'
      };

      it(`response wiht 400 and an error message when somthing missing`, () => {
        delete newBookmark[field]
        
        return supertest(app)
        .post('/bookmarks')
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .send(newBookmark)
        .expect(400, {
          error: { message: `Missing '${field}' in request body` }
        })
      });
    });

  });

  describe('DELETE /bookmarks/:id', () => {
    context(`Given no bookmarks in the database`, () => {
      it(`responds with 404`, () => {
        const bookmarksId = 123456;
        return supertest(app)
          .delete(`/bookmarks/${bookmarksId}`)
          .expect(404, {
            error: { message: `Bookmarks doesn't exist`}
          })
      })
    })

    context('Given there are bookmarks in the database', () => {
      const testBookmarks= makeBookmarksArray();

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
});


