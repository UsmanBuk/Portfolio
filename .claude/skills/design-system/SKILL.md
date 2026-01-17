---
name: design-system
description: Portfolio design tokens, CSS variables, and component patterns. Use when editing HTML, CSS, or styling portfolio pages.
allowed-tools: Read, Grep, Glob
---

# Portfolio Design System

## CSS Variables (from style.css :root)

### Colors
```css
/* Backgrounds */
--smoky-black: hsl(0, 0%, 7%);        /* Page background */
--eerie-black-1: hsl(240, 2%, 13%);   /* Card backgrounds */
--onyx: hsl(240, 1%, 17%);            /* Borders */
--jet: hsl(0, 0%, 22%);               /* Secondary borders */

/* Text */
--white-1: hsl(0, 0%, 100%);          /* Headings */
--white-2: hsl(0, 0%, 98%);           /* Body text */
--light-gray: hsl(0, 0%, 84%);        /* Secondary text */

/* Accent */
--orange-yellow-crayola: hsl(45, 100%, 72%);  /* Primary gold */
--vegas-gold: hsl(45, 54%, 58%);              /* Secondary gold */
```

### Typography
```css
--ff-poppins: 'Poppins', sans-serif;
--fs-1: 24px;  /* Titles */
--fs-2: 18px;  /* Section titles */
--fs-5: 15px;  /* Body default */
--fs-6: 14px;  /* Small text */
```

## Component Patterns

Always use CSS variables - never hardcode colors. See [patterns.md](patterns.md) for full component examples.
