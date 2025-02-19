# Stellar - Video Conferencing Application

Stellar is a high-performance video conferencing application built on [Livekit](https://livekit.io/). It leverages modern web technologies to provide a smooth real-time communication experience.

## Tech Stack

### Frontend
- **React (Vite)**
- **Tailwind CSS**
- **RxJS**
- **Livekit**
- **Storybook**
- **Framer Motion**
- **IndexedDB**

### Backend
- **NestJS**
- **Livekit**
- **Swagger**
- **SQLite**
- **Prisma**

## Live Demo
- **Live Site**: [stellar-conferencing.vercel.app](https://stellar-conferencing.vercel.app/)
- **Storybook**: [Chromatic Deployment](https://67b58226c871a884bc89a90b-oyibqdsbtl.chromatic.com)
- **Swagger API Docs**: [stellar-conferencing.onrender.com/api](https://stellar-conferencing.onrender.com/api)

## Repository
- **GitHub**: [ore-codes/stellar-conferencing](https://github.com/ore-codes/stellar-conferencing)

---

## 🚀 Getting Started

### Prerequisites
Ensure you have the following installed:
- **Node.js** (LTS recommended)
- **npm** (preferred package manager)
- **LiveKit local server** [Refer to docs](https://docs.livekit.io/home/self-hosting/local/)

### Local Setup

Clone the repository:
```sh
git clone https://github.com/ore-codes/stellar-conferencing.git
cd stellar-conferencing
```

Install dependencies:
```sh
npm install
```

### Configure Environment Variables

#### Backend (`apps/server/.env`)
```sh
JWT_SECRET=<jwt-secret>
FRONTEND_URL=http://localhost:5173
LIVEKIT_API_KEY=devkey
LIVEKIT_SECRET=secret
```

#### Frontend (`apps/web/.env`)
```sh
VITE_SERVER_URL=<backend-url>
VITE_LIVEKIT_URL=<your-livekit-ws-url>
```

### Start the Development Servers
Run both frontend and backend in parallel:
```sh
npm run dev
```

The frontend should now be running at `http://localhost:5173/` and the backend will be running at `http://localhost:3000/`.

---

## 🛠 Testing with Storybook/Chromatic

### Running Storybook Locally
```sh
npm run storybook
```
Storybook will start on `http://localhost:6006/`.

### Deploying to Chromatic
Ensure you have a [Chromatic](https://www.chromatic.com/) account set up.

1. Install Chromatic CLI if not already installed:
   ```sh
   npm add chromatic --dev
   ```
2. Run Chromatic deployment:
   ```sh
   npm run chromatic --project-token=<your-chromatic-project-token>
   ```

This will upload your Storybook to Chromatic for visual testing.

---

## 📜 License
This project is licensed under the **MIT License**.

---

## 🤝 Contributing
Pull requests are welcome! Please follow best practices and ensure any changes do not break existing functionality.

---

## 📧 Contact
For inquiries or support, reach out to [@ore-codes](https://github.com/ore-codes) on GitHub.

---

Enjoy building with **Stellar**! 🚀

