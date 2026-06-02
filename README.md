<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-6.3-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.1-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-2.11-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux" />
  <img src="https://img.shields.io/badge/Socket.IO-4.8-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/Framer_Motion-12.x-FF0050?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

<h1 align="center">🎓 SkillHub — Frontend</h1>

<p align="center">
  <b>A modern, feature-rich learning management platform built with React, Vite, and TailwindCSS.</b><br/>
  Real-time messaging, gamification, community features, and a full admin dashboard — all in one beautiful UI.
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-deployment">Deployment</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

## ✨ Features

### 👤 User Portal

| Feature | Description |
|---|---|
| **Dashboard** | Personalized overview with enrolled courses, progress stats, and activity feed |
| **Course Catalog** | Browse, search, and enroll in courses with detailed course pages |
| **Learning Experience** | Interactive lesson viewer with progress tracking and quiz assessments |
| **Real-time Messaging** | Socket.IO-powered chat with typing indicators, read receipts, emoji reactions, message editing & deletion |
| **Communities** | Join and participate in learning communities with posts, likes, and comments |
| **Friend System** | Send/accept friend requests, view public profiles, and manage connections |
| **Leaderboard** | Gamified ranking system with points and achievement badges |
| **Certificates** | Earn and view completion certificates |
| **Notifications** | Real-time in-app notifications for enrollments, messages, and social interactions |
| **Activity Feed** | Track all platform activities in one place |
| **Profile Management** | Custom avatar, bio, social links (GitHub, LinkedIn, Twitter) |
| **Settings** | Account preferences and configuration |
| **Help & Support** | In-app help center |
| **Reports** | Report inappropriate content or users |

### 🛡 Admin Panel

| Feature | Description |
|---|---|
| **Admin Dashboard** | Platform-wide analytics and statistics overview |
| **User Management** | View, search, and manage all platform users with detailed profiles |
| **Course Management** | Create, edit, and delete courses with full CRUD operations |
| **Resource Management** | Manage course lessons and quiz content |
| **Community Moderation** | Oversee and moderate community content |
| **Reports Center** | Review and action user reports with detailed views |
| **Admin Settings** | Platform configuration and admin preferences |

### 🎨 UI/UX Highlights

- **Dark Mode** — Elegant dark theme enabled by default
- **Animations** — Smooth page transitions and micro-interactions via Framer Motion
- **Responsive Design** — Mobile-first approach with TailwindCSS
- **Toast Notifications** — Non-intrusive feedback with React Hot Toast
- **Component Libraries** — Enhanced UI with Material UI, Flowbite, Headless UI, DaisyUI, and Lucide icons
- **Data Visualization** — Interactive charts and graphs with Recharts
- **Markdown Support** — Rich text rendering with React Markdown, syntax highlighting, and GFM support
- **Lottie Animations** — Delightful animated illustrations throughout the app

---

## 🏗 Architecture

### Tech Stack Overview

```
┌─────────────────────────────────────────────────────────┐
│                     PRESENTATION                         │
│  React 18 • TailwindCSS 4 • Framer Motion • DaisyUI     │
│  Material UI • Flowbite • Headless UI • Lucide Icons     │
├─────────────────────────────────────────────────────────┤
│                     STATE MANAGEMENT                     │
│  Redux Toolkit • Redux Persist • React Context           │
├─────────────────────────────────────────────────────────┤
│                     DATA LAYER                           │
│  Axios (REST) • Socket.IO Client (WebSocket)             │
├─────────────────────────────────────────────────────────┤
│                     ROUTING                              │
│  React Router DOM v7 • Protected Routes (Role-based)     │
├─────────────────────────────────────────────────────────┤
│                     BUILD & DEV                          │
│  Vite 6 • ESLint • Vitest • Docker + Nginx               │
└─────────────────────────────────────────────────────────┘
```

### Routing Architecture

```
/                         → Public landing page
/login                    → User login
/signup                   → User registration

/user/*                   → Protected (role: user)
  ├── dashboard           → User dashboard
  ├── mycourses           → Enrolled courses
  ├── course/:courseId    → Course details
  ├── learn/:courseId     → Learning page
  ├── communities         → Community listing
  ├── community/:id      → Community details
  ├── certificates        → User certificates
  ├── messages            → Real-time messaging
  ├── leaderboard         → Gamified rankings
  ├── activities          → Activity feed
  ├── notifications       → Notification center
  ├── profile             → User profile
  ├── view-profile/:id   → Public user profile
  ├── settings            → User settings
  ├── report              → Submit reports
  └── help                → Help & support

/admin/*                  → Protected (role: admin)
  ├── admindashboard      → Admin overview
  ├── courses             → Course management
  ├── courses/:id        → Course details
  ├── courses/edit/:id   → Edit course
  ├── courses/new        → Create course
  ├── users               → User management
  ├── users/:id          → User details
  ├── resources           → Resource management
  ├── resources/:courseId → Course lessons
  ├── quiz/:courseId     → Course quizzes
  ├── communities         → Community management
  ├── community/:id      → Community details
  ├── reports             → Report management
  ├── reports/:id        → Report details
  └── settings            → Admin settings
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| **Node.js** | ≥ 20.x |
| **npm** | ≥ 9.x |
| **SkillHub Backend** | Running on port 8000 ([see backend README](../Skillhub-backend/README.md)) |

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/skillhub-frontend.git
cd skillhub-frontend

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Backend API URL (REST endpoints)
VITE_API_URL=http://localhost:8000

# WebSocket server URL (Socket.IO)
VITE_WS_URL=http://localhost:8000
```

