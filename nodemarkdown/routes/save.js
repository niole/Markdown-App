"use strict";
var express = require('express');
var router = express.Router();

/*
 * GET userlist.
 */
router.get('/mdstring', function(req, res) {
    var db = req.db;
    // TODO
    db.collection('mdstring').findOne(function(err,result) {
      if (err) {throw err;}
      res.json(result);
  });
});

router.post('/mdstore', function(req,res) {
  // TODO
  var db = req.db;
  db.collection('mdstring').count(function(err,count) {
    if (count === 0) {
      db.collection('mdstring').insert(req.body, function(err,result) {
        console.log(req.body);
        console.log(result);
        res.json(result);
      });
    }
    else {
      console.log(req.body);
      db.collection('mdstring').update({appName: 'nodemarkdown'},{$set:{mdstring:req.body.mdstring}}, function(err,result) {
        if (!err) {console.log('SUCCESS');}
        console.log('result');
        console.log(result);
        res.json(result);
      });
    }
  });
});

module.exports = router;
