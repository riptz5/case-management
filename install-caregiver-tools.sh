#!/bin/bash

echo "🏠 Installing Top 15 Free Tools for Sole Caregiver Case..."

# 1. Document Scanner & OCR
echo "📱 1. Installing Document Scanner (ImageMagick + Tesseract OCR)..."
brew install imagemagick tesseract

# 2. PDF Tools
echo "📄 2. Installing PDF Tools (PDFtk, Poppler)..."
brew install pdftk-java poppler

# 3. Audio/Video Recording
echo "🎤 3. Installing Audio/Video Tools (FFmpeg, SoX)..."
brew install ffmpeg sox

# 4. Secure Communication
echo "🔐 4. Installing Signal Desktop..."
brew install --cask signal

# 5. Time Tracking
echo "⏰ 5. Installing Time Tracking (Toggl Track)..."
brew install --cask toggl-track

# 6. Calendar Management
echo "📅 6. Installing Calendar Tools (CalDAV Sync)..."
brew install vdirsyncer

# 7. Note Taking & Documentation
echo "📝 7. Installing Obsidian (Knowledge Management)..."
brew install --cask obsidian

# 8. File Encryption
echo "🔒 8. Installing VeraCrypt (File Encryption)..."
brew install --cask veracrypt

# 9. Backup Solution
echo "💾 9. Installing Duplicati (Backup)..."
brew install --cask duplicati

# 10. Email Management
echo "📧 10. Installing Thunderbird (Email Client)..."
brew install --cask thunderbird

# 11. Video Conferencing
echo "📹 11. Installing Jitsi Meet (Video Calls)..."
brew install --cask jitsi-meet

# 12. Password Manager
echo "🔑 12. Installing Bitwarden (Password Manager)..."
brew install --cask bitwarden

# 13. Mind Mapping
echo "🧠 13. Installing FreeMind (Mind Mapping)..."
brew install --cask freemind

# 14. Legal Research
echo "⚖️ 14. Installing Zotero (Research Management)..."
brew install --cask zotero

# 15. Voice Recording & Transcription
echo "🗣️ 15. Installing Whisper (AI Transcription)..."
pip3 install openai-whisper

echo "✅ All tools installed! Setting up integrations..."

# Create integration scripts
mkdir -p ~/caregiver-tools

# Document processing script
cat > ~/caregiver-tools/process-document.sh << 'EOF'
#!/bin/bash
# Process scanned documents
FILE="$1"
OUTPUT="${FILE%.*}_processed"

# Convert to PDF if needed
if [[ "$FILE" != *.pdf ]]; then
    convert "$FILE" "$OUTPUT.pdf"
    FILE="$OUTPUT.pdf"
fi

# OCR the document
tesseract "$FILE" "$OUTPUT" pdf
echo "✅ Document processed: $OUTPUT.pdf"
EOF

# Audio transcription script
cat > ~/caregiver-tools/transcribe-audio.sh << 'EOF'
#!/bin/bash
# Transcribe audio files
AUDIO="$1"
OUTPUT="${AUDIO%.*}_transcript.txt"

whisper "$AUDIO" --output_format txt --output_dir "$(dirname "$AUDIO")"
echo "✅ Audio transcribed: $OUTPUT"
EOF

# Evidence organizer script
cat > ~/caregiver-tools/organize-evidence.py << 'EOF'
#!/usr/bin/env python3
import os, shutil, datetime
from pathlib import Path

def organize_evidence(source_dir):
    base_dir = Path.home() / "caregiver-evidence"
    categories = {
        'medical': ['medical', 'doctor', 'therapy', 'prescription'],
        'legal': ['court', 'legal', 'lawyer', 'motion'],
        'correspondence': ['email', 'letter', 'communication'],
        'childcare': ['school', 'daycare', 'child', 'kid'],
        'financial': ['bill', 'receipt', 'expense', 'cost']
    }
    
    for category in categories:
        (base_dir / category).mkdir(parents=True, exist_ok=True)
    
    for file in Path(source_dir).glob('*'):
        if file.is_file():
            filename_lower = file.name.lower()
            moved = False
            
            for category, keywords in categories.items():
                if any(keyword in filename_lower for keyword in keywords):
                    dest = base_dir / category / file.name
                    shutil.copy2(file, dest)
                    print(f"📁 Moved {file.name} to {category}/")
                    moved = True
                    break
            
            if not moved:
                dest = base_dir / 'other' / file.name
                (base_dir / 'other').mkdir(exist_ok=True)
                shutil.copy2(file, dest)
                print(f"📁 Moved {file.name} to other/")

if __name__ == "__main__":
    import sys
    organize_evidence(sys.argv[1] if len(sys.argv) > 1 else ".")
EOF

# Make scripts executable
chmod +x ~/caregiver-tools/*.sh
chmod +x ~/caregiver-tools/*.py

echo "🎉 INSTALLATION COMPLETE!"
echo ""
echo "📋 INSTALLED TOOLS:"
echo "1. 📱 Document Scanner (ImageMagick + Tesseract)"
echo "2. 📄 PDF Tools (PDFtk + Poppler)"
echo "3. 🎤 Audio/Video (FFmpeg + SoX)"
echo "4. 🔐 Signal (Secure messaging)"
echo "5. ⏰ Toggl Track (Time tracking)"
echo "6. 📅 CalDAV Sync (Calendar)"
echo "7. 📝 Obsidian (Notes)"
echo "8. 🔒 VeraCrypt (Encryption)"
echo "9. 💾 Duplicati (Backup)"
echo "10. 📧 Thunderbird (Email)"
echo "11. 📹 Jitsi Meet (Video calls)"
echo "12. 🔑 Bitwarden (Passwords)"
echo "13. 🧠 FreeMind (Mind maps)"
echo "14. ⚖️ Zotero (Research)"
echo "15. 🗣️ Whisper (Transcription)"
echo ""
echo "🛠️ HELPER SCRIPTS:"
echo "• ~/caregiver-tools/process-document.sh [file]"
echo "• ~/caregiver-tools/transcribe-audio.sh [audio]"
echo "• ~/caregiver-tools/organize-evidence.py [folder]"
echo ""
echo "🚀 Ready to use!"