> **Note:** Vite only exposes env variables prefixed with `VITE_` to the client bundle.

### Development Server

```bash
# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start Vite development server with HMR |
| `build` | `npm run build` | Build production bundle to `dist/` |
| `preview` | `npm run preview` | Preview production build locally |
| `test` | `npm test` | Run unit tests with Vitest |
| `lint` | `npm run lint` | Lint code with ESLint |

---

## 📁 Project Structure

```
SkillHub-Frontend/
├── index.html                    # HTML entry point (dark mode enabled)
├── vite.config.js                # Vite + TailwindCSS + React plugin config
├── vercel.json                   # Vercel SPA routing config
│
├── src/
│   ├── main.jsx                  # React entry — Provider, Router, Store
│   ├── App.jsx                   # Root component with route definitions
│   ├── App.css                   # Global app styles
│   ├── index.css                 # Base CSS imports
│   ├── theme.css                 # Design tokens & theme variables
│   │
│   ├── api/
│   │   └── axiosConfig.js        # Axios instance with interceptors & JWT handling
│   │
│   ├── redux/
│   │   ├── store.js              # Redux store with persist configuration
│   │   └── features/
│   │       ├── auth/             # Authentication slice
│   │       ├── courses/          # Courses state management
│   │       ├── community/        # Community state
│   │       ├── users/            # Users state
│   │       ├── settings/         # Settings state
│   │       └── ui/               # UI state (loaders, modals)
│   │
│   ├── routes/
│   │   └── ProtectedRoute.jsx    # Role-based route guard component
│   │
│   ├── components/
│   │   ├── pages/                # Public pages
│   │   │   ├── PublicLayout.jsx        # Landing page (58KB — full marketing page)
│   │   │   ├── Login.jsx               # Login with form validation
│   │   │   └── SignUp.jsx              # Registration with form validation
│   │   │
│   │   ├── common/               # Shared components
│   │   │   ├── GlobalLoader.jsx        # Full-screen loading overlay
│   │   │   └── AuthListener.jsx        # JWT expiry & auth state listener
│   │   │
│   │   ├── user/                 # User portal components
│   │   │   ├── UserLayout.jsx          # User shell (sidebar + navbar + outlet)
│   │   │   ├── UserNavbar.jsx          # Top navigation with search & notifications
│   │   │   ├── UserSidebar.jsx         # Collapsible sidebar navigation
│   │   │   ├── UserDashboard.jsx       # Dashboard with stats & charts
│   │   │   ├── Profile.jsx             # Profile page with avatar & social links
│   │   │   ├── PublicProfile.jsx       # Read-only public profile view
│   │   │   ├── Settings.jsx            # User settings & preferences
│   │   │   ├── AvatarCustomization.jsx # Avatar upload & customization
│   │   │   │
│   │   │   ├── course/                 # Course-related components
│   │   │   │   ├── MyCourses.jsx             # Enrolled courses grid
│   │   │   │   ├── CourseDetails.jsx         # Individual course page
│   │   │   │   └── LearningPage.jsx          # Lesson viewer & progress
│   │   │   │
│   │   │   ├── messages/               # Real-time messaging
│   │   │   │   └── Messages.jsx              # Chat UI with Socket.IO
│   │   │   │
│   │   │   ├── communities/            # Community features
│   │   │   │   ├── Community.jsx             # Community listing
│   │   │   │   └── CommunityDetails.jsx      # Community page with posts
│   │   │   │
│   │   │   ├── certificate/            # Certificate display
│   │   │   │   └── Certificates.jsx          # Certificate gallery
│   │   │   │
│   │   │   ├── leaderboard/            # Gamification
│   │   │   │   └── LeaderBoard.jsx           # Rankings & points
│   │   │   │
│   │   │   ├── notification/           # Notifications
│   │   │   │   └── Notifications.jsx         # Notification center
│   │   │   │
│   │   │   ├── activity/               # Activity tracking
│   │   │   │   └── Activities.jsx            # Activity feed
│   │   │   │
│   │   │   ├── report/                 # Reporting
│   │   │   │   └── Report.jsx                # Submit report form
│   │   │   │
│   │   │   ├── help/                   # Support
│   │   │   │   └── HelpSupport.jsx           # Help center
│   │   │   │
│   │   │   └── roadmap/               # Learning roadmap (visual)
│   │   │
│   │   └── admin/                # Admin panel components
│   │       ├── AdminLayout.jsx         # Admin shell layout
│   │       ├── AdminNavbar.jsx         # Admin top navigation
│   │       ├── AdminSidebar.jsx        # Admin sidebar navigation
│   │       ├── AdminDashboard.jsx      # Analytics dashboard
│   │       ├── AdminSettings.jsx       # Admin configuration
│   │       │
│   │       ├── course/                 # Admin course management
│   │       │   ├── Courses.jsx               # Course listing table
│   │       │   ├── AdminCourseDetails.jsx    # Course detail view
│   │       │   ├── EditCourse.jsx            # Edit course form
│   │       │   └── AddCourse.jsx             # Create course form
│   │       │
│   │       ├── users/                  # Admin user management
│   │       │   ├── Users.jsx                 # User listing table
│   │       │   └── UserDetails.jsx           # User detail view
│   │       │
│   │       ├── resource/               # Admin resource management
│   │       │   ├── Resources.jsx             # Resource listing
│   │       │   ├── CourseLessons.jsx         # Lesson management
│   │       │   └── CourseQuiz.jsx            # Quiz management
│   │       │
│   │       ├── community/              # Admin community moderation
│   │       │   └── AdminCommunityDetails.jsx # Community moderation view
│   │       │
│   │       └── report/                 # Admin report management
│   │           ├── Reports.jsx               # Report listing
│   │           └── ReportsDetail.jsx         # Report detail & actions
│   │
│   ├── utils/                    # Utility functions
│   ├── assets/                   # Static assets (images, icons)
│   └── test/                     # Test configuration & test files
│
├── public/                       # Public static assets
├── dist/                         # Production build output
│
├── nginx.conf                    # Nginx config for Docker (SPA routing + API proxy)
├── Dockerfile                    # Multi-stage Docker build (Vite → Nginx)
├── .dockerignore                 # Docker build exclusions
│
├── .github/workflows/
│   └── frontend-ci.yml           # GitHub Actions: test → build → deploy to Vercel
│
├── eslint.config.js              # ESLint configuration
├── package.json                  # Dependencies & scripts
└── package-lock.json             # Locked dependency versions
```

---

## 🔧 Configuration

### Axios Configuration

The API client ([axiosConfig.js](src/api/axiosConfig.js)) provides:

- **Base URL** — Configured via `VITE_API_URL`
- **JWT Interceptor** — Automatically attaches `Bearer` token to requests
- **Error Handling** — Global response interceptor for 401/403 errors
- **Token Refresh** — Auth state management with automatic redirect

### Redux Store

State management uses **Redux Toolkit** with **Redux Persist**:

| Slice | Purpose |
|-------|---------|
| `auth` | User authentication state, JWT token, user profile |
| `courses` | Course data and loading states |
| `community` | Community data management |
| `users` | User-related state |
| `settings` | User/admin preferences |
| `ui` | Global UI state (loaders, modals, sidebar) |

### Protected Routes

Routes are guarded by the `ProtectedRoute` component which:

- Checks for valid authentication token
- Validates user role (`user` or `admin`)
- Redirects unauthorized users to the login page

---

## 🐳 Docker

### Build & Run Standalone

```bash
# Build the image
docker build \
  --build-arg VITE_API_URL=http://your-api.com \
  --build-arg VITE_WS_URL=http://your-api.com \
  -t skillhub-frontend .

