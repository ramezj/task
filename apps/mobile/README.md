# Mini Shop Mobile App

A React Native mobile application for customers to browse products and manage their orders.

## Tech Stack

- **Framework:** [Expo](https://expo.dev/) (React Native)
- **Styling:** [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **State Management:** TanStack Query
- **Navigation:** Expo Router
- **Auth/Database:** Supabase

## Prerequisites

- Node.js (v18+)
- npm
- Expo Go app on your physical device (optional, for testing)

## Configuration

Create a `.env` file in the root of `apps/mobile/` with the following variables:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_API_URL=http://localhost:8080
```

*Note: If testing on a physical device, replace `localhost` with your machine's local IP address (e.g., `http://192.168.1.50:8080`).*

## Installation

```bash
cd apps/mobile
npm install
```

## Running the App

### Start Expo Dev Server
```bash
npm run start
```

### Run on iOS Simulator
```bash
npm run ios
```

### Run on Android Emulator
```bash
npm run android
```

## Features

- **Product Catalog**: Browse and search through available products.
- **Cart System**: Add products to a cart and manage quantities.
- **Checkout**: Place orders securely.
- **Order History**: View past orders and their current status.
- **Auth**: Sign up and Sign in functionality.

## Troubleshooting

- **API Connection**: Ensure the `EXPO_PUBLIC_API_URL` is accessible from your device/emulator.
- **Metro Bundler**: If the app hangs, try clearing the cache: `npx expo start -c`.
