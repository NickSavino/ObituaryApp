# add your create-obituary function here
import json
import boto3
import requests
from requests_toolbelt.multipart.decoder import MultipartDecoder
import time
import hashlib
import base64

ssm = boto3.client('ssm')
polly = boto3.client('polly')


max_tokens = 100


def fetch_keys():
    cloudinary_keys = ssm.get_parameters_by_path(
    Path='/cloudinary',
    Recursive=True,
    WithDecryption=True
    )
    
    chatgpt_keys = ssm.get_parameters_by_path(
    Path='/chatgpt',
    Recursive=True,
    WithDecryption=True
    )
    
    keys = {}
    keys.update({p['Name']: p['Value'] for p in cloudinary_keys['Parameters']})
    keys.update({p['Name']: p['Value'] for p in chatgpt_keys['Parameters']})    

    
    return keys

def handler(event, context):
    print(event)

    # get the body and content type
    content_type = event['headers']['content-type']
    print(content_type)
    body = event['body']

    # parse the body
    multipart_data = MultipartDecoder(body, content_type)

    # initialize variables
    obituary_data = {}
    image_data = None

    # loop through the parts of the body
    for part in multipart_data.parts:
        content_disposition = part.headers[b'Content-Disposition'].decode('utf-8')
        field_name = content_disposition.split(';')[1].split('=')[1].replace('"', '')
        
        if field_name == "file":
            image_data = part.content
        else:
            obituary_data[field_name] = part.text

    
    # generate the obituary text
    obituary_text = generate_obituary(**obituary_data)

    # convert the text to speech
    audio_data = text_to_speech(obituary_text)
    
    #convert the image and audio data to base64
    image_data = base64.b64encode(image_data).decode('utf-8')
    audio_data = base64.b64encode(audio_data).decode('utf-8')
    
    image_response, audio_response = upload_to_cloudinary(image_data, audio_data)

    print(image_response)
    print(audio_response)

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "obituary created",
        }),
    }
        
    

def generate_obituary(name, birth_year, death_year):
    # TODO implement
    prompt = f"write an obituary about a fictional character named {name} who was born on {birth_year} and died on {death_year}."
    
    headers = { 'Authorization': f"Bearer {fetch_keys()['/chatgpt/secretkey']}" }

    data = {
        "model": "text-ada-001",
        "prompt": prompt,
        "max_tokens": max_tokens,
    }
    response = requests.post('https://api.openai.com/v1/completions', headers=headers, json=data)
    print(response.json())
    obituary_text = response.json()["choices"][0]["text"]

    return obituary_text.strip()    

def text_to_speech(text):
    
    response = polly.synthesize_speech(
        Text=text,
        OutputFormat='mp3',
        VoiceId='Joanna'
    )

    print(response)
    
    return response['AudioStream'].read()

#creates a signature for the cloudinary upload
def calculate_signature(params, api_secret):
    sorted_params = sorted(params.items())
    string_to_sign = "&".join(f"{key}={value}" for key, value in sorted_params) + api_secret
    return hashlib.sha1(string_to_sign.encode('utf-8')).hexdigest()


#creates the payload for the cloudinary upload    
def create_payload(data_type, data, api_key, secret_key):
    timestamp = int(time.time())
    if data_type == "image":
        file_type = "data:image/jpeg;base64" 
    else:
        file_type = "data:audio/mpeg;base64"


    params = {
        "timestamp": timestamp,
    }
    signature = calculate_signature(params, secret_key)

    return {
        "api_key": api_key,
        "timestamp": timestamp,
        "signature": signature,
        "file": f"{file_type},{data}",
        "resource_type": data_type,
    }

#uploads the image and audio to cloudinary
def upload_to_cloudinary(image_data, speech_data):
    keys = fetch_keys()
    api_key = keys['/cloudinary/accesskey']
    secret_key = keys['/cloudinary/secretkey']

    cloudinary_url = "https://api.cloudinary.com/v1_1/dxm6a1io9"

    # Upload the speech data
    speech_payload = create_payload("video", speech_data, api_key, secret_key)
    speech_response = requests.post(f"{cloudinary_url}/video/upload/", data=speech_payload)

    # Upload the image data
    image_payload = create_payload("image", image_data, api_key, secret_key)
    image_response = requests.post(f"{cloudinary_url}/image/upload/", data=image_payload)
    
    print("Image response content:", image_response)
    print("Speech response content:", speech_response)

    return image_response.json(), speech_response.json()
 