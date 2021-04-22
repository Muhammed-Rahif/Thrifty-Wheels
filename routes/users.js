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

router.get('/view-post/:postId', (req, res) => {
  let postId = req.params.postId;
  userFunctions.getPostDetails(postId).then(async(postDet) => {
    let allReviews = await userFunctions.getPostReviews(postId);
    res.render('user/view-post-page' , { postDet , allReviews })
  })
})


router.post('/post-review',(req,res)=>{
  let reviewData = req.body;
  console.log(reviewData);
  userFunctions.addReview(reviewData).then(()=>{
    res.json({status:true})
  })
})

router.post('/get-post-reviews',(req,res)=>{
  let postId = req.body.postId;
  userFunctions.getPostReviews(postId).then((postData)=>{
    res.json(postData);
  })
})


module.exports = router;
