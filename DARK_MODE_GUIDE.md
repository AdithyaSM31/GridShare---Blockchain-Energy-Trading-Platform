# 🌓 Dark Mode Feature - GridShare

## ✨ Feature Overview

A beautiful, site-wide dark mode toggle has been added to GridShare with:
- Smooth transitions between light and dark themes
- Persistent preference (saved in localStorage)
- System preference detection
- Accessible controls on all pages

---

## 🎨 What's Included

### 1. **DarkModeContext** (`src/contexts/DarkModeContext.tsx`)
- Global state management for dark mode
- Auto-detects system preference on first visit
- Saves user preference to localStorage
- Automatically applies `dark` class to document

### 2. **DarkModeToggle Component** (`src/components/DarkModeToggle.tsx`)
- Beautiful animated toggle with Sun/Moon icons
- Smooth rotation and scale transitions
- Accessible button with aria-label
- Integrated in the navigation bar

### 3. **Updated Components**

All components have been updated with dark mode styles:

#### **Layout Component**
- Dark mode toggle in the header (next to logout button)
- Dark background gradients
- Dark navigation items
- Dark mode compatible text colors

#### **Login & Register Pages**
- Floating dark mode toggle (top-right corner)
- Dark backgrounds and form inputs
- Proper contrast for readability
- All interactive elements styled for dark mode

---

## 🎯 How It Works

### User Experience

1. **First Visit**: 
   - App checks system dark mode preference
   - If system is in dark mode, app starts in dark mode
   - Otherwise, starts in light mode

2. **Toggle Dark Mode**:
   - Click the sun/moon icon in the header
   - Theme changes instantly with smooth transition
   - Preference saved to localStorage

3. **Persistent Preference**:
   - When user returns, their choice is remembered
   - Works across browser sessions
   - Independent of system preference after first toggle

### For Developers

```tsx
// Use dark mode anywhere in your app
import { useDarkMode } from '../contexts/DarkModeContext';

function MyComponent() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  
  return (
    <div className={isDarkMode ? 'dark-styles' : 'light-styles'}>
      <button onClick={toggleDarkMode}>Toggle</button>
    </div>
  );
}
```

---

## 🎨 Tailwind Dark Mode Classes

The app uses Tailwind's class-based dark mode. Add dark mode styles like this:

```tsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Light background with dark text in light mode
  Dark background with light text in dark mode
</div>
```

### Common Patterns Used

```tsx
// Backgrounds
"bg-white dark:bg-gray-800"
"bg-gray-50 dark:bg-gray-900"
"bg-green-100 dark:bg-green-900/30"

// Text Colors
"text-gray-900 dark:text-white"
"text-gray-600 dark:text-gray-300"
"text-gray-500 dark:text-gray-400"

// Borders
"border-gray-300 dark:border-gray-600"
"border-green-100 dark:border-gray-700"

// Hover States
"hover:bg-gray-100 dark:hover:bg-gray-800"
"hover:text-gray-900 dark:hover:text-white"
```

---

## 🔧 Configuration

### Tailwind Config (`tailwind.config.js`)
```javascript
export default {
  darkMode: 'class', // Enable class-based dark mode
  // ... rest of config
}
```

### App Structure
```tsx
<DarkModeProvider>      {/* Wraps entire app */}
  <AuthProvider>
    <Router>
      {/* All routes and components */}
    </Router>
  </AuthProvider>
</DarkModeProvider>
```

---

## 🎨 Color Scheme

### Light Mode
- Background: Green-blue gradient (`from-green-50 via-blue-50 to-emerald-50`)
- Cards: White with shadows
- Text: Gray shades (900, 700, 600)
- Accents: Green gradient

### Dark Mode
- Background: Dark gray gradient (`from-gray-900 via-gray-900 to-gray-800`)
- Cards: Dark gray (`gray-800`)
- Text: White and light grays
- Accents: Same green gradient (good contrast)

---

## ✨ Features

### Smooth Transitions
All color changes have smooth transitions:
```tsx
className="transition-colors duration-200"
```

### Icon Animation
The toggle button has delightful animations:
- Sun icon: Rotates in, scales up (dark mode)
- Moon icon: Rotates out, scales down (dark mode)
- 300ms smooth transitions

### Accessibility
- Proper `aria-label` on toggle buttons
- Sufficient color contrast in both modes
- Keyboard accessible (can tab to toggle)
- Clear visual feedback on hover

---

## 📱 Responsive Design

Dark mode works perfectly on:
- Desktop (toggle in header)
- Mobile (toggle visible in header)
- Tablets (optimized for all screen sizes)

---

## 🐛 Browser Support

Works in all modern browsers:
- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera

Requires JavaScript enabled (for React functionality).

---

## 🔮 Future Enhancements

Potential improvements:
1. **Auto-switch based on time** (e.g., dark mode at night)
2. **Multiple themes** (not just light/dark)
3. **Accent color customization**
4. **Per-component preferences**
5. **Reduced motion option** (for accessibility)

---

## 📝 localStorage Key

The dark mode preference is stored as:
```
Key: "gridshare_darkmode"
Value: "true" | "false"
```

Clear this from localStorage to reset to system preference.

---

## 🎉 Usage

### Toggle Dark Mode
1. Look for the sun/moon icon in the header
2. Click it to switch between light and dark modes
3. Your preference is saved automatically

### On Login/Register Pages
- Toggle button is in the top-right corner
- Can change theme before logging in
- Preference persists after login

---

## 💡 Tips for Adding Dark Mode to New Components

When creating new components, follow this pattern:

```tsx
// 1. Background colors
className="bg-white dark:bg-gray-800"

// 2. Text colors
className="text-gray-900 dark:text-white"

// 3. Borders
className="border-gray-300 dark:border-gray-600"

// 4. Add transition for smoothness
className="transition-colors duration-200"

// 5. Test both modes!
```

---

**Enjoy your new dark mode! 🌙✨**
