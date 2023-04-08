# add your get-obituaries function here
import json
import boto3
import requests

dynamodb = boto3.client('dynamodb')

def handler(event, context):
    print(event)
    print(context)

    dynamodb_response = dynamodb.scan(
        TableName="obituary-table-30129329",
        )
    print(dynamodb_response)

    items = dynamodb_response['Items']
    response_items = []

    for item in items:
        response_item = {
            'id': item['id']['S'],
            'name': item['name']['S'],
            'birth_year': item['birth_year']['S'],
            'death_year': item['death_year']['S'],
            'obituary_text': item['obituary_text']['S'],
            'image_url': item['image_url']['S'],
            'audio_url': item['audio_url']['S']
        }
        response_items.append(response_item)

    return {
        'statusCode': 200,
        'body': json.dumps(response_items)
    }