import asyncio
import os

import edge_tts

# Create the audio folder if it doesn't exist
output_dir = "public/audio"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# The complete dictionary of all words in the AAC app
words = {
    # Quick Phrases
    "q1": "ແມ່ນ",
    "q2": "ບໍ່",
    "q3": "ອາດຈະ",
    "q4": "ກະລຸນາ",
    "q5": "ຂອບໃຈ",
    "q6": "ຊ່ວຍແດ່",
    "q7": "ຢຸດ",
    "q8": "ໄປ",
    # Needs
    "n1": "ນ້ຳ",
    "n2": "ອາຫານ",
    "n3": "ຫ້ອງນ້ຳ",
    "n4": "ງ່ວງນອນ",
    "n5": "ເຈັບ",
    "n6": "ໜາວ",
    "n7": "ຮ້ອນ",
    "n8": "ເມື່ອຍ",
    # Food & Drink
    "f1": "ໝາກແອັບເປິ້ນ",
    "f2": "ໝາກກ້ວຍ",
    "f3": "ນົມ",
    "f4": "ນ້ຳໝາກໄມ້",
    "f5": "ພິດຊ່າ",
    "f6": "ແຊນວິດ",
    "f7": "ຄຸກກີ້",
    "f8": "ກະແລັມ",
    # Feelings
    "fe1": "ດີໃຈ",
    "fe2": "ເສຍໃຈ",
    "fe3": "ໃຈຮ້າຍ",
    "fe4": "ຢ້ານ",
    "fe5": "ຕື່ນເຕັ້ນ",
    "fe6": "ບໍ່ສະບາຍ",
    "fe7": "ຮັກ",
    "fe8": "ສັບສົນ",
    # Activities
    "a1": "ຫຼິ້ນ",
    "a2": "ອ່ານ",
    "a3": "ໂທລະທັດ",
    "a4": "ຍ່າງ",
    "a5": "ຟັງເພງ",
    "a6": "ແຕ້ມຮູບ",
    "a7": "ລອຍນ້ຳ",
    "a8": "ສວນສາທາລະນະ",
    # People
    "p1": "ແມ່",
    "p2": "ພໍ່",
    "p3": "ທ່ານໝໍ",
    "p4": "ຄູອາຈານ",
    "p5": "ໝູ່",
    "p6": "ເດັກນ້ອຍ",
    "p7": "ຄອບຄົວ",
    "p8": "ຕຳຫຼວດ",
}

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
