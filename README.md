# Love Link 💖

Love Link is a playful, interactive web application designed to create personalized "Love Requests" for your crush or friends. It features a fun, gamified UI where the "No" button actively dodges cursor movements, making rejection nearly impossible, while meticulously tracking user behavior for analytics.

![Love Link Demo](https://placehold.co/600x400/ff69b4/white?text=Love+Link+Preview)

## ✨ Features

- **Interactive "No" Button**: The button actively evades the user's cursor, speeding up with each attempt, and eventually entering a "Final Phase".
- **Personalized Links**: Generate unique links with the sender's name ("Creator") and the recipient's name.
- **Micro-Interactions**: Confetti explosions, dynamic text changes, and smooth animations using Framer Motion.
- **Behavioral Analytics**: Tracks detailed user engagement metrics without invading privacy:
  - **Dodge Count**: How many times the user tried to click rejection.
  - **Mouse Distance**: Total distance the user moved their mouse (in pixels).
  - **Decision Time**: Exact time taken to accept or (try to) reject.
- **Admin Dashboard**: A premium, password-protected dashboard to view live activity feeds and detailed statistics.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Database**: MongoDB (via **Mongoose** for strict schema validation)
- **Styling**: TailwindCSS
- **Animations**: Framer Motion & Canvas Confetti
- **Language**: TypeScript

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18+)
- MongoDB (Running locally or via Atlas)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/love-link.git
    cd love-link
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add the following:

    ```env
    # MongoDB Connection String (Required)
    MONGODB_URL="mongodb://localhost:27017/funnyproject"

    # Admin Dashboard Password (Required)
    ADMIN_PASSWORD="supersecretadmin"
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  **Open the app**
    - Public UI: `http://localhost:3000`
    - Admin Dashboard: `http://localhost:3000/admin`

## 📖 How to Use

### Creating a Link
1.  Open the homepage.
2.  Enter **Your Name** (Creator) and **Their Name** (Recipient).
3.  Click **Generate Link**.
4.  Copy the link and send it to them!

### Admin Dashboard
1.  Navigate to `/admin`.
2.  Enter the admin password configured in your `.env`.
3.  View detailed analytics:
    - **Live Activity Feed**: See real-time interactions.
    - **Engagement**: Track how many "Rejects" or "Dodges" occurred.
    - **Coordinates**: View precise click coordinates for debugging user behavior.

## 📂 Project Structure

```
├── app/
│   ├── api/            # Backend API Routes (Next.js)
│   │   ├── events/     # Strict event logging key
│   │   └── link/       # Link creation endpoint
│   ├── l/[linkId]/     # Dynamic Recipient Page
│   └── admin/          # Admin Dashboard
├── lib/
│   ├── db.ts           # Mongoose Singleton Connection
│   └── logger.ts       # Structured Error Logging
├── models/             # Mongoose Schemas
│   ├── Link.ts         # Link Schema (receiverName, creatorName)
│   └── Event.ts        # Event Schema (Strict Enum Types)
└── public/             # Static Assets
```

## 🛡️ Architecture & Standards

This project adheres to strict backend engineering standards:
- **No LocalStorage**: All analytics are persisted immediately to MongoDB.
- **Strict Schemas**: Mongoose models enforce data integrity (`receiverName`, `eventType`).
- **Professional Logging**: Centralized logging utility for distinct error tracking.
- **Error Handling**: API routes return standardized error codes (500 for internal failures, 400 for validation).

---

Made with ❤️ and TypeScript.
