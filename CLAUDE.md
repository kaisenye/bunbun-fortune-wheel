# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```sh
npm run dev       # Start dev server on http://localhost:8080
npm run build     # Production build
npm run build:dev # Development build (includes component tagger)
npm run lint      # Lint code with ESLint
npm run preview   # Preview production build
```

## Architecture Overview

### Application Structure

This is a **single-page fortune wheel application** built with React + Vite. Users spin a wheel to win prizes with weighted probabilities.

**Entry Point**: `src/main.tsx` → `src/App.tsx` → `src/pages/Index.tsx`

**Key Components**:
- `SpinWheel.tsx` - Core wheel logic, rendering, and animation
- `PrizeModal.tsx` - Displays winning prize after spin
- `src/data/prizes.ts` - Prize definitions and localStorage management

### Prize System

**Prize Configuration** (`src/data/prizes.ts`):
- Each prize has: id, name, emoji, color, quantity, and `chanceWeight`
- Higher `chanceWeight` = higher probability of winning
- Prizes are filtered by available quantity before selection

**State Management**:
- Prize quantities stored in **localStorage** (`slime-wheel-prizes` key)
- Initialized from `initialQuantity` on first load
- Updated after each spin; quantities persist across sessions
- Reset via admin button (password: `4337` hardcoded in `Index.tsx:8`)

### Wheel Rendering

The wheel is rendered as an **SVG** with dynamically generated segments:
- Segments calculated using polar coordinates (angles → x,y positions)
- Each segment is a `<path>` element using SVG arc commands
- Rotation handled via CSS `transform: rotate()` with cubic-bezier easing
- Top pointer (triangle) is a CSS border trick positioned absolutely

**Spin Mechanics**:
1. Prize selected based on weighted random algorithm (`SpinWheel.tsx:17-30`)
2. Target rotation calculated to align prize with top pointer
3. Wheel rotates 5 full spins + target angle over 4 seconds
4. After animation, prize modal shown and quantity decremented

### TypeScript Configuration

- Path alias: `@/*` → `./src/*`
- Relaxed strictness: `noImplicitAny`, `strictNullChecks`, `noUnusedLocals` all disabled
- Split config: `tsconfig.json` references `tsconfig.app.json` + `tsconfig.node.json`

### Styling

- **Tailwind CSS** with shadcn/ui components
- Custom theme uses CSS variables: `--background`, `--foreground`, `--primary`, `--accent`, etc.
- Components in `src/components/ui/` are shadcn primitives (don't modify directly)

### Development Mode

In development, the `lovable-tagger` plugin runs to add data attributes to components for the Lovable platform.

## Important Implementation Details

- **Wheel pointer alignment**: Prize segments start at -90° (top) for proper alignment with pointer
- **Random offset**: Small random offset within each segment prevents users from gaming the system
- **Out of stock**: Segments with 0 quantity are visually dimmed (opacity: 0.4) and excluded from selection
- **Admin reset**: Protected by password prompt; resets all quantities to `initialQuantity` values
