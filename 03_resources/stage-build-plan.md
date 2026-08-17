---
project: main-stage-studio
status: live
next: "Act on the 16 Aug capability audit: two engines are conflated on one manifest schema"
blocked_on: ""
owner: osman
---

# Stage — Full Build Plan
*MSS Client Review Tool. First deployment: PureMed Aesthetics.*
*Date: 24 June 2026*

---

## What this document is

A complete, sequential build plan for Stage: the MSS client review and sign-off tool. It covers physical Pi setup, network configuration, and every Claude Code prompt needed to build and deploy the application.

Work through this in order. Do not skip steps. Each step has a confirmation check before the next one starts.

The session resume pattern is baked in from Step 1. If a Claude Code session ends mid-build, start a new session and say: "Continue the Stage build. Check build-state.json first." Claude Code will pick up from the right place.

---

## Architecture summary

- **Runtime:** Node.js 20 LTS with Express
- **Auth:** express-session with bcryptjs
- **Frontend:** Vanilla JS, no framework, no build step
- **Persistence:** JSON on disk for review state, Markdown for sign-off output
- **Reverse proxy:** Nginx with Let's Encrypt HTTPS via Certbot
- **Process management:** PM2
- **Network exposure:** Port forwarding on ASUS Merlin with Duck DNS DDNS

---

## Part 1 — Physical Pi Setup

*Done by you manually. Takes approximately 20 minutes. Cannot be automated.*

---

### 1.1 Flash the SD card

Download Raspberry Pi Imager from `raspberrypi.com/software` and install it on your laptop.

Open Imager. Select:

- Device: Raspberry Pi 3
- OS: Raspberry Pi OS Lite (64-bit). This is the version without a desktop environment. Lite uses significantly less RAM, which matters on a Pi 3 with 1GB.
- Storage: your SD card (16GB minimum, 32GB recommended)

Before writing, click the settings gear icon. Configure:

- Hostname: `stage`
- Enable SSH: yes, use password authentication
- Username: `pi`
- Password: set a strong one and note it down, you will use this to SSH in
- Locale settings: set your timezone and keyboard layout

Write to the SD card. This takes a few minutes.

**Confirmation:** SD card write completes without errors in Imager.

---

### 1.2 First boot

Insert the SD card into the Pi. Connect an ethernet cable from the Pi to your router. Connect power.

Wait 90 seconds for first boot to complete.

On your laptop, log into the ASUS Merlin router admin panel. This is typically at `192.168.50.1` or `192.168.1.1`. Go to the connected devices list or Network Map. Find a device named `stage`. Note its current IP address, something like `192.168.50.150`.

SSH into the Pi from your laptop terminal:

```bash
ssh pi@192.168.50.150
```

Accept the fingerprint prompt. Enter the password you set in Imager. You should see the Pi command prompt.

**Confirmation:** Pi command prompt is visible in your terminal.

---

### 1.3 Set a static local IP via DHCP reservation

Still in the router admin panel:

Go to LAN, then DHCP Server. Find the manually assigned IP address section. Add a reservation using the Pi's MAC address (visible in the connected devices list) and assign it a fixed local IP. Pick something outside the dynamic DHCP range, for example `192.168.50.200`.

Save the setting.

Back in your SSH session on the Pi, reboot:

```bash
sudo reboot
```

Wait 30 seconds, then SSH in again using the new static IP:

```bash
ssh pi@192.168.50.200
```

**Confirmation:** SSH connects successfully on the static IP. Note this IP down. You will need it in Part 2.

---

### 1.4 Configure DDNS on Duck DNS and Merlin

On your laptop, go to `duckdns.org`. Sign in with Google or GitHub. Create a subdomain, for example `mss-review.duckdns.org`. Copy your Duck DNS token from the top of the page.

In the Merlin router admin panel, go to WAN, then DDNS. Configure:

- If Duck DNS appears in the server dropdown: select it, enter your subdomain and token, save.
- If Duck DNS does not appear: select Custom. Enter the following update URL, replacing the placeholders with your actual values:

```
https://www.duckdns.org/update?domains=YOURSUBDOMAIN&token=YOURTOKEN&ip=
```

Save. Merlin will call this URL periodically to keep your DNS record pointed at your current public IP.

**Confirmation:** DDNS shows as active in Merlin. Note your full Duck DNS subdomain, for example `mss-review.duckdns.org`. You will need it in Part 2.

---

### 1.5 Configure port forwarding on Merlin

