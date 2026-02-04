# Deploying Meatspace to cPanel

## Prerequisites
- cPanel with Node.js selector
- SSH or Terminal access
- Domain pointed to server (meatspace.so)

## Quick Deploy

### 1. Create Node.js Application in cPanel

1. Go to **Software → Setup Node.js App**
2. Click **Create Application**
3. Settings:
   - **Node.js version:** 18.x or 20.x
   - **Application mode:** Production  
   - **Application root:** `meatspace`
   - **Application URL:** (leave blank for root domain)
   - **Application startup file:** `server.js`
4. Click **Create**
5. **Copy the virtual environment path** shown (e.g., `/home/username/nodevenv/meatspace/18/bin/activate`)

### 2. Upload Files

**Option A: Via Git (recommended)**
```bash
# SSH into server
ssh user@server

# Enter virtual environment
source /home/username/nodevenv/meatspace/18/bin/activate

# Clone repo
cd ~
git clone https://github.com/perrykleese/meatspace.git meatspace-repo

# Copy blinks-api contents to app directory
cp -r meatspace-repo/blinks-api/* ~/meatspace/
```

**Option B: Via File Manager**
- Upload all files from this folder (`blinks-api/`) to your app directory

### 3. Install & Build

```bash
# Make sure you're in the virtual environment
source /home/username/nodevenv/meatspace/18/bin/activate

# Go to app directory
cd ~/meatspace

# Install dependencies (this also runs build via postinstall)
npm install

# Or manually:
npm install
npm run build
```

### 4. Configure Environment

Copy `.env.production` to `.env`:
```bash
cp .env.production .env
```

Edit if needed:
```bash
nano .env
```

### 5. Start Application

In cPanel Node.js App panel:
1. Find your application
2. Click **Restart**

Or via command line:
```bash
npm start
```

### 6. Verify

Visit https://meatspace.so — should show the landing page!

## Troubleshooting

### Check Logs
In cPanel Node.js panel, click **Logs** for your app.

### Common Issues

**"Cannot find module 'next'"**
→ Run `npm install` in the virtual environment

**Build fails**
→ Make sure Node.js 18+ is selected

**502 Bad Gateway**
→ Check if app is running, restart it

**Blank page**
→ Check browser console, ensure `.next/` folder exists

### Manual Start (for testing)
```bash
source /home/username/nodevenv/meatspace/18/bin/activate
cd ~/meatspace
PORT=3000 npm start
```

## Files Structure

```
meatspace/
├── server.js          # Node.js entry point
├── package.json       # Dependencies & scripts
├── next.config.js     # Next.js config
├── .env               # Environment variables
├── .next/             # Built files (after npm run build)
└── src/
    └── app/
        ├── page.tsx   # Landing page
        ├── layout.tsx # Root layout
        └── api/       # API routes
```

## API Endpoints

- `GET /actions.json` — Blinks manifest
- `GET /api/actions/feed` — Task feed
- `GET /api/actions/task/[id]` — Task details
- `POST /api/actions/task/[id]/claim` — Claim task
