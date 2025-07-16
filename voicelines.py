import json
import os
import requests
from dataclasses import dataclass, field
from typing import Dict, List

os.makedirs("./public/voices", exist_ok=True)
@dataclass
class Hint:
    id: str
    voice: str

@dataclass
class Exercise:
    title: str
    hints: List[Hint] = field(default_factory=list)

@dataclass
class WorkoutExercise:
    id: str
    goal: Dict[str, int]  # e.g., {"repetitions": 10} or {"duration": 30}
    breakSeconds: int

@dataclass
class Workout:
    title: str 
    description: str 
    duration: int
    exercises: List[WorkoutExercise] = field(default_factory=list)

@dataclass
class TrainingData:
    exercises: Dict[str, Exercise] = field(default_factory=dict)
    workouts: Dict[str, Workout] = field(default_factory=dict)
    lines: Dict[str, str] = field(default_factory=dict)
    
    @classmethod
    def from_dict(cls, data_dict: dict):
        result = cls()
        
        # Parse exercises
        for ex_id, ex_data in data_dict.get("exercises", {}).items():
            hints = [Hint(**hint_data) for hint_data in ex_data.get("hints", [])]
            result.exercises[ex_id] = Exercise(title=ex_data.get("title", ""), hints=hints)
        
        # Parse workouts
        for workout_id, workout_data in data_dict.get("workouts", {}).items():
            exercises = [WorkoutExercise(**ex) for ex in workout_data.get("exercises", [])]
            result.workouts[workout_id] = Workout(
                title=workout_data.get("title", ""),
                description=workout_data.get("description", ""),
                duration=workout_data.get("duration", 0),
                exercises=exercises)
        
        # Parse lines
        result.lines = data_dict.get("lines", {})
        
        return result
def read_messages():
    messages = []
    with open("src/data.json") as r:
        # Use TrainingData class to parse the JSON
        training_data = TrainingData.from_dict(json.load(r))
        print(training_data)
        # Extract messages from exercises
        for ex_id, exercise in training_data.exercises.items():
            for hint in exercise.hints:
                messages.append({"id": hint.id, "content": hint.voice})
        # Extract messages from workouts
        for workout_id, workout in training_data.workouts.items():
            for exercise in workout.exercises:
                if "repetitions" in exercise.goal:
                    messages.append({
                        "id": f"{exercise.id}_r{exercise.goal['repetitions']}",
                        "content": f"Next: {training_data.exercises[exercise.id].title}, {exercise.goal['repetitions']} repetitions."
                    })
                elif "duration" in exercise.goal:
                    messages.append({
                        "id": f"{exercise.id}_{exercise.goal['duration']}",
                        "content": f"Next: {training_data.exercises[exercise.id].title}, {exercise.goal['duration']} seconds."
                    })
        # Extract messages from lines
        for line_id, line_content in training_data.lines.items():
            messages.append({"id": line_id, "content": line_content})


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