In the router admin panel, go to WAN, then Virtual Server / Port Forwarding.

Add two rules:

| Service name | Protocol | External port | Internal IP | Internal port |
|---|---|---|---|---|
| Stage HTTP | TCP | 80 | 192.168.50.200 | 80 |
| Stage HTTPS | TCP | 443 | 192.168.50.200 | 443 |

Replace `192.168.50.200` with your actual Pi static IP if different.

Save and apply.

**Confirmation:** Rules appear in the port forwarding list.

---

### 1.6 Test external access

Take your phone off WiFi and onto mobile data. Open a browser and go to:

```
http://mss-review.duckdns.org
```

You should get a "connection refused" or blank response, not a timeout. Connection refused means the request is reaching the Pi but nothing is listening yet. This is correct at this stage. A timeout means port forwarding is not working and needs to be checked before continuing.

**Confirmation:** External request gets connection refused or a browser error, not a timeout.

---

## Part 2 — Claude Code Setup

*Paste these prompts into Claude Code in order. Each prompt tells Claude Code exactly what to do. Wait for each step to complete and confirm before moving to the next.*

Before starting, have the following ready:

- Your Pi's static local IP (from step 1.3)
- Your Duck DNS subdomain (from step 1.4)
- An email address for the Let's Encrypt certificate

---

### 2.1 Initial Pi configuration and Node install

Open a Claude Code session. Paste this prompt, filling in your actual values:

```
I am setting up a Raspberry Pi 3 as a web server for a Node.js application.

Connection details:
- Pi local IP: [your Pi static IP, e.g. 192.168.50.200]
- Pi username: pi
- SSH key or password auth is already configured

Please do the following over SSH:

1. Update the OS: sudo apt update && sudo apt upgrade -y
2. Install Node.js 20 LTS using the NodeSource setup script
3. Install PM2 globally: npm install -g pm2
4. Install Nginx: sudo apt install nginx -y
5. Install Certbot and the Nginx plugin: sudo apt install certbot python3-certbot-nginx -y
6. Create the application directory: sudo mkdir -p /home/pi/stage && sudo chown pi:pi /home/pi/stage
7. Confirm Node, npm, PM2, Nginx, and Certbot are all installed by printing their versions

After completing each step, confirm what was done before moving to the next.
Write a brief summary at the end of what is installed and ready.
```

**Confirmation:** Claude Code confirms Node, PM2, Nginx, and Certbot versions are all printed without errors.

---

### 2.2 Project scaffold

Paste this prompt into Claude Code:

```
I am building a Node.js web application called Stage on my Raspberry Pi.
The Pi is at [your Pi static IP]. The application lives at /home/pi/stage/.

Please create the following file and folder structure on the Pi over SSH:

/home/pi/stage/
├── server.js
├── auth.js
├── manifest.js
├── signoff.js
├── package.json
├── config/
│   └── users.json
├── engagements/
│   └── puremed/
│       ├── manifest.json
│       ├── prototype/
│       ├── assets/
│       └── output/
├── public/
│   ├── style.css
│   └── app.js
└── views/
    ├── login.html
    ├── shell.html
    └── partials/
        ├── prototype.html
        ├── gallery.html
        ├── placements.html
        ├── copy.html
        └── signoff.html

Also create a build-state.json file at /home/pi/stage/build-state.json with this content:

{
  "project": "stage",
  "last_updated": "",
  "steps": {
    "1_pi_setup": "complete",
    "2_scaffold": "in_progress",
    "3_auth": "pending",
    "4_manifest": "pending",
    "5_prototype_mode": "pending",
    "6_asset_mode": "pending",
    "7_copy_mode": "pending",
    "8_signoff": "pending",
    "9_nginx_https": "pending",
    "10_pm2": "pending"
  },
  "notes": "Scaffold created. Moving to auth next."
}

Create all directories and empty placeholder files. Confirm the structure exists on the Pi.
Then update build-state.json: set step 2_scaffold to complete and update last_updated to today's date.
```

**Confirmation:** Claude Code confirms the directory structure exists on the Pi and build-state.json is updated.

---

### 2.3 Package.json and dependencies

Paste this prompt:

```
On my Raspberry Pi at [your Pi static IP], in the directory /home/pi/stage/:

1. Write the following package.json file:

{
  "name": "stage",
  "version": "1.0.0",
  "description": "MSS client review and sign-off tool",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "express": "^4.18.0",
    "express-session": "^1.17.3"
  }
}

2. Run npm install in /home/pi/stage/

3. Confirm all dependencies installed without errors.

Then update /home/pi/stage/build-state.json: add a note that dependencies are installed.
```