# Run the container
docker run -d --name skillhub-frontend -p 80:80 skillhub-frontend
```

### Multi-Stage Build Details

| Stage | Base Image | Purpose |
|-------|-----------|---------|
| `builder` | `node:20-alpine` | Install deps, inject `VITE_*` build args, run `npm run build` |
| `runner` | `nginx:1.27-alpine` | Serve static files with custom Nginx config |

### Nginx Configuration

The custom [nginx.conf](nginx.conf) handles:

- **SPA Routing** — All client-side routes fall back to `index.html`
- **API Proxy** — `/api/*` requests are proxied to the backend container
- **WebSocket Proxy** — `/socket.io/*` traffic is proxied with upgrade support
- **Gzip Compression** — Enabled for text, CSS, JS, JSON, and SVG
- **Static Asset Caching** — 1-year cache with immutable headers for hashed assets

### Docker Compose (Full Stack)

From the project root (`Skillhub Project/`):

```bash
# Configure environment
cp .env.example .env
# Edit .env with your values

# Build and start all services
docker compose up --build

# Frontend → http://localhost (port 80)
# Backend  → http://localhost:8000
```

The frontend container waits for the backend health check before starting.

---

## 🚢 Deployment

### Vercel (Current Production)

The frontend is deployed on **Vercel** with automatic CI/CD:

1. **Connect** your GitHub repository to Vercel
2. **Configure** build settings:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **Set** environment variables in Vercel dashboard:
   - `VITE_API_URL` — Your production backend URL
   - `VITE_WS_URL` — Your production WebSocket URL
4. **SPA Routing** is handled by `vercel.json` which rewrites all routes to `/`

### CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/frontend-ci.yml`) runs on every push/PR to `main`:

1. **Checkout** → **Setup Node.js 20** → **Install dependencies**
2. **Run tests** via Vitest
3. **Build** production bundle
4. **Deploy to Vercel** (on push to `main` only)

Required GitHub Secrets:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npx vitest --watch
```

Tests use **Vitest** with **jsdom** environment and **React Testing Library**.

---

## 📦 Dependencies

### Core

| Package | Version | Purpose |
|---------|---------|---------|
| **react** | 18.3.x | UI library |
| **react-dom** | 18.3.x | DOM renderer |
| **react-router-dom** | 7.7.x | Client-side routing |
| **vite** | 6.3.x | Build tool & dev server |

### State Management

| Package | Version | Purpose |
|---------|---------|---------|
| **@reduxjs/toolkit** | 2.11.x | State management |
| **react-redux** | 9.2.x | React-Redux bindings |
| **redux-persist** | 6.0.x | Persist state across sessions |

### Styling & UI

| Package | Version | Purpose |
|---------|---------|---------|
| **tailwindcss** | 4.1.x | Utility-first CSS |
| **@mui/material** | 7.3.x | Material Design components |
| **flowbite / flowbite-react** | latest | Tailwind component library |
| **@headlessui/react** | 2.2.x | Accessible unstyled components |
| **daisyui** | 5.5.x | Tailwind component plugin |
| **framer-motion** | 12.23.x | Animation library |
| **lucide-react** | 0.532.x | Icon library |
| **react-icons** | 5.6.x | Additional icon sets |
| **@heroicons/react** | 2.2.x | Heroicons for React |

### Data & Communication

| Package | Version | Purpose |
|---------|---------|---------|
| **axios** | 1.11.x | HTTP client |
| **socket.io-client** | 4.8.x | WebSocket client |
| **react-hook-form** | 7.61.x | Form handling |

### Content & Visualization

| Package | Version | Purpose |
|---------|---------|---------|
| **recharts** | 3.1.x | Data visualization & charts |
| **react-markdown** | 10.1.x | Markdown rendering |
| **react-syntax-highlighter** | 15.6.x | Code syntax highlighting |
| **remark-gfm** | 4.0.x | GitHub Flavored Markdown |
| **rehype-highlight** | 7.0.x | Highlight.js integration |
| **react-d3-tree** | 3.6.x | Tree visualization (roadmaps) |

### UX Enhancements

| Package | Version | Purpose |
|---------|---------|---------|
| **react-hot-toast** | 2.6.x | Toast notifications |
| **react-toastify** | 11.0.x | Additional toast system |
| **emoji-mart / emoji-picker-react** | latest | Emoji picker for messaging |
| **lottie-react** | 2.4.x | Lottie animations |
| **react-scroll** | 1.9.x | Smooth scrolling |
| **jwt-decode** | 4.0.x | JWT token decoding |
| **clsx** | 2.1.x | Conditional class names |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| **vitest** | 4.0.x | Test runner |
| **@testing-library/react** | 16.3.x | React testing utilities |
| **@testing-library/jest-dom** | 6.9.x | DOM testing matchers |
| **jsdom** | 28.x | DOM simulation for tests |
| **eslint** | 9.22.x | Code linting |
| **@vitejs/plugin-react** | 4.3.x | React Fast Refresh for Vite |

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'feat: add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing component structure (`components/user/`, `components/admin/`)
- Use Redux Toolkit slices for new state management needs
- Add tests for new components using Vitest + React Testing Library
- Use TailwindCSS utility classes for styling
- Ensure all routes are properly guarded with `ProtectedRoute`

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat:     New feature
fix:      Bug fix
docs:     Documentation changes
style:    Code style changes (formatting)
refactor: Code refactoring
test:     Adding or updating tests
chore:    Build process or tool changes
```

---

## 📄 License

This project is licensed under the **ISC License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ by the SkillHub Team
</p>
