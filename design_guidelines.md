# Design Guidelines: Soccer Match Timer & Referee Match Report System

## Design Approach

**Selected Framework:** Material Design with sports-utility customization
**Rationale:** This is a utility-focused, information-dense application requiring reliability, clarity, and touch-friendly mobile interactions. Material Design provides strong visual feedback systems, clear component patterns, and robust form handling—essential for preventing accidental inputs during live match conditions.

**Key Design Principles:**
- Clarity over decoration: Every element must be immediately understandable
- Touch-optimized: Minimum 48px touch targets, generous spacing between interactive elements
- Confidence through feedback: Clear visual states for all actions
- Professional athletic aesthetic: Clean, authoritative, sports-appropriate

---

## Typography System

**Primary Font:** Roboto (via Google Fonts CDN)
**Secondary Font:** Roboto Condensed for data tables and compact information

**Hierarchy:**
- **H1 (Page Titles):** 32px/40px, font-weight-700, tracking-tight
- **H2 (Section Headers):** 24px/32px, font-weight-600
- **H3 (Subsections):** 20px/28px, font-weight-600
- **Body Large:** 18px/28px, font-weight-400 (for timer, scores, critical info)
- **Body Regular:** 16px/24px, font-weight-400 (forms, descriptions)
- **Body Small:** 14px/20px, font-weight-400 (labels, helper text)
- **Caption:** 12px/16px, font-weight-400, uppercase tracking for metadata
- **Timer Display:** 56px/64px, font-weight-700, tabular-nums for countdown/match time
- **Score Display:** 48px/56px, font-weight-700, tabular-nums

---

## Layout System

**Spacing Scale (Tailwind units):** 2, 4, 6, 8, 12, 16, 20, 24
- Micro spacing (within components): p-2, gap-2
- Standard component padding: p-4, p-6
- Section spacing: py-8, py-12
- Major separations: py-16, py-20
- Touch target minimum: h-12, w-12 (48px)

**Container System:**
- Max-width: max-w-2xl (672px) for mobile-optimized layouts
- Form sections: max-w-xl (576px) for optimal input field length
- Full-width timer interface: w-full with controlled internal max-width
- Edge padding: px-4 (mobile), px-6 (tablet), px-8 (desktop)

**Grid Patterns:**
- Forms: Single column, full-width inputs with stacked labels
- Timer interface: Flex-based centered layout with prominent timer
- Score display: Grid with team names flanking center timer
- Match report: Single column with bordered sections

---

## Component Library

### Form Components

**Text Inputs:**
- Height: h-12 (48px touch target)
- Padding: px-4, py-3
- Border: 2px solid, rounded-lg
- Font: 16px (prevents iOS zoom on focus)
- Label positioning: Above input, mb-2, font-weight-500
- Placeholder: Lower opacity, italic
- Error state: Red border, error text below at text-sm with alert icon
- Focus state: Prominent border, subtle shadow

**Textarea:**
- Min-height: h-24 (4 rows default)
- Padding: p-4
- Same border/focus treatment as text inputs
- Character counter: Bottom-right, text-xs

**Date/Time Pickers:**
- Native HTML5 inputs styled to match design system
- Height: h-12
- Clear icon/reset capability

**Buttons - Primary (Start Match, Download CSV):**
- Height: h-14 (56px for prominence)
- Padding: px-8, py-4
- Font: 18px, font-weight-600, uppercase tracking
- Rounded: rounded-xl
- Full-width on mobile, auto on larger screens
- Disabled state: Reduced opacity, cursor-not-allowed

**Buttons - Secondary (Save Draft, Back):**
- Height: h-12
- Border: 2px solid
- Background: transparent
- Same padding/font as primary

**Buttons - Timer Controls (START/PAUSE/RESET):**
- Large square/rectangular buttons: min-w-32, h-20
- Prominent text: 20px, font-weight-700, uppercase
- Rounded: rounded-2xl
- Icons optional: Heroicons play/pause/refresh

### Timer Interface Components

**Main Timer Display:**
- Container: Centered, p-8, rounded-3xl with subtle border
- Timer digits: 56px, font-weight-700, tabular-nums, monospace feel
- Format: MM:SS with colon separator
- Stoppage time: Red treatment, smaller 36px below main timer with "+X:XX" prefix

**Scoreboard:**
- Grid layout: Three columns (Home | Timer | Away)
- Team names: 20px, font-weight-600, truncate if needed
- Score digits: 48px, font-weight-700, tabular-nums
- +/- buttons: Circular, w-12 h-12, positioned above/below score

**Countdown Overlay:**
- Full-screen centered overlay with semi-transparent backdrop
- Countdown number: 120px, font-weight-900
- Fade-in/out transitions: 300ms each
- "Ready" message before countdown starts

