var express = require('express');
var router = express.Router();
var userFunctions = require('../functions/user-functions')

/* GET users listing. */
router.get('/', function (req, res, next) {
  userFunctions.getAllPostsByRating().then((allPosts) => {
    userFunctions.getRandomFivePosts().then((fivePosts) => {
      userFunctions.getShufflePosts().then((shufflePosts) => {
        let randomPost = allPosts[Math.floor(Math.random() * allPosts.length)];
        res.render('user/home-page', { allPosts, randomPost, fivePosts, shufflePosts })
      })
    })
  })
});

router.get('/about', (req, res, next) => {
  userFunctions.getRandomNumPosts(4).then(async (randomPosts) => {
    let threePosts = await userFunctions.getRandomNumPosts(3);
    res.render('user/about-page', { randomPosts, threePosts })
  })
});



module.exports = router;