**Confirmation:** npm install completes without errors.

---

### 2.4 Auth module

Paste this prompt:

```
On my Raspberry Pi at [your Pi static IP], in /home/pi/stage/:

Write the following files. Write each file completely, do not truncate.

FILE 1: auth.js

This module handles session-based authentication with bcryptjs password hashing.
It should export:
- A middleware function requireAuth(req, res, next) that redirects to /login if no session exists
- A middleware function requireAdmin(req, res, next) that returns 403 if the user is not admin
- An async function validateCredentials(username, password) that reads config/users.json,
  finds the user, and compares the password against the bcrypt hash. Returns the user object
  if valid, null if not.
- A function hashPassword(plaintext) that returns a bcrypt hash with 10 salt rounds.
  This is used by the setup script, not at runtime.

FILE 2: config/users.json

Create a placeholder with this structure. The hashes are placeholders only,
they will be replaced by the setup script in the next step:

{
  "pi": {
    "username": "pi",
    "password_hash": "PLACEHOLDER",
    "role": "admin"
  },
  "nafisa": {
    "username": "nafisa",
    "password_hash": "PLACEHOLDER",
    "role": "client"
  }
}

FILE 3: scripts/setup-users.js

A small script that accepts a username and password as command line arguments
and writes the bcrypt hash to config/users.json for that user.
Usage: node scripts/setup-users.js nafisa [password]
It should read the existing users.json, update the named user's password_hash,
and write the file back. Confirm the hash was written on completion.

After writing all three files, update build-state.json:
set step 3_auth to complete and update the notes field.
```

**Confirmation:** All three files are written. Claude Code confirms their content.

---

### 2.5 Set user passwords

Paste this prompt, replacing the passwords with your actual chosen passwords:

```
On my Raspberry Pi at [your Pi static IP], in /home/pi/stage/:

Run the user setup script to set passwords for both accounts:

node scripts/setup-users.js pi [choose a strong admin password]
node scripts/setup-users.js nafisa [choose a client password to share with Nafisa]

Confirm both commands complete successfully and that config/users.json
now contains bcrypt hashes rather than the PLACEHOLDER values.

Do not log or repeat the plaintext passwords back to me.
```

**Confirmation:** users.json contains bcrypt hashes for both accounts.

---

### 2.6 Manifest loader

Paste this prompt:

```
On my Raspberry Pi at [your Pi static IP], in /home/pi/stage/:

Write manifest.js — a module that loads and validates engagement manifests.

It should export:
- loadManifest(engagementId): reads engagements/[engagementId]/manifest.json,
  parses it, validates that required fields are present (engagement, client, modes,
  and the relevant mode config for each mode listed), and returns the parsed object.
  Throws a clear error if the file does not exist or required fields are missing.
- listEngagements(): reads the engagements/ directory and returns an array of
  folder names that contain a manifest.json file.

Also write the PureMed manifest at engagements/puremed/manifest.json.
Use this structure:

{
  "engagement": "PureMed Aesthetics",
  "client": "Nafisa",
  "modes": ["prototype", "assets", "copy"],
  "prototype": {
    "file": "prototype/index.html"
  },
  "assets": {
    "library": [],
    "placements": [
      {
        "id": "hero-main",
        "label": "Homepage hero",
        "description": "The first image visitors see. Full width behind the hero headline."
      },
      {
        "id": "treatment-intro",
        "label": "Treatments section image",
        "description": "Sets the visual tone for the treatments overview."
      },
      {
        "id": "about-image",
        "label": "About section image",
        "description": "Supports the about section. Should feel personal and warm."
      }
    ]
  },
  "copy": {
    "sections": []
  }
}

Note: the library and copy sections will be populated later when the
PureMed prototype and copy are provided. Leave them as empty arrays for now.

After writing both files, update build-state.json:
set step 4_manifest to complete.
```

**Confirmation:** manifest.js and the PureMed manifest.json are written.

---

### 2.7 Main server and routes

Paste this prompt:

