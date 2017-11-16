export const UPDATE_AWS_WORKERS = 'UPDATE_AWS_WORKERS';
import promiseMiddleware from 'redux-promise';

export function fetchUpdateWorkers(LastEvaluatedKey) {
  console.log('action::fetchUpdateWorkers(LastEvaluatedKey)', LastEvaluatedKey)
    var AWS = require('aws-sdk');
    var dynamodb = new AWS.DynamoDB({
      accessKeyId: 'AKIAIVBAO57AHAEMT2WQ',
      secretAccessKey: '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',
      region: 'us-east-1'
    });
    var params = {
      TableName: "Workers",
      ExclusiveStartKey: {"#requestId": {"S": LastEvaluatedKey} }
     };

    let workers = dynamodb.scan(params).promise();

    return {
        type: UPDATE_AWS_WORKERS,
        payload: true
    };
}