**Match Status Indicators:**
- Pill-shaped badges: px-6, py-2, rounded-full, uppercase, text-sm, font-weight-600
- States: "Pre-Match", "1st Half", "Half-Time", "2nd Half", "Match Complete"
- Positioned prominently above timer

### Confirmation Dialogs

**Modal Structure:**
- Centered overlay with backdrop blur
- Max-width: max-w-md
- Padding: p-6
- Rounded: rounded-2xl
- Drop shadow: Large, prominent

**Dialog Content:**
- Icon at top: w-16 h-16, warning/question icon from Heroicons
- Message: 18px, font-weight-600, text-center
- Context text: 14px, mt-2, text-center
- Button group: Grid with gap-3, mt-6
- Confirm button: Prominent styling
- Cancel button: Secondary styling

**Dialog Animation:**
- Scale-in entrance: 200ms
- Backdrop fade: 150ms

### Match Report Components

**Section Cards:**
- Border: 2px solid, rounded-xl
- Padding: p-6
- Margin between sections: mb-6
- Section headers: mb-4, pb-2, border-bottom

**Data Tables:**
- Full-width with responsive scroll
- Header row: font-weight-600, uppercase, text-sm, pb-2, border-bottom-2
- Data rows: py-3, border-bottom-1, text-base
- Alternate row treatment for readability
- Monospace font for time columns: tabular-nums

**Export Buttons Section:**
- Sticky bottom on mobile (sticky bottom-0)
- Background with blur backdrop
- Padding: p-6
- Border-top: 2px solid
- Buttons stacked on mobile, row on desktop

---

## Screen-Specific Layouts

### Screen 1: Pre-Match Form

**Structure:**
- Single-column layout, max-w-2xl centered
- Sections with clear visual grouping via borders or spacing
- Section headers: H2, mb-6, with subtle bottom border
- Field groups: mb-6
- Form footer with button(s): pt-8, border-top, sticky on mobile

**Field Layout Pattern:**
```
Label (font-weight-500, mb-2)
Input (h-12, full-width)
Helper/Error text (text-sm, mt-1)
Spacing to next field (mb-6)
```

### Screen 2: Live Timer Interface

**Layout Hierarchy:**
1. **Status Badge Bar:** Top, centered, py-4
2. **Team & Score Section:** Grid, gap-8, mb-8
   - Home Team (left): Name + Score + Controls
   - Timer (center): Prominent display
   - Away Team (right): Name + Score + Controls
3. **Timer Controls:** Centered row, gap-4, large touch targets
4. **Event Log Preview** (optional): Bottom, collapsible, scrollable

**Timer Prominence:**
- Timer container takes visual priority with size and positioning
- Scoreboard secondary but still prominent
- Controls clearly separated with generous spacing (gap-6)

**Responsive Approach:**
- Mobile: Stack teams vertically with timer between
- Tablet+: Horizontal layout as described

### Screen 3: Match Report

**Structure:**
- Single column, max-w-3xl
- Report header: Centered, py-8, border-bottom
- Content sections: Stacked cards with mb-6
- Tables: Responsive horizontal scroll where needed
- Post-match notes: Textarea with same styling as pre-match form
- Action buttons: Sticky footer bar on mobile, inline on desktop

---

## Interaction Patterns

**Double-Confirmation Flow:**
1. User taps action button
2. Modal slides in from center with scale animation
3. Message clearly states action and consequence
4. Two-button choice: "Confirm" (prominent) + "Cancel" (secondary)
5. Modal dismisses with scale-out animation
6. Action executes or cancels

**Form Validation:**
- Real-time validation on blur for each field
- Error messages appear below field immediately
- Submit button remains disabled until all required fields valid
- Success state: Subtle checkmark icon in input (optional)

**Navigation:**
- Linear flow: Form → Timer → Report
- Back navigation disabled during active timer
- "Start New Match" returns to beginning with confirmation

---

## Accessibility

- All interactive elements: Minimum 48px touch targets
- Form inputs: 16px font size minimum (prevents zoom on iOS)
- Color-independent state indicators (icons, borders, text)
- Proper label association for all form fields
- Semantic HTML throughout (form, button, time elements)
- Focus visible states for keyboard navigation
- ARIA labels for icon-only buttons

---

## Asset Requirements

**Icons:** Heroicons (outline style for most UI, solid for filled states)
- Timer: play, pause, refresh-cw
- Confirmation dialogs: exclamation-triangle, question-mark-circle, check-circle
- Forms: calendar, clock, map-pin, trophy
- Actions: download, arrow-right, plus, minus

**No images needed** - This is a utility application focused on functionality over marketing appeal.