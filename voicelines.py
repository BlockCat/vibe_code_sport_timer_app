import json
import os
import requests

os.makedirs("./public/voices", exist_ok=True)

def read_messages():
    messages = []
    with open("src/app/pages/training-set/data.json") as r:
        d = json.load(r)
        for a in d["exercises"]:
            for hint in d["exercises"][a]["hints"]:
                messages.append({"id": hint["id"] , "content": hint["voice"] })

        for a in d["workouts"]:
            for b in d["workouts"][a]["exercises"]:
                messages.append({ "id": b["id"] + "_" + str(b["activeSeconds"]), "content": "Next: " + 
                                d["exercises"][b["id"]]["title"] + ", " + str(b["activeSeconds"]) + " seconds." })
        for a in d["lines"]:
            messages.append({
                "id": a,
                "content": d["lines"][a]
            })

    return messages

def filter_new_messages(messages):

    # Does id mp3 exist in ./public/voices
    missing_messages = []
    for message in messages:
        if not os.path.exists(f"./public/voices/{message['id']}.mp3"):
            missing_messages.append(message)

    seen = set()
    deduped = []

    for message in missing_messages:
        if not message["id"] in seen:
            seen.add(message["id"])
            deduped.append(message)


    return deduped

def generate_message(message):
    # Get API key from environment variable for security
    api_key = ""
    # if not api_key:
    #     print("Error: OPENAI_API_KEY environment variable not set")
    #     exit(1)

    # OpenAI TTS API endpoint
    url = "https://api.openai.com/v1/audio/speech"

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    data = {
        "model": "gpt-4o-mini-tts",
        "voice": "onyx",
        "instructions": "You are a calm drill sergeant",
        "input": message["content"]
    }


    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        # Save the audio file
        with open(f"./public/voices/{message['id']}.mp3", "wb") as f:
            f.write(response.content)
        print(f"Generated audio for: {message['id']}")
    else:
        print(f"Error generating audio for {message['id']}: {response.status_code}")
        print(response.text)

    # Run the functions
messages = read_messages()
missing = filter_new_messages(messages)

for message in missing:
    generate_message(message)