```
On my Raspberry Pi at [your Pi static IP], in /home/pi/stage/:

Write server.js — the main Express application.

Requirements:

1. Import express, express-session, path, fs, and the auth, manifest, and signoff modules.

2. Configure express-session with:
   - A strong secret (generate a random 32-character string)
   - resave: false
   - saveUninitialized: false
   - Cookie maxAge: 24 hours

3. Serve static files from the public/ directory.

4. Routes to implement:

GET /login — serve views/login.html
POST /login — call validateCredentials, set req.session.user on success,
   redirect to /review/puremed. Return 401 with error message on failure.
POST /logout — destroy session, redirect to /login.

GET /review/:engagement — requireAuth middleware, serve views/shell.html

GET /api/manifest/:engagement — requireAuth, call loadManifest, return JSON.
   Return 404 if engagement not found.

GET /assets/:engagement/:file — requireAuth, serve the file from
   engagements/[engagement]/assets/[file]. Return 404 if not found.

GET /prototype/:engagement — requireAuth, read the prototype HTML file,
   rewrite any src and href attributes that reference local asset paths
   to point at /assets/[engagement]/[filename] instead.
   Serve the modified HTML.

POST /api/state/:engagement — requireAuth, read request body as JSON,
   write it to engagements/[engagement]/output/review-state.json.
   Return 200 on success.

GET /api/state/:engagement — requireAuth, read review-state.json if it exists
   and return it as JSON. Return an empty object if the file does not exist yet.

POST /api/signoff/:engagement — requireAuth, call generateSignoff(engagementId),
   return 200 with the path to the generated file on success.

GET /output/:engagement/signoff.md — requireAdmin middleware, serve
   engagements/[engagement]/output/signoff.md. Return 404 if not yet generated.

5. Start the server on port 3000.
6. Log "Stage running on port 3000" on startup.

Write the complete file. Do not truncate.

After writing, update build-state.json notes to reflect that server.js is written
and step 5_prototype_mode is in_progress.
```

**Confirmation:** server.js is written completely. Claude Code confirms the file length and key route names.

---

### 2.8 Sign-off document generator

Paste this prompt:

```
On my Raspberry Pi at [your Pi static IP], in /home/pi/stage/:

Write signoff.js — the module that generates the Markdown sign-off document.

It should export a single async function generateSignoff(engagementId) that:

1. Reads engagements/[engagementId]/output/review-state.json
2. Reads engagements/[engagementId]/manifest.json
3. Generates a Markdown document in this format:

---
# [Engagement name] — Client Sign-off
Date: [today's date, formatted as DD Month YYYY]
Reviewed by: [client name from manifest]
Status: SIGNED OFF
---

## Asset Selections

| Placement | Selected Asset | Notes |
|-----------|---------------|-------|
[one row per placement from review state]

---

## Curated Images

Images selected by the client during the gallery review:
[list of filenames]

---

## Copy

[For each copy section:]
### [section id]
**Location:** [location from manifest]
**Status:** [Approved as written / Updated / Needs discussion]

**Original:**
[original copy from manifest]

**Approved:**
[approved copy from review state, or original if unchanged]

---

## Client comments
[overall comments from review state, or "None provided" if empty]

---

## Build instructions for Claude Code
[Auto-generated list of actionable instructions derived from the review state:
- For each asset placement: "Use [filename] for [placement label]"
- For each copy section with status Updated: "[section label] copy: [approved text]"
- For each copy section with status Approved as written: "[section label]: approved as written, no changes"
- For each section with status Needs discussion: "FLAG: [section label] needs discussion before building"]

---

4. Write the generated Markdown to engagements/[engagementId]/output/signoff.md
5. Return the file path on success

After writing signoff.js, update build-state.json: set step 8_signoff to complete.
```

**Confirmation:** signoff.js is written. Claude Code confirms it exports generateSignoff.

---

### 2.9 Login view

Paste this prompt:

```
On my Raspberry Pi at [your Pi static IP], in /home/pi/stage/views/:

Write login.html — the login page for Stage.

Design requirements:
- Clean, minimal, non-technical in appearance
- Background: #F5EFE5 (parchment)
- Primary text: #1C1712 (near black)
- Accent / button: #BF6B47 (terracotta)
- Font: system sans-serif stack, no external font dependencies at this stage
- Centred card layout, vertically centred in the viewport
- Fields: username (labelled "Your name"), password (labelled "Password")
- Submit button: "Enter"
- If the server returns a 401, show a brief error message below the form:
  "Those details don't match. Try again."
- No logo, no branding, no MSS references. This is Nafisa's review environment.
  The page title should be "PureMed — Review"

The form posts to /login. Handle the response and error state in vanilla JS.

Write the complete HTML file including all inline styles and script.
```

**Confirmation:** login.html is written.

---

