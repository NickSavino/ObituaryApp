import json
import sys
import base64
sys.path.append('../functions/get-obituaries')
from get_obituaries import handler

def test_get_obituaries_handler():
    event = None
    context = None

    response = handler(event, context)    
    print(response)
    print(json.loads(response['statusCode']))
    assert json.loads(response['statusCode']) == 200