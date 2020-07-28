React using API Gateway, Lambda, and DynamoDB

Steps

1. Create dynanmodb table using the AWS CLI

    aws dynamodb create-table --table-name TodoList --attribute-definitions AttributeName=Id,AttributeType=S AttributeName=Task,AttributeType=S --key-schema AttributeName=Id,KeyType=HASH AttributeName=Task,KeyType=RANGE --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

    HASH= partition key 
    in dynamodb tables are split into partitions
    within every one of these partitions, it will be sorted by Task 
    provisionedreadcapacity

2. Create IAM role used by Lambda function

    policies will tell lambda service will be allowed to do

    aws iam create-role --role-name lambda-role --assume-role-policy-document file://lambda-entity.json

3. Create policy to allow lambda service to put items and scan items into the dynamodb table
        policy --name dynamodb access
        Attach policy 

         aws iam put-role-policy --role-name lambda-role --policy-name dynamodb-access --policy-document file://dynamodb-policy.json


4. Create get lambda function
        you have to zip up the data to lambda
        //first zip lambda function to AWS

        zip get.zip get.js
            //role: arn:aws:iam::536510685689:role/lambda-role
        //then create function
        //only for zip files you add b to fileb://
        aws lambda create-function --function-name get-tasks --zip-file fileb://get.zip --runtime nodejs --role arn:aws:iam::536510685689:role/lambda-role --runtime nodejs12.x --handler get.getAllTasks --environment Variables={TABLE_NAME=TodoList}

5. Create put lambda function

        ///zip up post.js 

        zip post.zip post.js

        aws lambda create-function --function-name add-tasks --zip-file fileb://post.zip --runtime nodejs --role arn:aws:iam::536510685689:role/lambda-role --runtime nodejs12.x --handler get.getallTasks --environment Variables={TABLE_NAME=TodoList}

6. Create API endpoint 


        aws apigateway create-rest-api --name 'Todo List'

        rest API Id: b8dj7s0fk5

7. Get the APIgateway id to the root path


        aws apigateway get-resources --rest-api-id b8dj7s0fk5
        root: eo60isvp59
         parent/root path ID: eo60isvp59

8. Create another path/route

        aws apigateway create-resource --rest-api-id b8dj7s0fk5 --parent-id eo60isvp59 --path-part 'tasks'

        resource ID: oq6v8s
        /tasks: oq6v8s

9. Add Methods to get route 

        aws apigateway put-method --rest-api-id b8dj7s0fk5 --resource-id oq6v8s --http-method GET --authorization-type NONE

10. Add methods to post route

        aws apigateway put-method --rest-api-id b8dj7s0fk5 --resource-id oq6v8s --http-method POST --authorization-type NONE

11. Add responses to HTTP methods
        
        aws apigateway put-method-response --rest-api-id b8dj7s0fk5 --resource-id oq6v8s --http-method GET --status-code 200

        aws apigateway put-method-response --rest-api-id b8dj7s0fk5 --resource-id oq6v8s --http-method POST --status-code 200
        

12. Link the HTTP methods to execute the Lambda function

    go to APIGateway console and select GET method under /tasks resource
    -Choose integration point to your new method
        - integration type: lambda function
        - lambda function - get tasks

    same thing but with add tasks (export handler method in post function)

13. Add responses to integration for GET and POST

        aws apigateway put-integration-response --rest-api-id b8dj7s0fk5 --resource-id oq6v8s --http-method GET --status-code 200 --selection-pattern ""

        aws apigateway put-integration-response --rest-api-id b8dj7s0fk5 --resource-id oq6v8s --http-method POST --status-code 200 --selection-pattern ""

14. Enable CORS

        go to API gateway console under Actions, select Enable CORS

        Error: when enabling cors
            Add Access-Control-Allow-Origin Method response header to GET method (invalid response status code specified)
            add GET to put-method-response CLI command

15. Deploy API

        aws apigateway create deployment --rest-api-id b8dj7s0fk5 --stage-name dev

        curl -X GET https://b8dj7s0fk5.execute-api.us-east-1.amazonaws.com/api/tasks

        Error: message forbidden
        1. you have to pass 'x-api-key' HTTP header parameter to API gateway
        














