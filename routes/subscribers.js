const express = require('express')
const subscriber = require('../models/subscriber')
const router = express.Router()
const cors = require("cors");
const app = express()

app.use(cors({
    origin: '*'
}));

app.use(cors({
    origin: 'http://localhost:3000/'
}));

const whitelist = ['http://localhost:3000/']
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error())
    }
  }
}

// app.use(cors({
//     methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
// }));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

router.get('/subscribers',async (req, res) => {
    console.log("before ")
    try{
        console.log("after")
        const subscribers = await Subscriber.find()
        console.log("subscribers :",subscribers)
        res.json(subscribers)
    }catch(err){
        console.log("error found")
        res.status(500).json({message : err.message})
    }
})

//Getting one
router.get('/:id',getSubscriber ,(req,res) => {
    res.send(res.subscriber)
})

//Creating one

router.post('/subscribers',async (req, res) => {

    console.log("name :",req.body.name);
    console.log("channel :", req.body.subscribedToChannel)
    const subscriber = new Subscriber({
        name : req.body.name,
        subscribedToChannel : req.body.subscribedToChannel
        })
    try{
        const newSubscriber = await subscriber.save()
        res.status(201).json(newSubscriber)
    }catch(err){
        res.status(400).json({message:err.message})
    }
    
})

//Updating one
router.patch('/:id',getSubscriber,async(req,res) => {
    if(req.body.name != null){
        res.subscriber.name = req.body.name
    }
    if(req.body.subscribedToChannel != null){
        res.subscriber.subscribedToChannel = req.body.subscribedToChannel
    }
    try{

        const updatedSubscriber = await res.subscriber.save()
        res.json(updatedSubscriber)
    }catch(err){
        res.status(400).json({message : err.message})
    }
})

//Deleting one
router.delete('/:id',getSubscriber,async(req,res) => {


    try{
       await res.subscriber.remove()
       res.json({message : 'Subscriber Deleted'})
    }catch(err){
        res.status(500).json({message : err.message})
    }
})

async function getSubscriber(req , res , next){
    let subscriber
    try{
        subscriber = await Subscriber.findById(req.params.id)
        if(subscriber == null){
            return res.status(404).json({message : 'cannot find subscriber'})
        }
    }catch(err){
        return res.status(500).json({message:err.message})
    }
    res.subscriber = subscriber
    next()
}

module.exports = router;