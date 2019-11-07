function makeBookmarksArray() {
  return [
    {
      id : 1,
      title : 'hello bye',
      url : 'http://www.google.com',
      description : 'google',
      rating : 3
    },
    {
      id : 2,
      title : 'facebook',
      url : 'https://www.facebook.com/',
      description : 'facebook',
      rating : 1
    },
    {
      id : 3,
      title : 'youtube',
      url : 'https://www.youtube.com/',
      description : 'youtube',
      rating : 5
    },
    {
      id : 4,
      title : 'thinkful github',
      url : 'https://github.com/thinkful-ei-heron',
      description : 'thinkful github',
      rating : 2
    },
  ];
};

module.exports = {
  makeBookmarksArray,
};

