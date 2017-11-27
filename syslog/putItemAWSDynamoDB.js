var AWS = require('aws-sdk');

AWS.config.update({region:'us-east-1'});

var dynamodb = new AWS.DynamoDB();


var params = {"TableName":"Miners",
    "Item":{
        "workerID" : {"S": "t1"},
        "eventDate" : {"S": "1266543"},
        "eventTime" : {"S": "1544567"},
        "accepted"  : {"S": "22234567"},
        "Hs": {"N": "497"},
        "diff": {"N": "2200987"}
    }
 };

dynamodb.putItem(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});
