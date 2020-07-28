//node js backend
///require AWS sdk
const AWS = require('aws-sdk')

///import the dynamodb client and allow us to run functions against the table
const documentClient = new AWS.DynamoDB.DocumentClient()

///export handler
//as a node js backend our function takes in an event, context and callback
//specify parameters and for the table I am using an environment variable
exports.getAllTasks = function(event, context, callback) {
        const parameters = {
            TableName: process.env.TABLE_NAME
        };
        //run the scan function for our table and pass it the table name and error handlers
        //and otherwise return the data
        documentClient.scan(parameters, function(err, data) {
            if(err) {
                callback(err, null)
            } else {
                callback(null, data.Items)
            }
        })
}