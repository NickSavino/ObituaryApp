import json
import sys
import base64
sys.path.append('../functions/create-obituary')
from create_obituary import handler
from create_obituary import fetch_keys
from create_obituary import generate_obituary
from create_obituary import text_to_speech
from create_obituary import upload_to_cloudinary

import requests
from requests_toolbelt.multipart.encoder import MultipartEncoder


def test_fetch_keys():
    keys = fetch_keys()

    assert keys != None
    assert len(keys) > 0


def test_create_obituary_handler():
    
    multipart_data = MultipartEncoder(
        fields={ "name": "John Doe", "birth_year": "1990", "death_year": "2019", "file": ("minions.jpeg", open("minions.jpeg", "rb"), "image/jpeg") }
    )

    event = {
        "headers": {
            "Content-Type": multipart_data.content_type
        },
        "body": multipart_data.to_string()
    }
    context = None

    response = handler(event, context)    
    print(response)

    assert response["statusCode"] == 200


def test_generate_obituary():
    obituary_text = generate_obituary("John Doe", 1990, 2019)
    print(obituary_text)

    assert obituary_text != None


def test_text_to_speech():
    text = "John Doe was born in 1990 and died in 2019."
    response = text_to_speech(text)
    print(response)
    
    assert response != None


def test_upload_to_cloudinary():

    file_name = "minions.jpeg"
    image_path = file_name
    text = "John Doe was born in 1990 and died in 2019."
    audio_data = text_to_speech(text)


    assert audio_data != None

    audio_data = base64.b64encode(audio_data).decode('utf-8')

    with open(image_path, "rb") as image_file:
        image_data = base64.b64encode(image_file.read()).decode('utf-8')


    image_response, speech_response  = upload_to_cloudinary(image_data, audio_data)

    assert image_response != None
    assert speech_response != None
