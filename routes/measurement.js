var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let Measurement = mongoose.model('measurement');
router.get("/all", function(req, res, next){
    Measurement.aggregate([{
        "$project": {
            "_id": 1,
            "tags": 1
        }
     }])
});

router.get("/bydate", function(req, res, next){
    Measurement.aggregate([
        {
            $group:{
               _id:{type:"$type",date:"$date"},
               amount:{$sum:1}
            }
          },
          {
            $group:{
               _id:"$_id.date",
               emotions:{$push:{type:"$_id.type",amount:"$amount"}}
            }
          },
          {
              $project:{
                day: "$_id",
                emotions: 1,
                _id: 0
              }
          }
     ]).exec(function(err, result){
         console.log(err)
        res.json(result)
     });
});
router.get("/byemotion", function(req, res, next){
    Measurement.aggregate([
        {
            $group: {
               _id: '$type',
               type: {$sum: 1}
           },
       }, {
        $project: {  
            type: "$_id",
            amount: "$type",
            _id: 0
         }
       }
     ]).exec(function(err, result){
         console.log(err)
        res.json(result)
     });
});

router.get("/worldstatus", function(req, res,next){
    Measurement.aggregate([
        {
            $group: {
                _id: "",
                Total: {$sum: 1},
                Happy: { $sum: { $cond :  [{ $eq : ["$type", "BLIJ"]}, 1, 0]} },
            }, 
        },
        {
            $project: {
                _id:0,
                percentage:{$divide: [ "$Happy", "$Total" ]} 
            }
        }
    ]).exec(function(err, result){
        console.log(err)
       res.json(result[0].percentage)
    });
});
router.get("/worldstatusbydate", function(req, res,next){
    Measurement.aggregate([
        {
            $group: {
                _id: "$date",
                Total: {$sum: 1},
                Happy: { $sum: { $cond :  [{ $eq : ["$type", "Blij"]}, 1, 0]} },
            }, 
        },
        {
            $project: {
                date: "$_id",
                _id:0,
                percentage:{$divide: [ "$Happy", "$Total" ]} 
            }
        }
    ]).exec(function(err, result){
        console.log(err)
       res.json(result)
    });
});

router.post("/", function(req, res,next){
    let measurement = new Measurement({type: req.body.type})
    console.log(measurement)
    measurement.save(function(err, measurement){
        res.json(measurement);
    })
});

module.exports = router;