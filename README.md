# Ticket to Ride

A modern web application built with React, TypeScript, and Firebase.

## Authors

[Riddhi Munjewar](https://github.com/rmunjewar)
[Clara Delzell](https://github.com/cdelzell)
[Noah Janke](https://github.com/njanke42)
[Ty Lovgren](https://github.com/ShockWav3456)

## Code Structure

```
choochoo/
├── __mocks__/
├── __tests__/
├── .firebase/    # hosting information
├── coverage/     # testing coverage reports/information
├── dist/      # for deployment (stretch goal)
├── favicon/
├── node_modules/
├── src/
│   ├── assets/      # images for our site
│   ├── backend/     # contains all logic for the game
│   ├── editProfile/
│   ├── firebase/    # contains firebase read/write methods
│   ├── joinGamePage/
│   ├── lobbyPage/
│   ├── mainGamePage/
│   ├── profile/
│   ├── signIn/
│   ├── signUp/
│   ├── types/
│   ├── imageImports.tsx      # imported images for hosting
│   ├── index.css
│   ├── main.jsx
│   └── vite-env.d.ts
├── README.md     # this read.me!
├── config, json, and other miscellaneous files
```

## Features

- Modern React with TypeScript
- Firebase integration
- Real-time updates
- Responsive design

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- Git

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/tickettoride.git
cd tickettoride
cd choochoo
```

2. Install dependencies (in both the ticketToRide directory and the choochoo directory):

```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the choochoo directory and add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Running the Application

To start the development server:

```bash
npm run dev
```

## Testing

To run tests:

```bash
npm test
```
