var express = require("express");
var router = express.Router();
var adminFunctions = require("../functions/admin-functions");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const fs = require("fs");

var verifyAdminLogin = (req, res, next) => {
  let adminLogged = req.session.admin;
  if (adminLogged) {
    next();
  } else {
    res.redirect("/admin/login");
  }
};


router.get("/", verifyAdminLogin, async (req, res, next) => {
  let allPosts = await adminFunctions.getAllPosts();
  res.render("admin/view-posts", { allPosts });
});

router.get("/login", (req, res, next) => {
  if (req.session.admin) {
    res.redirect("/admin");
  } else {
    res.render("admin/login-page");
  }
});

router.post("/get-post-det", async (req, res) => {
  let post = await adminFunctions.getPost(req.body.postId);
  res.json(post);
});

router.post("/login", (req, res) => {
  let reqData = req.body;
  adminFunctions.adminLogin(reqData).then((response) => {
    if (response.loginStatus === true) {
      req.session.admin = {};
      req.session.admin.data = reqData;
      res.redirect("/admin");
    } else {
      res.render("admin/login-page", { loginErr: response.loginStatus });
    }
  });
});

router.get("/add-post", verifyAdminLogin, (req, res) => {
  let adminLogged = req.session.admin;
  if (adminLogged) {
    res.render("admin/add-post-page");
  } else {
    res.redirect("/admin/");
  }
});

router.post("/add-post", (req, res) => {
  let postData = req.body;
  postData.postImg = JSON.parse(postData.postImg);
  postData.postId = uuidv4();
  adminFunctions.addPost(postData).then(() => {
    res.redirect("/admin");
  });
});

router.get("/edit-post/:postId", verifyAdminLogin, (req, res) => {
  let postId = req.params.postId;
  adminFunctions.getPost(postId).then((post) => {
    res.render("admin/edit-post-page", { post });
  });
});

router.post("/edit-post", (req, res) => {
  let postData = req.body;
  postData.postImg = JSON.parse(postData.postImg);
  adminFunctions.updatePost(postData).then(() => {
    res.redirect("/admin");
  });
});

router.post("/delete-post", (req, res) => {
  let postId = req.body.postId;
  adminFunctions.deletePost(postId).then((response) => {
    res.json(response);
  });
});

module.exports = router;