### 2.10 App shell

Paste this prompt:

```
On my Raspberry Pi at [your Pi static IP], in /home/pi/stage/views/:

Write shell.html — the main application shell that loads after login.

This is a single-page application shell. It does not reload between modes.
Content is loaded dynamically into a main content area by app.js.

Structure:
- A top navigation bar with:
  - Left: the engagement name (loaded from the manifest)
  - Centre: three mode tabs labelled "Preview", "Images", and "Copy"
  - Right: a progress indicator showing how many sections are complete,
    and a "Sign off" button that is greyed out until all modes are visited
- A main content area below the navigation where partials are loaded
- A subtle autosave indicator in the bottom right corner
  ("Saved" appears briefly after each autosave, then fades)

The shell loads the manifest on startup via GET /api/manifest/puremed,
stores it in a module-level variable, then loads the existing review state
via GET /api/state/puremed. From there it renders the first mode tab.

Color palette:
- Background: #F5EFE5
- Near black: #1C1712
- Terracotta: #BF6B47
- Blush: #E8C9AE

Font: system sans-serif for now.

Write the complete HTML file. Navigation and shell logic should be in the file.
The mode-specific logic for each partial will be added in later steps.
```

**Confirmation:** shell.html is written.

---

### 2.11 Test the auth and server

Paste this prompt:

```
On my Raspberry Pi at [your Pi static IP]:

1. Start the Stage application using: cd /home/pi/stage && node server.js
2. From the Pi, test that the server responds on port 3000:
   curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/login
   This should return 200.
3. Test the login route with correct credentials for the nafisa account:
   curl -s -c /tmp/cookie.txt -d "username=nafisa&password=[nafisa password]" \
   -X POST http://localhost:3000/login -L -o /dev/null -w "%{http_code}"
   This should return 200 (after redirect) if credentials are correct.
4. Test the login route with wrong credentials and confirm it returns 401.
5. Stop the server after testing: Ctrl+C or kill the process.

Report the result of each test. If any test fails, diagnose and fix before continuing.

After all tests pass, update build-state.json: set step 3_auth to confirmed_working.
```

**Confirmation:** All three curl tests return the expected status codes.

---

### 2.12 Nginx configuration and HTTPS

Paste this prompt, filling in your Duck DNS subdomain:

```
On my Raspberry Pi at [your Pi static IP]:

1. Write the following Nginx configuration file at /etc/nginx/sites-available/stage:

server {
    listen 80;
    server_name [your Duck DNS subdomain, e.g. mss-review.duckdns.org];

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }

    location /assets/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        expires 1d;
        add_header Cache-Control "public";
    }
}

2. Enable the site: sudo ln -s /etc/nginx/sites-available/stage /etc/nginx/sites-enabled/
3. Remove the default site if present: sudo rm -f /etc/nginx/sites-enabled/default
4. Test the Nginx config: sudo nginx -t
5. Reload Nginx: sudo systemctl reload nginx
6. Obtain a Let's Encrypt certificate using Certbot:
   sudo certbot --nginx -d [your Duck DNS subdomain] --non-interactive --agree-tos \
   -m [your email address]
7. Confirm Certbot updated the Nginx config for HTTPS.
8. Test that Nginx is running: sudo systemctl status nginx

Report the output of each step. If Certbot fails, report the exact error.

After success, update build-state.json: set step 9_nginx_https to complete.
```

**Confirmation:** Certbot completes successfully and Nginx status shows active.

---

### 2.13 PM2 process management

Paste this prompt:

```
On my Raspberry Pi at [your Pi static IP], in /home/pi/stage/:

1. Start the Stage application with PM2:
   pm2 start server.js --name stage

2. Save the PM2 process list so it restarts after reboot:
   pm2 save

3. Configure PM2 to start on system boot:
   pm2 startup
   Run whatever command PM2 outputs from that instruction.

4. Verify PM2 is running Stage:
   pm2 status

5. Test the full stack is working end to end:
   curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/login
   This should return 200.

6. Reboot the Pi: sudo reboot
   Wait 60 seconds, then confirm the app is still running:
   pm2 status (after SSHing back in)

Report the result of each step.

After the reboot test passes, update build-state.json:
set step 10_pm2 to complete and set all completed steps accordingly.
```

**Confirmation:** pm2 status shows Stage as online after reboot.

---

### 2.14 End-to-end test from outside the network

At this point, take your phone off WiFi and open `https://[your Duck DNS subdomain]` in a browser. You should see the Stage login page over HTTPS.

