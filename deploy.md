# GitHub Deployment Instructions

## Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click "New repository"
3. Name it: `case-management`
4. Make it **Public** (required for free GitHub Pages)
5. Don't initialize with README (we already have one)
6. Click "Create repository"

## Step 2: Push Your Code

Copy the commands GitHub shows you, or run these:

```bash
git remote add origin https://github.com/YOURUSERNAME/case-management.git
git branch -M main
git push -u origin main
```

Replace `YOURUSERNAME` with your actual GitHub username.

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll to "Pages" section
4. Under "Source", select "Deploy from a branch"
5. Choose "main" branch
6. Choose "/ (root)" folder
7. Click "Save"

## Step 4: Access Your Site

Your site will be available at:
`https://YOURUSERNAME.github.io/case-management`

It may take a few minutes to deploy.

## Step 5: Update README

Edit the README.md file and replace the demo link with your actual GitHub Pages URL.

## ✅ You're Done!

Your case management system is now:
- ✅ Hosted on GitHub (free)
- ✅ Accessible from any device
- ✅ Automatically backed up
- ✅ Version controlled
- ✅ Shareable with others

## Future Updates

To update your site:
1. Make changes locally
2. `git add .`
3. `git commit -m "Update description"`
4. `git push`

Changes will automatically deploy to your live site.