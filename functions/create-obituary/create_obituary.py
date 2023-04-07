# add your create-obituary function here
import json
import boto3
import requests

ssm = boto3.client('ssm')
polly = boto3.client('polly')

cloudinary_keys = ssm.get_parameters_by_path(
    Path='/cloudinary',
    Recursive=True,
    WithDecryption=True
)


def handler(event, context):
    # TODO implement
    content_type = event['headers']['Content-Type']
    print(content_type)
    body = event['body']
    print(body)

    reponse = {
        'statusCode': 200,
        'body': json.dumps({"message": 'create-obituary'})
    }

    return reponse

def generate_obituary(name, birth_year, death_year):
    pass
    # TODO implement
    

def text_to_speech(text):
    # TODO implement
    pass