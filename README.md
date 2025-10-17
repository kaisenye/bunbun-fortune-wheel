# Bunbun Fortune Wheel

A React-based fortune wheel application for prize giveaways.

## Tech Stack

- **Framework**: Vite + React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router
- **State**: React Query + Local Storage

## Development

```sh
# Install dependencies
npm i

# Start dev server (http://localhost:8080)
npm run dev

# Build for production
npm run build

# Build for development
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Project Structure

- Path alias `@/*` maps to `./src/*`
- Prize data stored in localStorage
- Admin password: `4337` (hardcoded in Index.tsx:8)
