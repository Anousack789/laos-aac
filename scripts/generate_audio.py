import asyncio
import json
import os
import sys

import edge_tts

# Create the audio folder if it doesn't exist
output_dir = "public/audio"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Lao Voice selection
VOICE = "lo-LA-KeomanyNeural"  # Female
# Alternative: "lo-LA-ChanthavongNeural" (Male)


async def generate_audio(file_id: str, text: str) -> str:
    """Generate audio for a single word and return the filename."""
    filename = f"{output_dir}/{file_id}.mp3"

    # Check if the file already exists
    if os.path.exists(filename):
        return filename

    try:
        communicate = edge_tts.Communicate(text, VOICE)
        await communicate.save(filename)
        return filename
    except Exception as e:
        print(f"Failed to generate {file_id}.mp3: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python generate_audio.py <file_id> <text>", file=sys.stderr)
        sys.exit(1)

    file_id = sys.argv[1]
    text = sys.argv[2]

    result = asyncio.run(generate_audio(file_id, text))
    print(result)
