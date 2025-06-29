# Git Configuration Guide for NeroFit

This guide covers Git configuration, best practices, and workflow for the NeroFit project.

## Initial Git Setup

### 1. Global Git Configuration

```bash
# Set your name and email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set default branch name
git config --global init.defaultBranch main

# Set default editor (optional)
git config --global core.editor "code --wait"  # VS Code
# or
git config --global core.editor "vim"          # Vim
# or
git config --global core.editor "nano"         # Nano

# Enable automatic line ending conversion
git config --global core.autocrlf input        # For macOS/Linux
# or
git config --global core.autocrlf true         # For Windows

# Set up credential helper
git config --global credential.helper store    # Store credentials permanently
# or
git config --global credential.helper cache    # Cache credentials temporarily
```

### 2. Project-Specific Configuration

```bash
# Navigate to project directory
cd /path/to/NeroFit

# Initialize Git repository (if not already done)
git init

# Set up remote repository
git remote add origin https://github.com/yourusername/NeroFit.git
# or for SSH
git remote add origin git@github.com:yourusername/NeroFit.git

# Verify remote
git remote -v
```

## Git Workflow

### 1. Branch Strategy

```bash
# Main branches
main          # Production-ready code
develop       # Integration branch for features
staging       # Pre-production testing

# Feature branches
feature/user-authentication
feature/challenge-system
feature/blockchain-integration
feature/ui-improvements

# Hotfix branches
hotfix/critical-bug-fix
hotfix/security-patch
```

### 2. Daily Workflow

```bash
# Start of day - update your local repository
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add user authentication system

- Implement JWT token authentication
- Add user registration and login endpoints
- Include password hashing with bcrypt
- Add input validation middleware"

# Push feature branch
git push origin feature/your-feature-name

# Create pull request on GitHub/GitLab
# After review and approval, merge to develop
```

### 3. Commit Message Convention

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```bash
# Format: <type>[optional scope]: <description>

# Types:
feat:     # New feature
fix:      # Bug fix
docs:     # Documentation changes
style:    # Code style changes (formatting, etc.)
refactor: # Code refactoring
test:     # Adding or updating tests
chore:    # Maintenance tasks

# Examples:
git commit -m "feat(auth): implement JWT authentication"
git commit -m "fix(api): resolve user stats calculation bug"
git commit -m "docs(readme): update installation instructions"
git commit -m "style(frontend): format components with prettier"
git commit -m "refactor(backend): extract database connection logic"
git commit -m "test(challenges): add unit tests for challenge completion"
git commit -m "chore(deps): update dependencies to latest versions"
```

## Git Hooks

### 1. Pre-commit Hook

Create `.git/hooks/pre-commit` (or use Husky):

```bash
#!/bin/sh

# Run linting
echo "Running ESLint..."
npm run lint

# Run tests
echo "Running tests..."
npm test

# Check for sensitive data
echo "Checking for sensitive data..."
if git diff --cached | grep -i "password\|secret\|key\|token"; then
    echo "Warning: Potential sensitive data detected!"
    exit 1
fi

echo "Pre-commit checks passed!"
```

### 2. Commit Message Hook

Create `.git/hooks/commit-msg`:

```bash
#!/bin/sh

# Check commit message format
commit_regex='^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .{1,50}'

if ! grep -qE "$commit_regex" "$1"; then
    echo "Invalid commit message format!"
    echo "Use: <type>[optional scope]: <description>"
    echo "Types: feat, fix, docs, style, refactor, test, chore"
    exit 1
fi
```

## Git Aliases

Add these to your global Git config for productivity:

```bash
# Status shortcuts
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit

# Log shortcuts
git config --global alias.lg "log --oneline --graph --decorate"
git config --global alias.lga "log --oneline --graph --decorate --all"

# Branch management
git config --global alias.new "checkout -b"
git config --global alias.delete "branch -d"

# Stash shortcuts
git config --global alias.stash-all "stash push -u -m"
git config --global alias.stash-list "stash list"

# Reset shortcuts
git config --global alias.unstage "reset HEAD --"
git config --global alias.last "log -1 HEAD"

# Diff shortcuts
git config --global alias.diff-staged "diff --cached"
git config --global alias.diff-unstaged "diff"
```

## Useful Git Commands

### 1. Repository Management

```bash
# View repository status
git status

# View commit history
git log --oneline --graph --decorate

# View file changes
git diff
git diff --staged

# View specific file history
git log --follow -- filename

# View who changed what
git blame filename
```

### 2. Branch Management

```bash
# List all branches
git branch -a

# Create and switch to new branch
git checkout -b feature/new-feature

# Switch between branches
git checkout main
git checkout develop

# Delete local branch
git branch -d feature/old-feature

# Delete remote branch
git push origin --delete feature/old-feature
```

### 3. Stashing

```bash
# Stash current changes
git stash

# Stash with message
git stash push -m "WIP: working on user auth"

# List stashes
git stash list

# Apply latest stash
git stash pop

# Apply specific stash
git stash apply stash@{1}

# Drop stash
git stash drop stash@{0}
```

### 4. Merging and Rebasing

```bash
# Merge feature branch into main
git checkout main
git merge feature/new-feature

# Rebase feature branch on main
git checkout feature/new-feature
git rebase main

# Interactive rebase (last 3 commits)
git rebase -i HEAD~3

# Abort rebase
git rebase --abort
```

### 5. Undoing Changes

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Undo staged changes
git reset HEAD filename

# Undo unstaged changes
git checkout -- filename

# Revert a commit
git revert commit-hash
```

## Security Best Practices

### 1. Environment Variables

```bash
# Never commit .env files
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore

# Use .env.example for templates
cp .env .env.example
# Remove sensitive values from .env.example
```

### 2. Sensitive Data

```bash
# Check for sensitive data before committing
git diff --cached | grep -i "password\|secret\|key\|token"

# If sensitive data was committed, remove it
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/file" \
  --prune-empty --tag-name-filter cat -- --all
```

### 3. SSH Keys

```bash
# Generate SSH key for GitHub
ssh-keygen -t ed25519 -C "your.email@example.com"

# Add to SSH agent
ssh-add ~/.ssh/id_ed25519

# Add public key to GitHub
cat ~/.ssh/id_ed25519.pub
```

## CI/CD Integration

### 1. GitHub Actions

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Run linting
        run: npm run lint
```

### 2. Pre-commit Hooks with Husky

```bash
# Install Husky
npm install --save-dev husky lint-staged

# Initialize Husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint-staged"
```

## Troubleshooting

### 1. Common Issues

```bash
# Fix line ending issues
git config core.autocrlf input
git add --renormalize .

# Fix merge conflicts
git status  # See conflicted files
# Edit conflicted files manually
git add resolved-file
git commit

# Recover deleted branch
git reflog
git checkout -b recovered-branch commit-hash

# Clean up repository
git gc
git prune
```

### 2. Performance

```bash
# Shallow clone for large repositories
git clone --depth 1 https://github.com/user/repo.git

# Fetch specific branch only
git fetch origin branch-name

# Clean up old branches
git remote prune origin
git branch --merged | grep -v "\*" | xargs -n 1 git branch -d
```

## Resources

- [Git Documentation](https://git-scm.com/doc)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
