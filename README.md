# My Ring, My Story

A static web app (HTML/CSS/JS). It has no build step and needs no server code.

## Structure
```
index.html             main page
css/style.css          all styles
js/app.js              all logic (data is stored in localStorage)
images/                ring images
favicon.svg            icon
manifest.webmanifest   Add to Home Screen settings
robots.txt
```

## Running locally
```bash
npx serve .            # or: python3 -m http.server 8080
```

## Deploy (pick one)
Upload this whole folder. It's a static site:
- **Netlify**: drag and drop the folder at app.netlify.com/drop
- **Vercel**: `npx vercel` → Framework: Other, Output dir: `.`
- **GitHub Pages**: push to a repo → Settings → Pages → branch `main` / root
- **Cloudflare Pages**: Build command empty, Output dir `/`

## Before you deploy
- Web Bluetooth (connecting a real ring) only works over **HTTPS** and in Chrome/Edge (not iOS Safari).
- `og:image` in `index.html` is a relative path. Change it to a full URL after deploy
  (e.g. `https://your-domain/images/hero.png`) so link previews show the image.
- The parent folder name contains spaces and an em dash. Rename it (e.g. `my-ring`) before pushing to git/CI.
