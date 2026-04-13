# Sterling

An AI-powered celiac dining safety app that helps people with celiac disease navigate restaurant dining safely. Sterling provides menu scanning, personalized risk assessments, multilingual allergy communication cards, and travel preparation tools.

## Features

### Onboarding
- Multi-step personalized onboarding flow that captures gluten sensitivity level, cross-contamination tolerance, and dining goals
- Generates a customized allergy card based on user responses

### Menu Scanning
- Camera-based menu scanner with photo upload support
- AI-powered risk assessment categorizing menu items as **Safe**, **Ask First**, or **Avoid**
- Detailed item view with ingredient analysis, cross-contamination notes, suggested questions for staff, and substitution recommendations

### Allergy Card
- Full-screen, high-contrast card designed to show restaurant staff
- Multilingual translation support (English, Spanish, Italian, Japanese, French, German, Portuguese, Korean, Chinese, Thai, Arabic)
- Customizable sections with editable content and font sizes
- Share via QR code or copy text

### Explore
- Interactive map (Leaflet) with color-coded restaurant pins indicating celiac safety level
- Filterable by safety rating, cuisine type, distance, and more
- Restaurant detail pages with celiac-specific reviews, menu highlights, and pre-visit preparation tips
- Bookmark system for saving restaurants

### Trip Planning
- Create and manage travel itineraries with destination-specific celiac dining guidance
- Save restaurants per trip with safety ratings and notes
- Pre-loaded sample trips (Tokyo, Rome) demonstrating the workflow

### Profile
- View and edit personal sensitivity profile
- Manage allergy card preferences

## Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS 4 with shadcn/ui components (Radix UI primitives)
- **Routing:** React Router 7
- **Maps:** Leaflet / React Leaflet
- **Animations:** Motion (Framer Motion)
- **Typography:** Lora (headings), Geist (body)
- **Design Language:** Custom warm palette with olive, gold, and earth tone tokens
- **Package Manager:** pnpm (workspace)

## Getting Started

```bash
pnpm install
pnpm dev
```

The app runs at `http://localhost:5173` and is optimized for mobile viewports (max 430px width).

## Project Structure

```
src/
  main.tsx              # Entry point
  app/
    App.tsx             # Root component with router and state provider
    store.tsx           # React Context state (user profile, trips, settings)
    routes.tsx          # All application routes
    components/
      OnboardingWelcome.tsx   # Welcome screen
      OnboardingQuestion.tsx  # Multi-step onboarding questions
      OnboardingCard.tsx      # Allergy card preview after onboarding
      ScanCamera.tsx          # Camera/photo upload for menu scanning
      ScanReview.tsx          # Review captured menu photos
      ScanResults.tsx         # AI risk assessment results
      ItemDetail.tsx          # Expanded menu item analysis
      AllergyCard.tsx         # Full-screen allergy communication card
      EditCardPage.tsx        # Card section editor
      ExploreMap.tsx          # Map-based restaurant discovery
      RestaurantDetail.tsx    # Restaurant detail page
      Bookmarks.tsx           # Saved restaurants
      ContactRestaurant.tsx   # Contact/reservation helper
      TravelGuide.tsx         # Trip planning and management
      Profile.tsx             # User profile settings
      BottomTabs.tsx          # Bottom navigation bar
      ui/                     # shadcn/ui component library
  styles/
    index.css           # Global styles
    theme.css           # Theme variables and typography
    tailwind.css        # Tailwind directives
    fonts.css           # Lora and Geist font imports
```

## Design

The original design is available on [Figma](https://www.figma.com/design/0Zfd7kpcpAs2UhbbywMfKn/Mobile-app-creation).

Risk-level color coding:
- **Safe / Low risk:** `#6d7854` (olive green)
- **Caution / Ask first:** `#fac905` (gold)
- **Avoid / High risk:** `#DA1E28` (red)
- **Interactive elements:** `#525a3f` (dark olive)

## Attributions

- UI components from [shadcn/ui](https://ui.shadcn.com/) (MIT License)
- Photos from [Unsplash](https://unsplash.com) (Unsplash License)
