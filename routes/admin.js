var express = require('express');
var router = express.Router();
var adminFunctions = require('../functions/admin-functions');
const { v4: uuidv4 } = require('uuid');

var verifyAdminLogin = (req, res, next) => {
    let userLogged = req.session.user;
    if (userLogged) {
        next();
    } else {
        res.redirect('/admin');
    }
}

router.get('/', (req, res, next) => {
    res.render('admin/login-page');
});

router.post('/login', (req, res) => {
    let reqData = req.body;
    adminFunctions.adminLogin(reqData).then((response) => {
        if (response.loginStatus === true) {
            req.session.user = {};
            req.session.user.data = reqData;
            res.redirect('/admin/add-post');
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
                res.render('admin/add-post-page' , { postAdded:"Post added successfully..!" })
            } else {
                console.error(err)
            }
        })
    })
});


module.exports = router;