const express = require('express');
const uuid = require('uuid/v4');
const logger = require('../logger');
const {bookmarks} = require('../store');
const BookmarksService = require('../bookmarks-service');
const xss = require('xss');

const bodyParser = express.json();
const bookmarksRouter = express.Router();

const bookmarkForm = bookmark => ({
  id: bookmark.id,
  title: bookmark.title,
  url: bookmark.url,
  description: bookmark.description,
  rating: Number(bookmark.rating),
});

bookmarksRouter
  .route('/bookmarks')
  .get((req, res, next) => {
    BookmarksService.getAllBookmarks(req.app.get('db'))
      .then(bookmarks => {
        res.json(bookmarks.map(bookmarkForm));
      })
      .catch(next)
  })
  .post(bodyParser, (req, res, next) => {
    // move implementation logic into here
    const {title, url, description, rating} = req.body;

    if (!title) {
      logger.error('Title is required');
      return res
        .status(400)
        .json({error: { message: `Missing 'title' in request body` }});
    };

    if (!url) {
      logger.error('URL is required');
      return res
        .status(400)
        .json({error: { message: `Missing 'url' in request body` }});
    };

    if (!description) {
      logger.error('decription is required');
      return res
        .status(400)
        .json({error: { message: `Missing 'description' in request body` }});
    };

    if (!rating) {
      logger.error('Rating is required');
      return res
        .status(400)
        .json({error: { message: `Missing 'rating' in request body` }});
    };

    const id = uuid();
    const bookmark = {
      id,
      title,
      url,
      description,
      rating
    };

    bookmarks.push(bookmark);
    logger.info(`Bookmarks list with id ${bookmark.id} created`);
    res
      .status(201)
      .location(`http://localhost:8000/list/${bookmark.id}`)
      .json(bookmark);

});

bookmarksRouter
  .route('/bookmarks/:bookmark_id')
  .all((req, res, next) => {
    const {bookmark_id} = req.params;
    //const bookmark = bookmarks.find(c => c.id == bookmark_id);
    BookmarksService.getById(
      req.app.get('db'), 
      req.params.bookmark_id
    )
    .then(bookmark => {
      if (!bookmark) {
        logger.error(`Bookmark with id ${bookmark_id} not found.`)
        return res.status(404).json({
          error: { message: `Bookmarks doesn't exist` }
        })
      }
      res.json(bookmarkForm(bookmark))
    })
    .catch(next)
  })
  .delete((req, res) => {
    const {bookmark_id} = req.params;

    BookmarksService.deleteBookmarks(
      req.app.get('db'),
      bookmark_id
    )
    .then(bookmark => {
      if(!bookmark) {
        logger.error(`List with id ${bookmark_id} deleted.`);
        return res.status(404).send(`Bookmarks doesn't exist`)
      }
      return res.status(204).end()
    })

});

module.exports = bookmarksRouter;




    //const bookmarkIndex = bookmarks.findIndex(item => item.id == bookmark_id);
    //
    // if(bookmarkIndex === -1) {
    //   logger.error(`List with id ${bookmark_id} not found.`);
    //   return res
    //     .status(404)
    //     .send('Not Found');
    // };
    // bookmarks.splice(bookmarkIndex, 1);
    // logger.info(`List with id ${bookmark_id} deleted.`); 