Log in with the nafisa credentials. You should reach the app shell.

If this works, the infrastructure is complete.

**Confirmation:** Login page loads over HTTPS from an external device. Login succeeds.

---

## Part 3 — Manifest population for PureMed

*Done once the prototype and assets are ready. Run as a single Claude desktop prompt, not in Claude Code.*

When the PureMed prototype HTML and asset files are ready, run this prompt in a Claude desktop or web session with the prototype attached:

```
I am populating the manifest for the Stage review tool for PureMed Aesthetics.

Here is the prototype HTML: [attach or paste]
Here is the list of asset files in the assets folder: [paste the output of ls engagements/puremed/assets/]

Do the following:

1. For each copy section in the prototype that the client needs to review,
   extract the current copy text and write a manifest entry with:
   - id: a short slug derived from the section name
   - label: a plain English label the client will read
   - location: where on the page this copy appears
   - current: the exact copy as it appears in the prototype
   - guidance: a plain English note explaining what this copy does and what
     the client should consider when reviewing it. No design jargon.

2. For each WebP file in the assets folder, write a library entry with:
   - file: the filename
   - label: a descriptive label derived from the filename and context.
     If the filename is not descriptive enough, note it for review.

Output the complete updated manifest.json ready to paste into
engagements/puremed/manifest.json on the Pi.
```

Review the output, particularly the guidance notes. Adjust anything that requires judgment. Then paste the manifest onto the Pi via Claude Code or SCP.

---

## Part 4 — Asset transfer to Pi

Once assets are finalised, transfer them to the Pi:

```bash
scp /path/to/local/assets/*.webp pi@192.168.50.200:/home/pi/stage/engagements/puremed/assets/
```

And the prototype:

```bash
scp /path/to/prototype/index.html pi@192.168.50.200:/home/pi/stage/engagements/puremed/prototype/
```

---

## Part 5 — Client UI (remaining modes)

The remaining Claude Code prompts for the gallery, placement, copy review, and sign-off screens are the next build phase. These are written once the infrastructure above is confirmed working end to end.

Start that session with:

```
Continue the Stage build. Check build-state.json first.
The infrastructure is complete. We are now building the client-facing UI.
Start with the asset gallery mode (step 6_asset_mode).
```

---

## Session resume instruction

If a Claude Code session ends at any point during this build, start a new session and paste:

```
Continue the Stage build on my Raspberry Pi at [your Pi static IP].
Check /home/pi/stage/build-state.json first and report current status.
Then continue from where the build left off.
```

Claude Code will read the build state and pick up from the correct step without needing to reconstruct context.

---

## Reference: file structure (complete)

```
/home/pi/stage/
├── server.js
├── auth.js
├── manifest.js
├── signoff.js
├── package.json
├── build-state.json
├── config/
│   └── users.json
├── engagements/
│   └── puremed/
│       ├── manifest.json
│       ├── prototype/
│       │   └── index.html
│       ├── assets/
│       │   └── [WebP files]
│       └── output/
│           ├── review-state.json
│           └── signoff.md
├── public/
│   ├── style.css
│   └── app.js
├── views/
│   ├── login.html
│   ├── shell.html
│   └── partials/
│       ├── prototype.html
│       ├── gallery.html
│       ├── placements.html
│       ├── copy.html
│       └── signoff.html
└── scripts/
    └── setup-users.js
```

---

## Reference: sign-off document format

What Claude Code reads after the client completes their review:

```markdown
# PureMed Aesthetics — Client Sign-off
Date: 24 June 2026
Reviewed by: Nafisa
Status: SIGNED OFF

---

## Asset Selections

| Placement | Selected Asset | Notes |
|-----------|---------------|-------|
| Homepage hero | hero-02.webp | |
| Treatments section image | treatment-01.webp | |

---

## Curated Images

Images selected by the client during the gallery review:
- hero-02.webp
- treatment-01.webp
- about-warm.webp

---

## Copy

### hero-headline
**Location:** Hero section, top of page
**Status:** Updated

**Original:**
Where confidence begins.

**Approved:**
Where you come first.

---

## Client comments
None provided.

---

## Build instructions for Claude Code
- Use hero-02.webp for the Homepage hero placement
- Use treatment-01.webp for the Treatments section image placement
- hero-headline copy: "Where you come first."
- hero-body: approved as written, no changes
```

---

*End of build plan. Part 1 is manual. Parts 2 onwards are Claude Code.*
