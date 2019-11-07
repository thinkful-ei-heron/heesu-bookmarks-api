const express = require('express');
const uuid = require('uuid/v4');
const logger = require('../logger');
const {bookmarks} = require('../store');
const BookmarksService = require('../bookmarks-service');

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
  .get((req, res) => {
    BookmarksService.getAllBookmarks(req.app.get('db'))
      .then(bookmarks => {
        res.json(bookmarks.map(bookmarkForm));
      })
      .catch(next)
  })
  // .post(bodyParser, (req, res) => {
  //   // move implementation logic into here
  //   const {title, url, description, rating} = req.body;

  //   if (!title) {
  //     logger.error('Title is required');
  //     return res
  //       .status(400)
  //       .send('Invalid data');
  //   };

  //   if (!url) {
  //     logger.error('URL is required');
  //     return res
  //       .status(400)
  //       .send('Invalid data');
  //   };

  //   if (!rating) {
  //     logger.error('Rating is required');
  //     return res
  //       .status(400)
  //       .send('Invalid data');
  //   };

  //   const id = uuid();
  //   const bookmark = {
  //     id,
  //     title,
  //     url,
  //     description,
  //     rating
  //   };

  //   bookmarks.push(bookmark);
  //   logger.info(`Bookmarks list with id ${bookmark.id} created`);
  //   res
  //     .status(201)
  //     .location(`http://localhost:8000/list/${bookmark.id}`)
  //     .json(bookmark);
//});

// bookmarksRouter
//   .route('/bookmarks/:bookmark_id')
//   .get((req, res) => {
//     const {bookmark_id} = req.params;
//     const bookmark = bookmarks.find(c => c.id == bookmark_id);

//     // make sure we found a card
//     if (!bookmark) {
//       logger.error(`Card with id ${bookmark_id} not found.`);
//       return res
//         .status(404)
//         .send('Card Not Found');
//     }
//     res.json(bookmark);
//   })
//   .delete((req, res) => {
//     // move implementation logic into here
//     const {bookmark_id} = req.params;
//     const bookmarkIndex = bookmarks.findIndex(item => item.id == bookmark_id);
    
//     if(bookmarkIndex === -1) {
//       logger.error(`List with id ${bookmark_id} not found.`);
//       return res
//         .status(404)
//         .send('Not Found');
//     };
//     bookmarks.splice(bookmarkIndex, 1);
//     logger.info(`List with id ${bookmark_id} deleted.`);
//     res
//       .status(204)
//       .end();
// });

module.exports = bookmarksRouter;
