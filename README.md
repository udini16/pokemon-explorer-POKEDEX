# ⚡ Modern React Pokédex (Vite + Tailwind v4)

A high-performance, interactive Pokédex application built with **React 18** and **Tailwind CSS v4**. This project features real-time data fetching from the PokeAPI, advanced filtering, and a custom "Pokéball" UI design.

## 🚀 Features

* **Dynamic Type Filtering:** Instantly filter Pokémon by their elemental types (Fire, Water, Grass, etc.).
* **Catchy Search UX:** Custom "Empty State" featuring a confused Psyduck when no results are found.
* **Pokéball UI Modal:** A custom-engineered modal that mimics a Pokéball, displaying stats, abilities, and dynamic type-based coloring.
* **Interactive Audio:** Click on Pokémon sprites to hear their official in-game audio cries.
* **Optimized Performance:** Uses Skeleton Loaders to prevent layout shifts and smooth out data transitions.
* **UX Enhancements:** Includes a floating "Back to Top" Pokéball button for easy navigation through long lists.
* **Evolution Chains:** Utilizes chained API calls to map and display full, multi-stage Pokémon evolutionary lines side-by-side.
* **Pagination System:** Replaced standard infinite scrolling with a clean, state-driven page navigation system for better UX.
* **Dynamic Type Badges:** UI elements automatically inherit the official hex colors of their corresponding Pokémon types.


## 🧠 Design & Technical Decisions

* **Modal vs. Dedicated Pages:** I opted for a Modal-based architecture (Popup Cards) rather than routing to new pages. This preserves the user's current search state and scroll position, creating a frictionless, app-like browsing experience.
* **State-Driven Pagination:** Instead of infinite scrolling, which can cause severe DOM lag with high-resolution images, I implemented strict 20-item pagination. This ensures the app remains lightweight and performant.
* **Chained API Resolution:** The PokeAPI separates base data and species data. I wrote a custom `while` loop to cleanly traverse the deeply nested `evolves_to` JSON tree, combining multiple API endpoints into a single, cohesive UI component.
* **Unique Key Generation:** To prevent React reconciliation bugs and animation lag during re-renders, I extracted the unique Pokémon IDs directly from the API URLs to serve as strict unique keys for the list mapping.


## 🛠️ Tech Stack

* **Frontend:** React 18 (Hooks, Functional Components)
* **Build Tool:** Vite
* **Styling:** Tailwind CSS v4 (using the new @theme engine)
* **API:** [PokeAPI](https://pokeapi.co/)
* **Typography:** Poppins (Google Fonts)

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/pokedex-react.git](https://github.com/YOUR_USERNAME/pokedex-react.git)
