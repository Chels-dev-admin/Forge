# Forge — deploy to GitHub Pages (free, on-device saving, installable app)

This folder is a complete, self-contained web app. Put these files at the root of a
GitHub repo, turn on Pages, and open the URL on your phone. Saved workouts and your
entered details are stored **on your device** (no login, no server).

## Files
- `index.html` — the app (engine version)
- `manifest.webmanifest` — makes it installable (name, icons, colors)
- `sw.js` — service worker: offline support + pulls the latest version when online
- `icon-192.png`, `icon-512.png`, `icon-180.png` — app icons

## One-time setup

1. Create a free account at github.com if you don't have one.
2. Click **+ → New repository**. Name it e.g. `forge`. Set it **Public**. Create it.
3. On the repo page: **Add file → Upload files**. Drag in ALL the files from this
   folder (index.html, manifest.webmanifest, sw.js, and the three icons). Commit.
4. Go to **Settings → Pages**. Under "Build and deployment", set **Source = Deploy
   from a branch**, **Branch = main**, **Folder = / (root)**. Save.
5. Wait ~1 minute. Pages shows your URL: `https://YOUR-USERNAME.github.io/forge/`

## Put it on your phone
- Open that URL in your phone's browser.
- **iPhone (Safari):** Share → **Add to Home Screen**.
- **Android (Chrome):** menu (⋮) → **Install app** / **Add to Home screen**.
It now opens full-screen like a native app and works offline.

## When we make updates here
1. Replace `index.html` in the repo with the new one (**Upload files** → commit,
   or edit the file directly).
2. Pages redeploys in ~1 minute. Next time you open the app it loads the new version
   (the service worker checks the network first). Your saved workouts stay put.
3. If you also change icons or the manifest, bump the cache: open `sw.js`, change
   `forge-v1` to `forge-v2`, commit. That forces the new assets through.

## Notes
- Everything is stored locally via your browser. Clearing site data / browser storage
  will remove saved workouts. There's no cloud backup (by design — no login).
- This is the **engine** version. The AI version needs a secret API key + a small
  server proxy, so it can't run as a plain static site.
