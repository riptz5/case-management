#!/bin/bash

echo "🚀 Amazon Q Case Management - GitHub Deployment Script"
echo "=================================================="

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI not found. Installing..."
    brew install gh
fi

# Login to GitHub (if not already)
echo "🔐 Logging into GitHub..."
gh auth login

# Create repository
echo "📁 Creating GitHub repository..."
gh repo create case-management --public --description "Amazon Q Case Management System - AI-assisted legal case tracking"

# Add remote and push
echo "📤 Pushing code to GitHub..."
git remote add origin https://github.com/$(gh api user --jq .login)/case-management.git
git push -u origin main

# Enable GitHub Pages
echo "🌐 Enabling GitHub Pages..."
gh api repos/$(gh api user --jq .login)/case-management/pages \
  --method POST \
  --field source='{"branch":"main","path":"/"}'

# Get the URL
USERNAME=$(gh api user --jq .login)
echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo "🌐 Your site: https://$USERNAME.github.io/case-management"
echo "📁 Repository: https://github.com/$USERNAME/case-management"
echo ""
echo "⏰ Site will be live in 2-3 minutes"