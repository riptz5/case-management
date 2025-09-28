#!/bin/bash

echo "🤖 Installing Top 15 Free AI Tools for Sole Caregiver Case..."

# 1. Ollama - Local LLM
echo "🧠 1. Installing Ollama (Local AI)..."
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull llama2
ollama pull codellama

# 2. Whisper - Speech to Text
echo "🗣️ 2. Installing OpenAI Whisper..."
pip3 install openai-whisper

# 3. Stable Diffusion - Image Generation
echo "🎨 3. Installing Stable Diffusion WebUI..."
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git ~/ai-tools/stable-diffusion
cd ~/ai-tools/stable-diffusion && ./webui.sh --skip-torch-cuda-test

# 4. GPT4All - Local ChatGPT
echo "💬 4. Installing GPT4All..."
brew install --cask gpt4all

# 5. LM Studio - Model Manager
echo "📚 5. Installing LM Studio..."
brew install --cask lm-studio

# 6. Hugging Face Transformers
echo "🤗 6. Installing Hugging Face Tools..."
pip3 install transformers torch torchvision torchaudio

# 7. Tesseract OCR - Text Recognition
echo "👁️ 7. Installing Tesseract OCR..."
brew install tesseract tesseract-lang

# 8. spaCy - Natural Language Processing
echo "📝 8. Installing spaCy NLP..."
pip3 install spacy
python3 -m spacy download en_core_web_sm

# 9. YOLO - Object Detection
echo "🔍 9. Installing YOLO..."
pip3 install ultralytics

# 10. Rembg - Background Removal
echo "🖼️ 10. Installing Background Removal..."
pip3 install rembg

# 11. Real-ESRGAN - Image Upscaling
echo "📈 11. Installing Image Upscaler..."
pip3 install realesrgan

# 12. Bark - Text to Speech
echo "🔊 12. Installing Bark TTS..."
pip3 install bark

# 13. LangChain - AI Workflows
echo "⛓️ 13. Installing LangChain..."
pip3 install langchain langchain-community

# 14. Chroma - Vector Database
echo "🗄️ 14. Installing Chroma Vector DB..."
pip3 install chromadb

# 15. Gradio - AI Web Interface
echo "🌐 15. Installing Gradio..."
pip3 install gradio

echo "✅ Creating AI integration scripts..."

# Create AI tools directory
mkdir -p ~/ai-tools/scripts

# Legal document analyzer
cat > ~/ai-tools/scripts/analyze-legal-doc.py << 'EOF'
#!/usr/bin/env python3
import sys
import spacy
from transformers import pipeline

nlp = spacy.load("en_core_web_sm")
classifier = pipeline("text-classification", model="nlptown/bert-base-multilingual-uncased-sentiment")

def analyze_document(file_path):
    with open(file_path, 'r') as f:
        text = f.read()
    
    doc = nlp(text)
    
    # Extract key entities
    entities = [(ent.text, ent.label_) for ent in doc.ents]
    
    # Analyze sentiment
    sentiment = classifier(text[:512])
    
    # Find legal keywords
    legal_keywords = ['custody', 'caregiver', 'child', 'court', 'motion', 'affidavit']
    found_keywords = [word for word in legal_keywords if word.lower() in text.lower()]
    
    print(f"📄 Document Analysis: {file_path}")
    print(f"🏷️ Entities: {entities[:10]}")
    print(f"😊 Sentiment: {sentiment[0]['label']} ({sentiment[0]['score']:.2f})")
    print(f"⚖️ Legal Keywords: {found_keywords}")

if __name__ == "__main__":
    analyze_document(sys.argv[1])
EOF

# Voice note transcriber with AI analysis
cat > ~/ai-tools/scripts/smart-transcribe.py << 'EOF'
#!/usr/bin/env python3
import whisper
import sys
from transformers import pipeline

model = whisper.load_model("base")
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def transcribe_and_analyze(audio_file):
    # Transcribe
    result = model.transcribe(audio_file)
    transcript = result["text"]
    
    # Summarize if long
    if len(transcript) > 200:
        summary = summarizer(transcript, max_length=100, min_length=30)[0]['summary_text']
    else:
        summary = transcript
    
    # Save results
    output_file = audio_file.replace('.wav', '_transcript.txt')
    with open(output_file, 'w') as f:
        f.write(f"TRANSCRIPT:\n{transcript}\n\nSUMMARY:\n{summary}")
    
    print(f"✅ Transcribed: {output_file}")
    print(f"📝 Summary: {summary}")

if __name__ == "__main__":
    transcribe_and_analyze(sys.argv[1])
EOF

# Evidence categorizer
cat > ~/ai-tools/scripts/categorize-evidence.py << 'EOF'
#!/usr/bin/env python3
import os
import sys
from transformers import pipeline

classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

def categorize_files(directory):
    categories = [
        "medical documentation",
        "legal correspondence", 
        "childcare evidence",
        "financial records",
        "communication logs",
        "court documents"
    ]
    
    for filename in os.listdir(directory):
        if filename.endswith(('.txt', '.pdf', '.doc', '.docx')):
            try:
                with open(os.path.join(directory, filename), 'r') as f:
                    content = f.read()[:1000]  # First 1000 chars
                
                result = classifier(content, categories)
                category = result['labels'][0]
                confidence = result['scores'][0]
                
                print(f"📁 {filename}: {category} ({confidence:.2f})")
                
            except Exception as e:
                print(f"❌ Error processing {filename}: {e}")

