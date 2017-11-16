export const AWS_WORKERS = 'AWS_WORKERS';
import promiseMiddleware from 'redux-promise';

export function fetchAWSWorkers() {
    var AWS = require('aws-sdk');
    var dynamodb = new AWS.DynamoDB({
      accessKeyId: 'AKIAIVBAO57AHAEMT2WQ',
      secretAccessKey: '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',
      region: 'us-east-1'
    });
    var params = {
      "TableName": "Workers",
      // "FilterExpression": "date = :wID",
      // "ExpressionAttributeValues": {":wID": {"S": "IBS1"}},
     };


    // const workers = createAction('FETCH_THING', async id => {
    //    const result = await dynamodb.scan(params);
    //    return result.data;
    //  });


    let workers = dynamodb.scan(params).promise();
    // const workers = dynamodb.scan(params);
    // const workers = dynamodb.scan(params, function(err, data) {
    //    if (err) {
    //      console.log(err, err.stack);
    //    } else {
    //     //  console.log(data);
    //     //  return data;
    //    }
    //  });

     console.log(workers);

    return {
        type: AWS_WORKERS,
        payload: workers
    };
}
