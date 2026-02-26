# Shared Symbols Data

This directory contains the shared symbols data used by both the NextJS AAC app and the Python audio generation script.

## Files

- **symbols.json**: The single source of truth for all AAC symbols, containing:
  - Symbol IDs
  - Lao text
  - Emoji icons
  - Color classes
  - Category information

- **symbols.ts**: TypeScript wrapper that:
  - Exports typed `symbolCategories` for use in React components
  - Maps icon names to Lucide React components
  - Exports a `words` dictionary for sync verification

## Usage

### In NextJS (ACCApp.tsx)
```typescript
import { symbolCategories } from "../data/symbols";

// Use symbolCategories directly in your components
```

### In Python (generate_voices.py)
```python
import json

with open("src/data/symbols.json", "r", encoding="utf-8") as f:
    symbols_data = json.load(f)

# Extract words for audio generation
words = {}
for category in symbols_data["categories"]:
    for symbol in category["symbols"]:
        words[symbol["id"]] = symbol["text"]
```

## Benefits

1. **Single Source of Truth**: All symbols and words are defined in one place
2. **Automatic Sync**: Changes to symbols automatically propagate to both the app and audio generation
3. **Type Safety**: TypeScript definitions ensure correct usage in the frontend
4. **Easy Maintenance**: No need to update multiple files when adding/modifying symbols

## Adding New Symbols

To add a new symbol:

1. Add it to `symbols.json` in the appropriate category:
   ```json
   { "id": "q9", "text": "ລາ", "img": "👋", "color": "bg-purple-100" }
   ```

2. The symbol will automatically be available in:
   - The AAC app UI
   - The audio generation script

3. Run `python generate_voices.py` to generate the audio file
