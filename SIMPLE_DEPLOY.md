# 🚀 One-Click Deployment

## Option 1: Automated Script (Recommended)

Just run this command in Terminal:

```bash
cd /Users/owner/GitHub/SYNC/case-management
./DEPLOY_NOW.sh
```

This will:
- Install GitHub CLI if needed
- Create the repository
- Push your code
- Enable GitHub Pages
- Give you the live URL

## Option 2: Manual Steps

If the script doesn't work, follow these steps:

### 1. Install GitHub CLI
```bash
brew install gh
```

### 2. Login to GitHub
```bash
gh auth login
```

### 3. Create Repository
```bash
gh repo create case-management --public
```

### 4. Push Code
```bash
git remote add origin https://github.com/YOURUSERNAME/case-management.git
git push -u origin main
```

### 5. Enable Pages
Go to: https://github.com/YOURUSERNAME/case-management/settings/pages
- Source: Deploy from a branch
- Branch: main
- Folder: / (root)

## ✅ Result

Your site will be live at:
`https://YOURUSERNAME.github.io/case-management`

Takes 2-3 minutes to go live after setup.