if __name__ == "__main__":
    categorize_files(sys.argv[1] if len(sys.argv) > 1 else ".")
EOF

# AI case strength analyzer
cat > ~/ai-tools/scripts/analyze-case-strength.py << 'EOF'
#!/usr/bin/env python3
import json
import sys
from transformers import pipeline

sentiment_analyzer = pipeline("sentiment-analysis")
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

def analyze_case_strength(case_data_file):
    with open(case_data_file, 'r') as f:
        data = json.load(f)
    
    strengths = []
    weaknesses = []
    
    # Analyze evidence
    evidence_types = ["medical", "legal", "financial", "communication"]
    for evidence in data.get('evidence', []):
        text = f"{evidence.get('title', '')} {evidence.get('description', '')}"
        
        # Categorize
        category_result = classifier(text, evidence_types)
        category = category_result['labels'][0]
        
        # Sentiment
        sentiment = sentiment_analyzer(text)[0]
        
        if sentiment['label'] == 'POSITIVE' and sentiment['score'] > 0.7:
            strengths.append(f"{category}: {evidence.get('title', 'Unknown')}")
        elif sentiment['label'] == 'NEGATIVE' and sentiment['score'] > 0.7:
            weaknesses.append(f"{category}: {evidence.get('title', 'Unknown')}")
    
    # Calculate strength score
    total_evidence = len(data.get('evidence', []))
    strong_evidence = len(strengths)
    strength_score = (strong_evidence / max(total_evidence, 1)) * 100
    
    print(f"📊 CASE STRENGTH ANALYSIS")
    print(f"💪 Overall Strength: {strength_score:.1f}%")
    print(f"✅ Strengths ({len(strengths)}):")
    for strength in strengths[:5]:
        print(f"  • {strength}")
    print(f"⚠️ Areas to Improve ({len(weaknesses)}):")
    for weakness in weaknesses[:5]:
        print(f"  • {weakness}")

if __name__ == "__main__":
    analyze_case_strength(sys.argv[1])
EOF

# AI chat interface for case questions
cat > ~/ai-tools/scripts/case-ai-chat.py << 'EOF'
#!/usr/bin/env python3
import gradio as gr
import json
from transformers import pipeline

qa_pipeline = pipeline("question-answering", model="distilbert-base-cased-distilled-squad")

def load_case_data():
    try:
        with open('case-data.json', 'r') as f:
            return json.load(f)
    except:
        return {"timeline": [], "evidence": [], "correspondence": []}

def answer_question(question):
    case_data = load_case_data()
    
    # Create context from case data
    context = ""
    for item in case_data.get('timeline', []):
        context += f"{item.get('title', '')}: {item.get('description', '')} "
    for item in case_data.get('evidence', []):
        context += f"{item.get('title', '')}: {item.get('description', '')} "
    
    if not context.strip():
        return "No case data available. Please load your case data first."
    
    try:
        result = qa_pipeline(question=question, context=context[:2000])
        return f"Answer: {result['answer']}\nConfidence: {result['score']:.2f}"
    except:
        return "I couldn't find a specific answer in your case data."

# Create Gradio interface
iface = gr.Interface(
    fn=answer_question,
    inputs=gr.Textbox(label="Ask about your case", placeholder="What evidence do I have for...?"),
    outputs=gr.Textbox(label="AI Answer"),
    title="🤖 Caregiver Case AI Assistant",
    description="Ask questions about your sole caregiver case data"
)

if __name__ == "__main__":
    iface.launch(server_name="0.0.0.0", server_port=7860)
EOF

# Make all scripts executable
chmod +x ~/ai-tools/scripts/*.py

echo "🎉 AI TOOLS INSTALLATION COMPLETE!"
echo ""
echo "🤖 INSTALLED AI TOOLS:"
echo "1. 🧠 Ollama (Local LLM)"
echo "2. 🗣️ Whisper (Speech-to-Text)"
echo "3. 🎨 Stable Diffusion (Image Generation)"
echo "4. 💬 GPT4All (Local ChatGPT)"
echo "5. 📚 LM Studio (Model Manager)"
echo "6. 🤗 Hugging Face Transformers"
echo "7. 👁️ Tesseract OCR"
echo "8. 📝 spaCy NLP"
echo "9. 🔍 YOLO Object Detection"
echo "10. 🖼️ Rembg Background Removal"
echo "11. 📈 Real-ESRGAN Upscaler"
echo "12. 🔊 Bark Text-to-Speech"
echo "13. ⛓️ LangChain Workflows"
echo "14. 🗄️ Chroma Vector Database"
echo "15. 🌐 Gradio Web Interface"
echo ""
echo "🛠️ AI SCRIPTS CREATED:"
echo "• ~/ai-tools/scripts/analyze-legal-doc.py [file]"
echo "• ~/ai-tools/scripts/smart-transcribe.py [audio]"
echo "• ~/ai-tools/scripts/categorize-evidence.py [folder]"
echo "• ~/ai-tools/scripts/analyze-case-strength.py [case-data.json]"
echo "• ~/ai-tools/scripts/case-ai-chat.py (Web interface)"
echo ""
echo "🚀 To start AI chat: python3 ~/ai-tools/scripts/case-ai-chat.py"
echo "🌐 Then visit: http://localhost:7860"