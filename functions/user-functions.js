var db = require('../config/connection');
var collections = require('../config/collections');
var Promise = require('promise');
const { resolve, reject } = require('promise');
var moment = require('moment');



function getRandomObjectsByNumber(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}
function shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

module.exports = {
    getAllPostsByRating: () => {
        return new Promise(async (resolve, reject) => {
            let allPosts = await db.get().collection(collections.POSTS_COLLECTION).find({}).toArray();
            allPosts.sort((a, b) => {
                a = parseInt(a.starRating.charAt(0));
                b = parseInt(b.starRating.charAt(0));
                return b - a;
            })
            resolve(allPosts);
        })
    },
    getRandomFivePosts: () => {
        return new Promise(async (resolve, reject) => {
            let fivePosts = await db.get().collection(collections.POSTS_COLLECTION).find({}).toArray();
            if (fivePosts.length>=6) {
                fivePosts = getRandomObjectsByNumber(fivePosts, 5);
            } else {
                resolve(fivePosts)
            }
        })
    },
    getShufflePosts:()=>{
        return new Promise(async (resolve, reject) => {
            let allPosts = await db.get().collection(collections.POSTS_COLLECTION).find({}).toArray();
            allPosts = shuffleArray(allPosts);
            resolve(allPosts)
        })
    },getRandomNumPosts: (num) => {
        return new Promise(async (resolve, reject) => {
            let allPosts = await db.get().collection(collections.POSTS_COLLECTION).find({}).toArray();
            if (allPosts.length>=num+1) {
                allPosts = getRandomObjectsByNumber(allPosts, num);
            } else {
                resolve(allPosts)
            }
        })
    },
    getPostDetails:(postId)=>{
        return new Promise(async(resolve,reject)=>{
            let postDet = await db.get().collection(collections.POSTS_COLLECTION).findOne({postId:postId});
            resolve(postDet);
        })
    }
}