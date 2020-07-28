//import AWS sdk
const AWS = require('aws-sdk')
// import function to create a unique identifier
const uuid = require('uuid')

//import document client that will allow to run functions against dynamodb table
const documentClient = new AWS.DynamoDB.DocumentClient()
///export handler 
//pass in parameters and have item will have an ID using uuid library and also have a task will have to pass in
//also pass in table name as environment variable
exports.addTasks = function(event, context, callback) {
    const parameters = {
        Item: {
            "Id": uuid.v1(),
            "Task": event.task 
        },

        ///pass in table name as env variable
        TableName: process.env.TABLE_NAME
    }
    //to add items into dynanmodb talbe , use the put method
    documentClient.put(parameters, function(err, data) {
        callback(err, data)
    })
}