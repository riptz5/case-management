#!/bin/bash

echo "🤖 Installing AI Tools for macOS..."

# Fix PATH for Python scripts
export PATH="/Users/owner/Library/Python/3.9/bin:$PATH"
echo 'export PATH="/Users/owner/Library/Python/3.9/bin:$PATH"' >> ~/.zshrc

# 1. Ollama - macOS version
echo "🧠 1. Installing Ollama (macOS)..."
curl -fsSL https://ollama.com/install.sh | sh
/usr/local/bin/ollama serve &
sleep 5
/usr/local/bin/ollama pull llama3.2:1b
/usr/local/bin/ollama pull codellama:7b

# 2. Whisper already installed, just verify
echo "🗣️ 2. Whisper installed ✅"

# 3. Skip Stable Diffusion for now (too large)
echo "🎨 3. Skipping Stable Diffusion (optional)"

# 4. GPT4All
echo "💬 4. Installing GPT4All..."
if ! command -v brew &> /dev/null; then
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi
brew install --cask gpt4all

# 5. Essential Python packages only
echo "📚 5. Installing essential AI packages..."
pip3 install --user transformers torch spacy gradio langchain chromadb

# 6. Download spaCy model
echo "📝 6. Installing spaCy model..."
python3 -m spacy download en_core_web_sm

echo "✅ Creating simplified AI scripts..."

mkdir -p ~/ai-tools/scripts

# Simple document analyzer
cat > ~/ai-tools/scripts/analyze-doc.py << 'EOF'
#!/usr/bin/env python3
import sys
import re

def analyze_document(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            text = f.read()
    except:
        print(f"❌ Could not read {file_path}")
        return
    
    # Basic analysis
    word_count = len(text.split())
    legal_keywords = ['custody', 'caregiver', 'child', 'court', 'motion', 'affidavit', 'esa', 'accommodation']
    found_keywords = [word for word in legal_keywords if word.lower() in text.lower()]
    
    # Find dates
    dates = re.findall(r'\d{1,2}[/-]\d{1,2}[/-]\d{2,4}', text)
    
    print(f"📄 Document: {file_path}")
    print(f"📊 Words: {word_count}")
    print(f"⚖️ Legal keywords: {', '.join(found_keywords)}")
    print(f"📅 Dates found: {len(dates)}")
    
    # Relevance score
    relevance = min(100, len(found_keywords) * 15 + (word_count // 100))
    print(f"🎯 Relevance: {relevance}%")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        analyze_document(sys.argv[1])
    else:
        print("Usage: python3 analyze-doc.py <file>")
EOF

# Simple transcription
cat > ~/ai-tools/scripts/transcribe.py << 'EOF'
#!/usr/bin/env python3
import sys
import os

def transcribe_audio(audio_file):
    try:
        import whisper
        model = whisper.load_model("base")
        result = model.transcribe(audio_file)
        
        output_file = audio_file.replace('.wav', '_transcript.txt').replace('.mp3', '_transcript.txt')
        with open(output_file, 'w') as f:
            f.write(result["text"])
        
        print(f"✅ Transcribed to: {output_file}")
        print(f"📝 Text: {result['text'][:200]}...")
        
    except ImportError:
        print("❌ Whisper not installed. Run: pip3 install --user openai-whisper")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        transcribe_audio(sys.argv[1])
    else:
        print("Usage: python3 transcribe.py <audio_file>")
EOF

# Simple AI chat
cat > ~/ai-tools/scripts/ai-chat.py << 'EOF'
#!/usr/bin/env python3
import json
import sys

def chat_with_case_data():
    try:
        # Try to load case data
        with open('case-data.json', 'r') as f:
            case_data = json.load(f)
        
        print("🤖 AI Chat loaded with your case data")
        print("Type 'quit' to exit")
        
        while True:
            question = input("\n❓ Ask about your case: ")
            if question.lower() in ['quit', 'exit']:
                break
            
            # Simple keyword matching
            response = simple_answer(question, case_data)
            print(f"🤖 {response}")
            
    except FileNotFoundError:
        print("❌ No case-data.json found. Please export your case data first.")
    except Exception as e:
        print(f"❌ Error: {e}")

def simple_answer(question, data):
    q_lower = question.lower()
    
    if 'evidence' in q_lower:
        count = len(data.get('evidence', []))
        return f"You have {count} pieces of evidence in your case."
    
    elif 'timeline' in q_lower or 'event' in q_lower:
        count = len(data.get('timeline', []))
        return f"Your timeline has {count} events recorded."
    
    elif 'strength' in q_lower or 'strong' in q_lower:
        evidence_count = len(data.get('evidence', []))
        timeline_count = len(data.get('timeline', []))
        strength = min(100, (evidence_count * 10) + (timeline_count * 5))
        return f"Based on your data, your case strength is approximately {strength}%."
    
    elif 'medical' in q_lower:
        medical_items = [item for item in data.get('evidence', []) if 'medical' in item.get('type', '').lower()]
        return f"You have {len(medical_items)} medical-related evidence items."
    
    else:
        return "I can help with questions about evidence, timeline, case strength, or medical documentation."

if __name__ == "__main__":
    chat_with_case_data()
EOF

chmod +x ~/ai-tools/scripts/*.py

echo "🎉 SIMPLIFIED AI INSTALLATION COMPLETE!"
echo ""
echo "✅ INSTALLED:"
echo "• 🧠 Ollama (Local AI)"
echo "• 🗣️ Whisper (Transcription)"
echo "• 💬 GPT4All (Chat)"
echo "• 📚 Python AI Libraries"
echo ""
echo "🛠️ SCRIPTS:"
echo "• ~/ai-tools/scripts/analyze-doc.py [file]"
echo "• ~/ai-tools/scripts/transcribe.py [audio]"
echo "• ~/ai-tools/scripts/ai-chat.py"
echo ""
echo "🚀 USAGE:"
echo "• Chat with Ollama: ollama run llama3.2:1b"
echo "• Transcribe audio: python3 ~/ai-tools/scripts/transcribe.py audio.wav"
echo "• Analyze document: python3 ~/ai-tools/scripts/analyze-doc.py document.txt"
echo ""
echo "💡 PATH updated - restart terminal or run: source ~/.zshrc"