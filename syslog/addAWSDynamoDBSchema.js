var AWS = require('aws-sdk');

AWS.config.update({region:'us-east-1'});

var dynamodb = new AWS.DynamoDB();

// "workerID" : {"S": workerStatsList[3].replace(/\[.*\].*/, '').replace(/worker@/, '')},
// "date" : {"S": workerStatsList[4].replace(/\[/, '')},
// "time" : {"S": workerStatsList[5].replace(/\]/, '')},
// "accepted"  : {"S": workerStatsList[7] + ' ' + workerStatsList[8].replace(/,/, '')},
// "Hs": {"N": workerStatsList[9]},
// "diff": {"N": workerStatsList[13]}

var params = {
  AttributeDefinitions: [
     {
       AttributeName: "workerID",
       AttributeType: "S"
     },
     {
       AttributeName: "eventDate",
       AttributeType: "S"
     }
  ],
  KeySchema: [
     {
       AttributeName: "workerID",
       KeyType: "HASH"
     },
     {
       AttributeName: "eventDate",
       KeyType: "RANGE"
     }
  ],
  ProvisionedThroughput: {
   ReadCapacityUnits: 5,
   WriteCapacityUnits: 5
  },
  TableName: "Miners"
 };
 dynamodb.createTable(params, function(err, data) {
   if (err) console.log(err, err.stack); // an error occurred
   else     console.log(data);           // successful response
 });
