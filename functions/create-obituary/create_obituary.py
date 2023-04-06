# add your create-obituary function here
import json

def handler(event, context):
    # TODO implement
    print(event)
    print(context)
    return {
        'statusCode': 200,
        'body': json.dumps({"message": 'create-obituary'})
    }