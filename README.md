# 🌌 Orpheus Archives — A Personal Media Universe

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Django](https://img.shields.io/badge/Django-REST-green?logo=django)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-blue?logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-2.2-blue?logo=tailwind-css)
![Vercel](https://img.shields.io/badge/Vercel-deployment-black?logo=vercel)
![Railway](https://img.shields.io/badge/Railway-deployment-red?logo=railway)

**Orpheus Archives** is a full-stack personal media tracker built with **Next.js**, **Django REST Framework**, and **PostgreSQL**, designed to elegantly manage, rate, and visualize films, books, music, art, games, and more — all through a clean, modern interface.

This project merges data-driven insight, beautiful UI/UX, and deep cultural passion, combining interactive features (ratings, lists, API imports, stats) with a powerful backend for lifelong cataloguing.

---

## ✨ Core Features

### 🎬 Films & Books Tracker
- Add, rate, and review films and books with custom fields.
- Integrated **TMDb API** support for automatic metadata fetching.
- Custom industry vs personal rating comparison stats.
- Intelligent search and sorting (by year, rating, or title).
- Hoverable tooltips showing deeper metadata.

### 🏷️ Lists
- Create, edit, and delete custom lists for both films and books.
- Add items via a smart search modal.
- View lists on dedicated pages with inline editing support.
- Stored with many-to-many relationships in Django for relational efficiency.

### ⭐ 5-Star Rating System
- Interactive, animated 5-star components on the frontend.
- Fully synced with backend integer ratings (0–10 scale, mapped to 5-star UI).

### 🧮 Smart Stats
- Calculates:
  - Average personal rating
  - Average industry rating
  - Average difference between both
  - Total items watched/read
  - Dynamic search stats per query
- Displays results in real time using lightweight React state management.

### 🏆 Awards Tracker
- Tracks wins and nominations for each film.
- Displays clean category tags with color-coded outcomes.
- Dynamic summary (e.g. 🏆 3 Wins · 8 Nominations) with hover tooltip for extra info.

### 🖼️ Dynamic Image Selection
- Custom modal allows changing posters and backdrops directly from TMDb.
- Live fetch of all available artwork with ISO 639-1 language filters.
- Instantly updates your chosen images on confirmation — no reload required.

### 🧩 Extras & Collections
- Music, Games, Wardrobe, Instruments, Art — all organized in a unified data model.
- Modular structure allows adding new categories effortlessly.

### 🌙 Design
- Built with **Tailwind CSS** for a smooth and responsive UI.
- Supports both light and dark modes.
- Carefully tuned color palette with strong contrast and elegant typography.
- Modals, dropdowns, and hover effects for a premium feel.

---

## ⚙️ Technical Overview

| Layer      | Technology                       | Purpose                                     |
|----------- |--------------------------------- |------------------------------------------- |
| Frontend   | Next.js 14 (App Router)           | Dynamic pages, API fetching, UI rendering |
| Styling    | Tailwind CSS                      | Modern, responsive design                  |
| Backend    | Django REST Framework             | API, database models, business logic      |
| Database   | PostgreSQL                        | Persistent structured storage              |
| Deployment | Railway (Backend), Vercel (Frontend) | CI/CD hosting pipeline                  |
| APIs       | TMDb API                          | Film metadata, posters, backdrops          |
| Auth       | Simple token-based access         | Configurable for future user auth         |
| Management | Custom Django commands            | e.g., Letterboxd CSV importer             |

---

## 💡 Highlights for Employers

- **Full-stack developer:** Seamless integration between modern frontend and robust backend  
- **API Design:** Well-structured, documented, and scalable endpoints  
- **Data-Driven UI:** React hooks + intelligent caching for fast and reactive experiences  
- **Cultural intelligence:** Integrates real-world data (Letterboxd, TMDb) and personal curation  
- **Extensible Architecture:** Easily add new categories, APIs, or analytics modules  
- **Visually polished:** Thoughtful design, custom modals, and hover animations  

---

## 🧠 Future Plans

- User accounts & authentication  
- Public sharing of lists and ratings  
- AI-based film recommendations (semantic similarity)  
- Support for multiple languages (EN/DE/JP)  
- Integration with Goodreads API for book data  

---

## 🪶 Author

**Matthew Rayner** — Software Developer and Linguist 

- 🔗 Portfolio(https://matthewjrayner.github.io)  
- 💼 [LinkedIn](https://linkedin.com)  
- 📬 Contact: raynerjmatthew@gmail.com
