export const AWS_BUDGETS = 'AWS_BUDGETS';

export function fetchAWSBudgets() {

    var AWS = require('aws-sdk');
    AWS.config.apiVersions = {
      budgets: '2016-10-20',
      accessKeyId: 'AKIAIVBAO57AHAEMT2WQ',
      secretAccessKey: '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',
      region: 'us-east-1'
      // other service API versions
    };
    // let AWSService = new AWS.Service();

    var budgets = new AWS.Budgets().describeBudgets().promise();

    // var AWSBudgets = new AWS.Budgets();
    // var AWSBudgets = new AWS.Budgets({
    //   accessKeyId: 'AKIAIVBAO57AHAEMT2WQ',
    //   secretAccessKey: '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',
    //   region: 'us-east-1'
    // });

    // let AWSbudgets = budgets.describeBudgets().promise();
    console.log(budgets);

    return {
        type: AWS_BUDGETS,
        payload: budgets
    };
}
