# Design System Strategy: The Precision Ledger

This document defines the visual and structural foundations of the design system. Our goal is to move beyond the "standard SaaS" aesthetic and create a high-end, editorial experience that feels like a precision financial instrument. We prioritize tonal depth, typographic authority, and intentional asymmetry to convey trust and modern sophistication.

---

## 1. Creative North Star: The Precision Ledger
The design system is built on the concept of **"The Precision Ledger."** 

Unlike traditional banking apps that feel cluttered and bureaucratic, this system treats financial data as high-art. We achieve this by blending the clinical accuracy of monochromatic "Berkeley Mono" typography with the luxurious, atmospheric depth of "Linear-style" glassmorphism. We do not use "widgets"; we use **Monoliths**—clean, authoritative containers that command attention through scale and negative space.

---

## 2. Color & Atmospheric Surface Hierarchy
The palette is rooted in the "Void"—a deep, obsidian base that allows our data and primary accents to emerge as light sources.

### The "No-Line" Rule
**Explicit Instruction:** 1px solid borders are prohibited for sectioning. Structural boundaries must be defined through background shifts or tonal transitions. To separate a sidebar from a main feed, use a shift from `surface` to `surface-container-low`. 

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers of tinted glass. Use the `surface-container` tiers to create "nested" depth:
*   **Base Layer:** `surface` (#0e141a) for the overall application canvas.
*   **Secondary Sections:** `surface-container-low` for navigation bars or side panels.
*   **Content Cards:** `surface-container-highest` for primary interactive elements.
*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section to create a soft, natural lift.

### Glass & Signature Textures
For floating elements (modals, tooltips, or top-level navigation), use **Glassmorphism**. Combine `surface-container-high` with a 12px-20px backdrop-blur and a 15% opacity `outline`. Main CTAs should utilize a subtle linear gradient from `primary` (#c0c1ff) to `primary_container` (#8083ff) to provide "soul" and professional polish.

---

## 3. Typography: Editorial Authority
Our typography strategy contrasts the humanistic "Inter" with the mechanical precision of "Berkeley Mono."

*   **Display & Headlines:** Use `display-lg` and `headline-lg` (Inter Bold) with tight letter-spacing (-0.02em). These should feel like magazine headers—bold, unapologetic, and large.
*   **The Monospaced Layer:** All financial amounts, dates, and timestamps MUST use **JetBrains Mono / Berkeley Mono**. This ensures that "1,000.00" and "8,888.88" align perfectly in lists, conveying technical reliability.
*   **Label Hierarchy:** Use `label-sm` in all-caps with 0.05em letter-spacing for metadata. This provides an "architectural" feel to the data density.

---

## 4. Elevation & Depth
In this design system, shadows are light, not dark.

*   **Ambient Shadows:** For floating elements, use extra-diffused shadows with a blur radius of 30px-60px. The shadow color must be a tinted version of the `primary` accent at 8% opacity, creating an "Indigo Glow" rather than a grey smudge.
*   **The "Ghost Border" Fallback:** If a container requires definition against a similar background, use a "Ghost Border"—the `outline-variant` token at 15% opacity.
*   **Tonal Layering:** Avoid shadows for static cards. Instead, use the difference between `surface-container-lowest` and `surface-container` to define edges.

---

## 5. Components

### Buttons (High-Gloss Precision)
*   **Primary:** A gradient-filled container using `primary` to `primary_container`. Text should be `on_primary`. Corner radius: `xl` (1.5rem).
*   **Secondary:** Ghost-style. No background. A 10% opacity `outline` that brightens to 40% on hover.
*   **Interaction:** On hover, primary buttons should emit a subtle `primary` glow shadow.

### Inputs & Expense Fields
*   **Structure:** No bottom lines or full borders. Use a solid `surface_container_high` background with a `sm` (0.25rem) corner radius.
*   **Focus State:** Transition the background to `surface_container_highest` and add a 1px "Ghost Border" of `primary` at 30% opacity.

### Transaction Lists
*   **The Divider Ban:** Strictly forbid the use of divider lines between transactions. 
*   **Spacing as Separation:** Use 12px of vertical white space. Use `secondary` (Income Green) and `tertiary` (Expense Red) only for the currency amounts, keeping the merchant name in `on_surface`.

### The "Pulse" Metric (Contextual Component)
A custom component for Spendly. A large `display-md` monospaced number (Total Balance) sitting on a `surface_bright` background with a subtle, animated `primary` glow emanating from behind the text.

---

## 6. Do’s and Don’ts

### Do
*   **DO** use monochromatic tones (`on_surface_variant`) for 80% of the UI, saving `primary` for "Momentum" actions.
*   **DO** use `xl` (1.5rem) roundedness for large containers to soften the "Brutalist" mono typography.
*   **DO** utilize negative space. If a screen feels crowded, increase the padding rather than adding a border.

### Don’t
*   **DON’T** use 100% white text for body copy. Use `on_surface` (#dee3ec) to reduce eye strain and maintain a premium feel.
*   **DON’T** use standard "Drop Shadows." If it doesn't look like a soft light source, it doesn't belong in this design system.
*   **DON’T** use Inter for currency. The design system loses its "Financial Instrument" feel the moment a number is proportional rather than monospaced.

---

## 7. Token Reference Summary

| Role | Token / Hex | Application |
| :--- | :--- | :--- |
| **Canvas** | `background` (#0e141a) | Global background |
| **Surface** | `surface_container` (#1b2027) | Standard card base |
| **Primary** | `primary` (#c0c1ff) | Signature Indigo Glow / Primary Action |
| **Success** | `secondary` (#4edea3) | Income / Positive Delta |
| **Error** | `tertiary` (#ffb2b7) | Expenses / Budget Overages |
| **Border** | `outline_variant` @ 15% | Ghost Borders only |
| **Radius** | `xl` (1.5rem) | Main Containers / Buttons |