var db = require('../config/connection');
var collections = require('../config/collections');
var bcrypt = require('bcrypt');
var Promise = require('promise');
const { resolve, reject } = require('promise');

module.exports = {
    adminLogin: (reqData) => {
        return new Promise(async (resolve, reject) => {
            let existAdmin = await db.get().collection(collections.ADMIN_COLLECTION).findOne({ name: 'name' })
            if (existAdmin) {
                if (reqData.name === existAdmin.name) {
                    if (reqData.email === existAdmin.email) {
                        bcrypt.compare(reqData.code, existAdmin.code).then((status) => {
                            if (status) {
                                bcrypt.compare(reqData.ip, existAdmin.ip).then((status) => {
                                    if (status) {
                                        bcrypt.compare(reqData.password, existAdmin.password).then((status) => {
                                            if (status) {
                                                resolve({ loginStatus: true })
                                            } else {
                                                resolve({ loginStatus: 'Incorrect password typed..!' })
                                            }
                                        })
                                    } else {
                                        resolve({ loginStatus: 'Incorrect secret ip typed..!' })
                                    }
                                })
                            } else {
                                resolve({ loginStatus: 'Incorrect secret code typed..!' })
                            }
                        })
                    } else {
                        resolve({ loginStatus: 'Invalid email typed..!' })
                    }
                } else {
                    resolve({ loginStatus: 'Invalid name typed..!' })
                }
            } else {
                let adminDetails = {
                    name: 'name',
                    email: 'example@gmail.com',
                    password: '$2b$10$7IfVp8ZxhwpA9EWJ1Faoi.xQj0s0P8qDsz9seWV6Aq2eps24Wr01C',
                    code: '$2b$10$d.fw5we9z9aFx50kGxBjleZm/JSuhKUuOlFFy1Oo9arhB3R6utwKa',
                    ip: '$2b$10$Nr11.Jly2jlARq6FDlFjeORWGgaAdHs1STaQ48LC1P8QOMY3cmfIW'
                }
                db.get().collection(collections.ADMIN_COLLECTION).insertOne(adminDetails).then(() => {
                    if (reqData.name === existAdmin.name) {
                        if (reqData.email === existAdmin.email) {
                            bcrypt.compare(reqData.code, existAdmin.code).then((status) => {
                                if (status) {
                                    bcrypt.compare(reqData.ip, existAdmin.ip).then((status) => {
                                        if (status) {
                                            bcrypt.compare(reqData.password, existAdmin.password).then((status) => {
                                                if (status) {
                                                    resolve({ loginStatus: true })
                                                } else {
                                                    resolve({ loginStatus: 'Incorrect password typed..!' })
                                                }
                                            })
                                        } else {
                                            resolve({ loginStatus: 'Incorrect secret ip typed..!' })
                                        }
                                    })
                                } else {
                                    resolve({ loginStatus: 'Incorrect secret code typed..!' })
                                }
                            })
                        } else {
                            resolve({ loginStatus: 'Invalid email typed..!' })
                        }
                    } else {
                        resolve({ loginStatus: 'Invalid name typed..!' })
                    }
                })
            }
        })
    },
    addPost:(postData)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.POSTS_COLLECTION).insertOne(postData).then(()=>{
                resolve();
            })
        })
    },
    getAllPosts:()=>{
        return new Promise(async(resolve,reject)=>{
            let allPosts = await db.get().collection(collections.POSTS_COLLECTION).find({}).toArray();
            resolve(allPosts);
        })
    },
    getPost:(postId)=>{
        return new Promise(async(resolve,reject)=>{
            let post = await db.get().collection(collections.POSTS_COLLECTION).findOne({postId:postId});
            resolve(post);
        })
    },
    updatePost:(postData)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.POSTS_COLLECTION).updateOne({postId:postData.postId},{
                $set:{
                    mainTitle:postData.mainTitle,
                    vehicleName:postData.vehicleName,
                    postDiscription:postData.postDiscription,
                    postDate:postData.postDate,
                    starRating:postData.starRating,
                    postImg:postData.postImg,
                }
            }).then((data)=>{
                resolve();
            })
        })
    },deletePost:(postId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.POSTS_COLLECTION).removeOne({postId:postId}).then(()=>{
                resolve({status:true});
            })
        })
    }
}