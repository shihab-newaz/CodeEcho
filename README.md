# DEV_ASSESS - Developer Technical Assessment Platform

A high-craft, text-based technical questionnaire and developer assessment engine powered by OpenRouter open-weight models (Llama 3.3, Qwen 2.5 Coder), NextAuth.js, and an embedded SQLite database.

---

## Features

- **Precision Question Engine**: Evaluates conceptual depth across CS fundamentals and tricky code snippet runtime behavior / output predictions.
- **Open-Weight Models via OpenRouter**: Powered by `qwen/qwen-2.5-coder-32b-instruct` and `meta-llama/llama-3.3-70b-instruct` with automatic fallback to local SQLite database seeds.
- **Embedded SQLite Persistence**: Local file-based database (`dev_assess.db`) with modular SQL migrations and prepared statement queries for zero-overhead persistence.
- **NextAuth Authentication**: Email and password credentials provider with bcrypt password hashing and session state in the top navigation bar.
- **Utilitarian Minimalist Design**: Non-slop developer interface inspired by Linear and Vercel, paired with `Geist Sans` & `Geist Mono` typography.
- **Theme Support**: Clean Light & Dark mode support via `next-themes`.

---

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack, Standalone Output)
- **Database**: Embedded [SQLite](https://www.sqlite.org/) via [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) with Credentials Provider & bcryptjs
- **LLM Provider**: [OpenRouter](https://openrouter.ai/) (Qwen 2.5 Coder 32B, Llama 3.3 70B)
- **Typography & Styling**: Geist Sans, Geist Mono & [Tailwind CSS](https://tailwindcss.com/)

---

## Project Structure

```
├── app/
│   ├── (auth)/             # Minimalist Sign-in & Sign-up routes
│   ├── (root)/             # Dashboard & assessment runner routes
│   │   ├── page.tsx        # Dynamic topic selector dashboard
│   │   └── quiz/[topicId]/ # Assessment execution runner
│   ├── api/
│   │   ├── auth/           # NextAuth handlers & user registration endpoint
│   │   └── quiz/           # OpenRouter question generation endpoints
│   ├── globals.css         # Minimalist Light & Dark theme tokens
│   └── layout.tsx          # Root layout with Geist fonts & providers
├── components/
│   ├── auth/               # AuthCard & SessionProvider components
│   ├── common/             # Navbar & ThemeToggle components
│   ├── quiz/               # TopicSelector, QuizRunner & QuizResults scorecard
│   └── theme-provider.tsx  # Next-themes wrapper
├── lib/
│   ├── auth/               # NextAuth configuration options
│   ├── db/
│   │   ├── index.ts        # Database connection & migration runner
│   │   ├── migrations/     # Versioned SQL migration files (.sql)
│   │   └── statements/     # Modular prepared statements (users, topics, questions, assessments)
│   └── llm/                # OpenRouter client & structured question synthesis
└── types/
    └── quiz.ts             # TypeScript definitions for topics, questions & results
```

---

## Getting Started

### Prerequisites
- Node.js 18+ or 20+
- OpenRouter API Key (optional, falls back to SQLite database seeds if offline)

### Environment Variables
Create a `.env.local` file in the project root:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000
```

### Installation & Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production & Standalone Build

To compile a standalone production build:

```bash
npm run build
```

The standalone output is generated in `.next/standalone`, ready for deployment in containerized or server environments.

---

## License

MIT