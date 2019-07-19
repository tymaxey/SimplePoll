const express = require('express');
const bodyParser = require('body-parser')
const Poll = require("../models/poll");


const router = express.Router();
router.use(bodyParser.json({ extended: true, limit: "5mb" }));
//localhost:3001/poll

//localhost:3001/poll*
// router.all('*',(req,res,next) => {
//   if (req.headers.token === '1234') {
//     req.walrus = 'im a walrus'
//     next()
//   }
//   res.status(403).send('you did not provide the correct header token password to access the api.')
// })

//localhost:3001/poll/
router.post('/createPoll', (req, res) => {
  Poll.create(req.body.pollObj,(err, poll) => {
    if (err) {

      return res.status(500).send(err);
    }
    return res.status(200).send(poll)
  });
})

router.get('/singlePoll/:titleStr', (req, res) => {
  Poll.find({title: req.params.titleStr},(err,retrievedPoll) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send(retrievedPoll);
  })
});

router.get('/randomPoll',(req,res) => {
  Poll.aggregate([{$sample: {size: 1}}], (err,retrievedPoll) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send(retrievedPoll);
  })
})

router.put('/vote/:titleStr',(req,res) => {
  console.log(req.body.pollIndex)
  console.log(req.params.titleStr)
  Poll.find({ title: req.params.titleStr }, (err, retrievedPoll) => {
    if (err) {
      return res.status(500).send(err);
    }
    retrievedPoll[0].optionsObjArr[req.body.pollIndex].voteCount++;
    Poll.findByIdAndUpdate(retrievedPoll[0]._id, retrievedPoll[0],{new:true},(err, updatedPoll)=>{
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send(updatedPoll);
    });
  });
})


module.exports = router;