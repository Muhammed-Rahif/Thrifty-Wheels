var express = require('express');
var router = express.Router();
var adminFunctions = require('../functions/admin-functions');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');

var verifyAdminLogin = (req, res, next) => {
    let userLogged = req.session.user;
    if (userLogged) {
        next();
    } else {
        res.redirect('/admin/login');
    }
}

router.get('/', verifyAdminLogin, async (req, res, next) => {
    let allPosts = await adminFunctions.getAllPosts();
    res.render('admin/view-posts', { allPosts });
});

router.get('/login', (req, res, next) => {
    res.render('admin/login-page');
});

router.post('/get-post-det', async (req, res) => {
    let post = await adminFunctions.getPost(req.body.postId);
    res.json(post);
})

router.post('/login', (req, res) => {
    let reqData = req.body;
    adminFunctions.adminLogin(reqData).then((response) => {
        if (response.loginStatus === true) {
            req.session.user = {};
            req.session.user.data = reqData;
            res.redirect('/admin');
        } else {
            res.render('admin/login-page', { loginErr: response.loginStatus })
        }
    })
});

router.get('/add-post', verifyAdminLogin, (req, res) => {
    let userLogged = req.session.user;
    if (userLogged) {
        res.render('admin/add-post-page');
    } else {
        res.redirect('/admin/');
    }
});

router.post('/add-post', (req, res) => {
    let postData = req.body;
    postData.postId = uuidv4();
    adminFunctions.addPost(postData).then(() => {
        console.log(postData);
        let image = req.files.postImg;
        image.mv(`./public/gallery/post-images/${postData.postId}.jpg`, (err, done) => {
            if (!err) {
                sharp(`./public/gallery/post-images/${postData.postId}.jpg`)
                    .resize(320, 240)
                    .toFile(`./public/gallery/post-thumbnails/${postData.postId}.jpg`, (err, info) => {
                        if (!err) {
                            console.log(info);
                        } else {
                            console.log(err);
                        }
                    });
                res.render('admin/add-post-page', { postAdded: "Post added successfully..!" })
            } else {
                console.error(err)
            }
        })
    })
});

router.get('/edit-post/:postId',verifyAdminLogin,(req,res)=>{
    let postId = req.params.postId;
    adminFunctions.getPost(postId).then((post)=>{
        res.render('admin/edit-post-page',{ post })
    })
})

router.post('/edit-post', (req, res) => {
    let postData = req.body;
    adminFunctions.updatePost(postData).then(() => {
        let image = req.files.postImg;
        image.mv(`./public/gallery/post-images/${postData.postId}.jpg`, (err, done) => {
            if (!err) {
                sharp(`./public/gallery/post-images/${postData.postId}.jpg`)
                    .resize(320, 240)
                    .toFile(`./public/gallery/post-thumbnails/${postData.postId}.jpg`, (err, info) => {
                        if (!err) {
                            console.log(info);
                        } else {
                            console.log(err);
                        }
                    });
                res.redirect('/admin')
            } else {
                console.error(err)
            }
        })
    })
});


module.exports = router;