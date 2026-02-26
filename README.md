# Lao AAC (Augmentative and Alternative Communication)

A bilingual (Lao-English) AAC application built with Next.js to help individuals with communication difficulties express themselves using symbols, text, and audio.

![SpeakEasy AAC](https://img.shields.io/badge/SpeakEasy-AAC-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Lao](https://img.shields.io/badge/Language-Lao-red)

## Features

- 🎯 **48 Core Symbols** across 6 categories (Quick Phrases, Needs, Food & Drink, Feelings, Activities, People)
- 🔊 **Audio Support** - Generated Lao TTS audio for each symbol
- 🎨 **Visual Design** - Color-coded categories with emoji icons
- 📱 **Responsive** - Works on desktop, tablet, and mobile devices
- 🌙 **Dark Mode** - Easy on the eyes in low-light environments
- 🔍 **Search** - Quick symbol search functionality
- ⭐ **Favorites** - Mark and access frequently used symbols
- 📝 **Sentence Builder** - Combine symbols to create sentences
- ✏️ **Custom Text** - Add custom text for words not in the symbol set
- ♿ **Accessibility** - High contrast mode and adjustable grid sizes

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Python 3.8+ (for audio generation)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd laos-aac
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up Python virtual environment (for audio generation):
```bash
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install edge-tts
```

### Development

Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
laos-aac/
├── src/
│   ├── app/
│   │   ├── ACCApp.tsx      # Main AAC application component
│   │   ├── page.tsx        # Home page
│   │   └── layout.tsx      # Root layout
│   └── data/
│       ├── symbols.json    # Shared symbols data (single source of truth)
│       ├── symbols.ts      # TypeScript wrapper with types
│       └── README.md       # Data usage documentation
├── public/
│   └── audio/              # Generated audio files
├── scripts/
│   ├── generate_audio.py   # Single word audio generation script
│   └── generate_voices.py  # Batch audio generation for all symbols
└── package.json
```

## Symbol Categories

| Category | Lao Name | Symbols |
|----------|----------|---------|
| Quick Phrases | ຄຳສັບດ່ວນ | Yes, No, Maybe, Please, Thank You, Help, Stop, Go |
| Needs | ຄວາມຕ້ອງການ | Water, Food, Bathroom, Sleepy, Pain, Cold, Hot, Tired |
| Food & Drink | ອາຫານ ແລະ ເຄື່ອງດື່ມ | Apple, Banana, Milk, Juice, Pizza, Sandwich, Cookie, Ice Cream |
| Feelings | ຄວາມຮູ້ສຶກ | Happy, Sad, Angry, Scared, Excited, Sick, Love, Confused |
| Activities | ກິດຈະກຳ | Play, Read, TV, Walk, Music, Draw, Swim, Park |
| People | ບຸກຄົນ | Mom, Dad, Doctor, Teacher, Friend, Baby, Family, Police |

## Audio Generation

The app uses a shared data source (`src/data/symbols.json`) to ensure synchronization between the UI symbols and audio generation.

### Generate Audio Files

1. Activate the Python virtual environment:
```bash
source .venv/bin/activate
```

2. Run the audio generation script:
```bash
python scripts/generate_voices.py
```

This will:
- Load all symbols from `src/data/symbols.json`
- Generate Lao TTS audio using [Edge TTS](https://github.com/rany2/edge-tts)
- Save MP3 files to `public/audio/`

### Voice Options

The script uses the female Lao voice by default:
- `lo-LA-KeomanyNeural` (Female)
- `lo-LA-ChanthavongNeural` (Male) - Alternative

To change the voice, edit the `VOICE` variable in `generate_voices.py`.

## Adding New Symbols

The project uses a **single source of truth** approach for symbols:

1. Add the symbol to `src/data/symbols.json`:
```json
{
  "id": "q9",
  "text": "ລາ",
  "img": "👋",
  "color": "bg-purple-100"
}
```

2. The symbol automatically appears in:
   - ✅ The AAC app UI
   - ✅ The audio generation script

3. Generate the audio:
```bash
python scripts/generate_voices.py
```

No need to update multiple files!

## Usage Tips

### Building Sentences
1. Tap symbols to add them to the sentence bar
2. Tap the ▶️ button to speak the sentence
3. Tap individual symbols in the sentence to remove them
4. Use the 🗑️ button to clear the entire sentence

### Customization
- **Grid Size**: Adjust symbol grid density (2×2, 3×3, 4×4) in Settings
- **Dark Mode**: Toggle for low-light environments
- **High Contrast**: Enable for better visibility
- **Custom Text**: Type words not available in the symbol set

### Search
Use the search bar to quickly find symbols across all categories.

## Technology Stack

- **Frontend**: Next.js 16, React, TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Audio**: Edge TTS (Microsoft Azure TTS via edge-tts)
- **Language**: Lao (ລາວ)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built for the Lao AAC community
- Powered by [Edge TTS](https://github.com/rany2/edge-tts) for Lao language support
- Created with [Next.js](https://nextjs.org)
