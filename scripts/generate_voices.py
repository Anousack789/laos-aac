import asyncio
import json
import os

import edge_tts

# Create the audio folder if it doesn't exist
output_dir = "public/audio"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Load symbols from the shared JSON file
with open("src/data/symbols.json", "r", encoding="utf-8") as f:
    symbols_data = json.load(f)

# Extract words dictionary from symbols data for audio generation
words = {}
for category in symbols_data["categories"]:
    for symbol in category["symbols"]:
        words[symbol["id"]] = symbol["text"]

# Lao Voice selection:
# "lo-LA-KeomanyNeural" (Female)
# "lo-LA-ChanthavongNeural" (Male)
VOICE = "lo-LA-KeomanyNeural"


async def generate_all_audio():
    print("Checking and generating audio files using Edge-TTS...")

    for file_id, text in words.items():
        filename = f"{output_dir}/{file_id}.mp3"

        # Check if the file already exists
        if os.path.exists(filename):
            print(f"Skipped: {filename} already exists.")
            continue  # Skip to the next word

        try:
            # Generate and save the audio
            communicate = edge_tts.Communicate(text, VOICE)
            await communicate.save(filename)
            print(f"Generated: {filename} -> {text}")

        except Exception as e:
            print(f"Failed to generate {file_id}.mp3: {e}")

    print("Done! All audio files are ready.")


if __name__ == "__main__":
    asyncio.run(generate_all_audio())
