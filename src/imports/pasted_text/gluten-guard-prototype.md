Create a high-fidelity mobile app prototype for "GlutenGuard" — an AI-powered celiac dining safety app built on IBM's Carbon Design System for mobile (iOS). The app helps people with celiac disease navigate restaurant dining safely using AI menu scanning, personalized risk assessments, allergy communication cards, and travel preparation tools.
Design system: IBM Carbon Design System. Use Carbon's color tokens, typography scale, spacing grid (8px base), and component library (Tiles, Tags, Accordions, Buttons, ProgressIndicator, Search, Tabs). The aesthetic should be clean, clinical-grade trustworthy, with generous whitespace. Not playful — this is a medical safety tool. But warm, not cold.
Color mapping for risk levels:

Safe/Low risk: Carbon $support-success green (#198038) — used for safe item badges and the "Safe Options" group
Caution/Ask first: Carbon $support-warning yellow (#F1C21B) — used for items requiring server clarification
Avoid/High risk: Carbon $support-error red (#DA1E28) — used for items the user should not order
Primary interactive: Carbon $interactive-01 blue (#0F62FE) — CTAs, links, active states
Backgrounds: White (#FFFFFF) with $ui-01 (#F4F4F4) for card surfaces

Navigation: Bottom tab bar with 4 tabs — Scan (camera icon, default/home), Explore (map icon), Travel (plane icon), Profile (person icon). Active tab uses $interactive-01 blue. Inactive tabs use $text-secondary gray.

Generate the following screens:
SCREEN 1: ONBOARDING — WELCOME
Full-screen welcome. App logo "GlutenGuard" centered in upper third. Tagline below: "Dine with confidence." Illustration or abstract visual suggesting safety/protection (not food imagery — avoid triggering anxiety). Primary button "Get Started" (Carbon primary button, full width, bottom of screen). Ghost button below: "I already have an account." Clean white background.
SCREEN 2: ONBOARDING — SEVERITY QUESTION 1 OF 3
Carbon ProgressIndicator at top showing step 1 of 3. Question in $heading-03: "How does your body react to gluten?" Four Carbon StructuredList rows, each as a selectable option with radio button:

Row 1: "Very sensitive" — subtitle: "Even tiny traces or cross-contamination makes me sick"
Row 2: "Moderate" — subtitle: "I have clear symptoms but can handle small amounts"
Row 3: "Mild or delayed" — subtitle: "My symptoms are manageable or take time to appear"
Row 4: "Sensitivity by choice" — subtitle: "I prefer to avoid gluten but don't have celiac"
Primary button "Continue" at bottom. Ghost button "Skip" above it.

SCREEN 3: ONBOARDING — SEVERITY QUESTION 2 OF 3
Same layout as Screen 2. Progress step 2 of 3. Question: "How do you handle cross-contamination?" Three options:

"Strictly avoid it" — subtitle: "Shared cookware, fryers, or surfaces are not safe for me"
"Cautious but flexible" — subtitle: "I try to avoid it but don't always ask"
"Not a major concern" — subtitle: "I focus on ingredients, not preparation"

SCREEN 4: ONBOARDING — SEVERITY QUESTION 3 OF 3
Same layout. Progress step 3 of 3. Question: "What brought you here today?" Four options:

"Eating out safely" — subtitle: "I want help navigating restaurant menus"
"Traveling with celiac" — subtitle: "I need support dining in unfamiliar places"
"I'm newly diagnosed" — subtitle: "I want to learn what's safe"
"Helping someone I know" — subtitle: "A friend or family member has celiac"

SCREEN 5: ONBOARDING — PROFILE CARD PREVIEW
Header: "Here's your allergy card." Below, a large card component (Carbon Tile with colored left border based on severity — red for extreme, yellow for moderate, green for mild). Card content:

Name: "Your Name" (editable)
Severity bar: visual indicator (e.g., filled segments)
"I have celiac disease" (bold)
Key restrictions (personalized from answers)
"What I CAN eat:" list
Language badge: "English" with dropdown
Below card: Primary button "Looks good — let's go." Ghost button "Edit my card."

SCREEN 6: SCAN — CAMERA VIEWFINDER (Home Screen)
Full-screen camera viewfinder with dark overlay at top and bottom. Top bar: back arrow (if navigated from elsewhere) and "GlutenGuard" wordmark in white. Center: clean viewfinder frame (rounded corners, subtle white border). Bottom overlay (dark, translucent): Large circular capture button (center, white with blue ring). Small gallery icon (bottom left). Small flash toggle (bottom right). Helper text above capture button: "Point at a menu and tap to scan." This screen should feel like a camera app, not a complex interface. Bottom tab bar visible below.
SCREEN 7: SCAN — ASSESSMENT RESULTS
Top bar: Restaurant name "Osteria Francescana" with cuisine badge "Italian" (Carbon Tag). Below: Overall note in Carbon InlineNotification (informational): "This restaurant has a gluten-free menu. 4 celiac reviews available."
Main content: Carbon Accordion with 3 sections.

Section 1 (expanded by default): Header "✅ Safe Options (4 items)" with green Tag. Contains 4 Carbon Tiles:

"Grilled Branzino" — subtitle "White fish, lemon, olive oil" — Green Tag "Low Risk"
"Caprese Salad" — subtitle "Fresh mozzarella, tomato, basil" — Green Tag "Low Risk"
"Risotto ai Funghi" — subtitle "Arborio rice, mushrooms, parmesan" — Green Tag "Low Risk" — small note "Ask: Is the broth gluten-free?"
"Grilled Vegetables" — subtitle "Seasonal vegetables, olive oil" — Green Tag "Low Risk"


Section 2 (collapsed): Header "⚠️ Ask First (3 items)" with yellow Tag.
Section 3 (collapsed): Header "🚫 Avoid (5 items)" with red Tag.

Floating action button at bottom right: allergy card icon (blue circle with white card icon). Second FAB above it: chat icon.
SCREEN 8: SCAN — ITEM DETAIL (Expanded)
Triggered by tapping "Risotto ai Funghi" from Screen 7. Full-width expanded card or bottom sheet. Content:

Item name "Risotto ai Funghi" with Green Tag "Low Risk"
Risk confidence: "High confidence" with filled indicator dots
Section "Ingredients": "Arborio rice, mushroom, parmesan, butter, white wine, vegetable broth" — "vegetable broth" highlighted in yellow with tooltip icon
Section "Cross-contamination notes": "Risotto is typically prepared in its own pot. Main risk is the broth — some restaurants use broth containing gluten."
Section "Questions to ask": Numbered list — "1. Is your vegetable broth gluten-free or homemade? 2. Is the risotto prepared in a dedicated pot?"
Section "Substitutions": "If broth contains gluten, ask for olive oil and water-based preparation."
Action row: "Add to my order" toggle (Carbon Toggle), "Share" icon button.

SCREEN 9: CHAT ASSISTANT
Bottom sheet (70% height) overlaying Screen 7. Rounded top corners. Handle bar at top.

Context greeting: "I see you're looking at Osteria Francescana's menu. What would you like to know?"
Suggested prompt chips (horizontal scroll): "Is the pasta safe?" | "What should I ask the server?" | "Compare with another restaurant" | "Translate my allergy card"
Chat history showing one exchange:

User: "Is the tiramisu safe?"
Assistant: Red Tag "Avoid" followed by: "Tiramisu contains ladyfinger cookies (wheat flour) and is not safe for celiac. There's no practical substitution for this dish. I'd recommend the panna cotta instead — it's naturally gluten-free if no cookie crumble is added. Ask: 'Does the panna cotta have any cookie or biscuit garnish?'"
Below response: Quick action buttons — "Show allergy card" | "Scan another menu"


Text input at bottom with send button and camera icon.

SCREEN 10: ALLERGY CARD — FULL SCREEN
Full-screen modal (no tab bar). White background. Large, high-contrast layout designed to be shown to restaurant staff.

Top: "Show this to your server" (small gray text) with close X button.
Card fills most of screen:

Severity indicator: wide colored bar at top (red for severe)
Large bold text: "I have celiac disease"
Clear text: "I cannot eat anything containing wheat, barley, rye, or oats."
Bold: "Cross-contamination is dangerous for me."
Specifics: "This means: No shared fryers. No shared cutting boards. No sauces from jars used with bread. Even small crumbs can make me very ill."
Divider line
"I CAN safely eat:" — "Rice, corn, potatoes, vegetables, fruit, meat, fish, eggs, dairy, beans"
Language selector at bottom: Flag icon + "English" dropdown → "Translate to Italian" etc.


Below card: "Share via QR" button and "Copy text" button.

SCREEN 11: ALLERGY CARD — TRANSLATED (Italian)
Same layout as Screen 10 but all card text in Italian. Language selector shows Italian flag + "Italiano." Back/close button at top. Maintains same visual hierarchy and color coding. The severity bar color and icons remain universal (no translation needed).
SCREEN 12: EXPLORE — MAP VIEW
Top: Carbon Search component ("Search restaurants, cuisines..."). Below search: filter chips (horizontal scroll) — "Celiac-Appropriate" | "GF Menu" | "All" | "Near Me" | "Good for Groups."
Map fills remaining screen (use placeholder map image). Color-coded pins:

2–3 green pins (Celiac-Appropriate)
3–4 yellow pins (GF Menu Available)
Several gray pins (Not rated)
One pin selected, showing a preview card floating above the map:
"Senza Gluten" — "Italian · 0.3 mi" — Green badge "Celiac-Appropriate"
Star rating "4.8 from 23 celiac reviews"
Preview text: "Dedicated GF kitchen. Amazing pasta."
"View Details →"
Map/list toggle button (top right of map area). Bottom tab bar visible.

SCREEN 13: EXPLORE — RESTAURANT DETAIL
Header image (placeholder restaurant photo). Below:

Name "Senza Gluten" — Cuisine "Italian" Tag — Distance "0.3 mi"
Prominent badge: Green Tile "Celiac-Appropriate" with subtitle "Verified: Dedicated gluten-free kitchen, separate prep areas, staff trained on cross-contamination."
Section "What celiac diners say" — 2–3 review cards with star rating, severity badge of reviewer ("Severe celiac"), and review text.
Section "Menu highlights" — 3–4 item cards with risk badges (all green for this restaurant).
Section "Before you go" — "Questions to ask when you arrive:" numbered list. "Reservation note:" pre-written text with "Copy" button ("One guest has celiac disease and requires gluten-free preparation with no cross-contamination.").
Action bar at bottom: "Scan Their Menu" primary button, "Save" bookmark icon, "Share" icon.

SCREEN 14: TRAVEL — DESTINATION GUIDE (Japan)
Header: "Your Trip to Japan" with dates "May 12–22, 2026" and edit icon. Below:

Carbon InlineNotification (warning): "Celiac awareness in Japan is limited. Soy sauce (which contains wheat) is used in most dishes. Extra preparation recommended."
Section "Cuisine overview": Card with key facts — "Naturally GF: Sashimi, plain rice, grilled meats. Hidden gluten: Soy sauce, tempura batter, miso (some types), udon/ramen noodles. Tip: Tamari (wheat-free soy sauce) is available at some restaurants — ask for 'tamari shouyu.'"
Section "Your allergy card in Japanese": Preview of translated card (Japanese text visible). "Save for offline" button.
Section "Useful phrases": List — "I have celiac disease" → "私はセリアック病です" — with speaker icon for pronunciation.
Section "Restaurants near your hotel": Mini-map with 3–4 pins. List of 3 saved restaurants below.
Section "Pack list": Checklist — "GF snacks for flights" ✓ | "Tamari sauce packets" ✓ | "Printed allergy cards" ✓