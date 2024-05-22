const express = require('express');
const router = express.Router();
const Post = require('../models/post');

//routes
/**
 * Get /
 * Home
 */
router.get('', async (req, res) => {
    try {

        const locals = {
            title: "NodeJs Blog",
            description: "Simple blog created with NodeJs, Express & MongoDb."
        }

        let perPage = 10;
        let page = req.query.page || 1;

        const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        const count = await Post.count();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil( count/perPage );

        res.render('index', {
             locals,
             data,
             current: page,
             nextPage: hasNextPage ? nextPage: null,
             currentRoute: '/'
            });

    } catch (error) {
        console.log(error)
    }


    
});



/**
 * Get /
 * Posts:id
 */
router.get('/post/:id', async (req, res) => {
    try {
        
        let slug = req.params.id;

        const data = await Post.findById({ _id:slug });

        const locals = {
            title: data.title,
            description: "Simple blog created with NodeJs, Express & MongoDb.",
            currentRoute: '/post/${slug}'
        }


        res.render('post', { locals, data });


    } catch (error) {
        console.log(error);
    }

    
});


/**
 * Post /
 * Post - searchTerm
 */
router.post('/search', async (req, res) => {
    try {
        const locals ={
            title: "Search",
            description: "Simple blog created with NodeJs & MongoDb."
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

        const data = await Post.find({
            $or:[
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
            ]
        });

        res.render('search', { 
            locals,
            data
        });

    } catch (error) {
        console.log(error);
    }
})





router.get('/about', (req,res) => {
    res.render('about', {
        currentRoute: '/about'
    });
})

module.exports = router;


// function insertPostData () {
//     Post.insertMany ([
//         {
//             title:"Building a blog",
//             body:"This is the body text"
//         },
//         {
//             title:"How to Steal an eel",
//             body:"Bro you might die while trying to even get a toch on it"
//         },
//         {
//             title:"Sell Like Crazy",
//             body:"How to get msny clients"
//         },
//         {
//             title:"A day in the life",
//             body:"You should literally mind your business"
//         },
//         {
//             title:"I think my girl is a gem",
//             body:"You might just be hallucinating"
//         },
//         {
//             title:"Browser and Peaches",
//             body:"It's about a not to be love-story in mario movie"
//         },
//         {
//             title:"How to change a light bulb",
//             body:"Get a chair and a new bulb, then change it"
//         },
//         {
//             title:"My dog is black",
//             body:"Get a chair and a new bulb, then change it"
//         },
//     ])
// }
// insertPostData();