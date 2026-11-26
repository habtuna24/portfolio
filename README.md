# HABTUNA 24 – Portfolio

Personal portfolio of **Habtamu Teklehaymanot**, Computer Engineering student at Bahir Dar University.
Built with plain HTML5, CSS3 and vanilla JavaScript. No frameworks, no build step, no database.

## Folder structure

```
habtuna-portfolio/
├── index.html
├── css/style.css
├── js/script.js
├── images/
│   ├── favicon.svg
│   ├── profile.jpg        (placeholder – replace)
│   ├── project-1.png      (placeholder – replace)
│   ├── project-2.png      (placeholder – replace)
│   └── project-3.png      (placeholder – replace)
├── documents/Habtamu-CV.pdf   (placeholder – replace)
└── README.md
```

## 1. Fill in your details (one place only)

Open `js/script.js` and edit the `SITE_CONFIG` block at the top:

| Field | What to put |
|-------|-------------|
| `github` | Your profile URL. Pre-filled with `https://github.com/habtuna24` – **verify it is correct** |
| `email`, `phone`, `telegram` | Already filled in with your details |
| `linkedin` | Add your profile URL. While empty, its link shows as disabled |
| `formEndpoint` | Optional form service URL (e.g. Formspree) so the contact form really sends |
| `projects.projectN.github / demo` | Repository and live-demo URLs. Empty = disabled button |
| `projects.projectN.status` | `"completed"` or `"progress"` |

Nothing was invented: anything not supplied is marked as a placeholder.

Also confirm in `index.html`: relevant coursework (Education section) and the language used in Project 3.

**Themes:** the sun/moon button in the top bar switches between dark and light. The choice is remembered on that device. Dark is the default.

## 2. Replace placeholder files (keep the same names)

- `images/profile.jpg` – square photo, at least 600×600 px
- `images/project-1.png`, `project-2.png`, `project-3.png` – screenshots, 16:9 (e.g. 1280×720)
- `documents/Habtamu-CV.pdf` – your real CV

## 3. Run locally in Termux

First time only:

```bash
pkg update
pkg install nodejs git
```

Option A – your existing Node.js server: put the `habtuna-portfolio` folder where your server serves static files, or point it at this folder.

Option B – a zero-setup static server:

```bash
cd ~/habtuna-portfolio
npx http-server -p 8080
```

Option C – Python, if installed (`pkg install python`):

```bash
cd ~/habtuna-portfolio
python -m http.server 8080
```

Then open **http://localhost:8080** in your phone browser. (Opening `index.html` directly also works, but a server is closer to how it behaves online.)

## 4. Publish on GitHub Pages

1. Create a new **public** repository on github.com named `habtuna-portfolio` (no README, since you already have one).
2. In Termux:

```bash
cd ~/habtuna-portfolio
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/habtuna24/habtuna-portfolio.git
git push -u origin main
```

GitHub asks for your username and a **Personal Access Token** as the password (GitHub → Settings → Developer settings → Personal access tokens). Passwords no longer work for git pushes.

3. On GitHub open the repo → **Settings → Pages**.
4. Under **Build and deployment**, set Source to *Deploy from a branch*, Branch `main`, folder `/ (root)`, then Save.
5. Wait 1–2 minutes. Your site will be at `https://habtuna24.github.io/habtuna-portfolio/` (adjust if your username differs).

To update later: edit files, then `git add . && git commit -m "Update" && git push`.

## 5. Test checklist

- Menu opens/closes on a phone-width window; every nav link scrolls to its section.
- Active nav item changes as you scroll.
- Project filters show/hide cards; "All" restores them.
- Disabled links (no URL yet) cannot be clicked; real ones open in a new tab.
- Contact form: with nothing configured it says nothing was sent; with `email` set it opens your email app; with `formEndpoint` set it posts and reports the real result.
- Back-to-top button appears after scrolling and works.
- With "reduce motion" enabled in your device settings, scroll animations are off.
