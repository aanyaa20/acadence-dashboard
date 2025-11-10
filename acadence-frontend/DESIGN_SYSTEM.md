# Acadence Design System

## 🎨 Overview
This design system provides a professional, clean white-based color palette with blue and green accents. All colors are defined as CSS variables for easy customization and consistent theming across the entire application.

## 📍 Color Variable Location
All design variables are centralized in: **`src/index.css`**

## 🎨 Color Palette

### Base Colors (White Background)
```css
--color-bg-primary: #FFFFFF        /* Main background - Pure white */
--color-bg-secondary: #F8FAFC      /* Page background - Light gray */
--color-bg-tertiary: #F1F5F9       /* Alternative backgrounds */
--color-bg-elevated: #FFFFFF       /* Cards, modals, elevated surfaces */
```

### Text Colors
```css
--color-text-primary: #0F172A      /* Main text - Dark blue-gray */
--color-text-secondary: #475569    /* Secondary text */
--color-text-tertiary: #64748B     /* Tertiary text */
--color-text-muted: #94A3B8        /* Muted/disabled text */
--color-text-inverse: #FFFFFF      /* Text on dark backgrounds */
```

### Brand Colors (Blue & Green)
```css
--color-primary: #2563EB           /* Primary blue */
--color-primary-hover: #1D4ED8     /* Primary blue hover */
--color-primary-light: #DBEAFE     /* Light blue backgrounds */
--color-primary-dark: #1E40AF      /* Dark blue accent */

--color-secondary: #10B981         /* Secondary green */
--color-secondary-hover: #059669   /* Secondary green hover */
--color-secondary-light: #D1FAE5   /* Light green backgrounds */
--color-secondary-dark: #047857    /* Dark green accent */
```

### Accent & Status Colors
```css
--color-accent: #3B82F6            /* Accent blue */
--color-success: #10B981           /* Success green */
--color-warning: #F59E0B           /* Warning amber */
--color-error: #EF4444             /* Error red */
--color-info: #3B82F6              /* Info blue */
```

### Border Colors
```css
--color-border-light: #E2E8F0      /* Light borders */
--color-border-medium: #CBD5E1     /* Medium borders */
--color-border-dark: #94A3B8       /* Dark borders */
```

### Gradients
```css
--gradient-primary: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)
--gradient-secondary: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%)
--gradient-soft: linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 100%)
```

## 📐 Spacing System
```css
--spacing-xs: 0.25rem    /* 4px */
--spacing-sm: 0.5rem     /* 8px */
--spacing-md: 1rem       /* 16px */
--spacing-lg: 1.5rem     /* 24px */
--spacing-xl: 2rem       /* 32px */
--spacing-2xl: 3rem      /* 48px */
```

## 🔲 Border Radius
```css
--radius-sm: 0.375rem    /* Small - buttons, tags */
--radius-md: 0.5rem      /* Medium - inputs, cards */
--radius-lg: 0.75rem     /* Large - panels */
--radius-xl: 1rem        /* Extra large */
--radius-2xl: 1.5rem     /* 2X large */
--radius-full: 9999px    /* Fully rounded - circles */
```

## 🌑 Shadows
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

## 🔤 Typography
```css
--font-family-sans: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto
--font-family-mono: 'Fira Code', 'Courier New', monospace
```

---

## 🛠️ Usage Examples

### Using CSS Variables Directly
```jsx
// Inline styles
<div style={{ 
  backgroundColor: 'var(--color-bg-elevated)',
  color: 'var(--color-text-primary)',
  padding: 'var(--spacing-lg)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-md)'
}}>
  Content
</div>

// Gradients
<h1 style={{
  background: 'var(--gradient-primary)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text'
}}>
  Title
</h1>
```

### Using Tailwind Utility Classes
Custom utility classes are defined in `index.css`:

```jsx
// Backgrounds
<div className="bg-primary">White background</div>
<div className="bg-secondary">Light gray background</div>
<div className="bg-elevated">Card background</div>

// Text Colors
<p className="text-primary">Primary text</p>
<p className="text-secondary">Secondary text</p>
<p className="text-muted">Muted text</p>

// Brand Colors
<button className="bg-brand text-inverse">Primary Button</button>
<button className="bg-success text-inverse">Success Button</button>

// Borders
<div className="border border-light">Light border</div>
<div className="border border-medium">Medium border</div>

// Shadows
<div className="shadow-custom-md">Medium shadow</div>
<div className="shadow-custom-lg">Large shadow</div>

// Gradients
<div className="gradient-primary">Primary gradient</div>
<div className="gradient-soft">Soft gradient</div>
```

### Button Patterns
```jsx
// Primary Button
<button 
  style={{ backgroundColor: 'var(--color-primary)' }}
  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'}
  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
  className="px-4 py-2 text-inverse rounded-lg shadow-custom-sm"
>
  Click Me
</button>

// Secondary Button
<button 
  style={{ backgroundColor: 'var(--color-secondary)' }}
  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-secondary-hover)'}
  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-secondary)'}
  className="px-4 py-2 text-inverse rounded-lg shadow-custom-sm"
>
  Secondary Action
</button>

// Outline Button
<button 
  style={{ 
    border: '2px solid var(--color-primary)',
    color: 'var(--color-primary)'
  }}
  className="px-4 py-2 bg-transparent rounded-lg hover:bg-brand-light"
>
  Outline
</button>
```

### Card Patterns
```jsx
<div className="bg-elevated border border-light rounded-xl p-6 shadow-custom-md hover:shadow-custom-lg transition-all">
  <h3 className="text-primary font-bold mb-2">Card Title</h3>
  <p className="text-secondary">Card description goes here</p>
</div>
```

---

## 🎯 Component Patterns

### Stat Card
```jsx
<div className="rounded-2xl p-6 shadow-custom-lg bg-elevated border border-light hover:shadow-custom-xl transition-all duration-300 flex flex-col items-center justify-center gap-3 hover:-translate-y-1">
  <div className="p-4 rounded-full" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
    {icon}
  </div>
  <div className="text-4xl font-extrabold text-primary">{value}</div>
  <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{title}</div>
</div>
```

### Progress Card
```jsx
<div className="rounded-2xl shadow-custom-xl p-6 bg-elevated border border-light" style={{
  background: 'var(--gradient-soft)'
}}>
  <h3 className="text-primary font-semibold mb-4">Your Skill Progress</h3>
  {/* Content */}
</div>
```

---

## 🎨 Customizing Colors

To change the entire color scheme, simply update the CSS variables in `src/index.css`:

### Example: Changing to Purple Theme
```css
:root {
  --color-primary: #9333EA;           /* Purple */
  --color-primary-hover: #7E22CE;     /* Darker purple */
  --color-primary-light: #F3E8FF;     /* Light purple */
  
  --color-secondary: #10B981;         /* Keep green */
  /* ... rest of variables ... */
}
```

### Example: Changing to Orange Theme
```css
:root {
  --color-primary: #F97316;           /* Orange */
  --color-primary-hover: #EA580C;     /* Darker orange */
  --color-primary-light: #FFEDD5;     /* Light orange */
  
  --color-secondary: #3B82F6;         /* Blue */
  /* ... rest of variables ... */
}
```

---

## ✅ Benefits

1. **Centralized Control**: Change colors across the entire app by editing one file
2. **Consistency**: All components use the same color variables
3. **Professional Look**: Clean white base with purposeful color accents
4. **Easy Theming**: Switch themes by changing variable values
5. **No Hardcoded Values**: Everything references variables
6. **Scalable**: Easy to add new colors or variations
7. **Maintainable**: Future updates are simple and quick

---

## 📝 Notes

- **Always use CSS variables** instead of hardcoded hex values
- **Use inline styles with CSS variables** for dynamic hover states
- **Use Tailwind utility classes** for static styles when available
- **Test color contrast** for accessibility (use tools like WebAIM)
- **Keep gradients subtle** for professional appearance
- **Use shadows sparingly** to create depth hierarchy

---

## 🚀 Updated Components

The following components have been updated to use the new design system:

1. ✅ `src/index.css` - Central design system variables
2. ✅ `src/App.css` - App-wide styles
3. ✅ `src/components/Navbar.jsx` - Navigation bar
4. ✅ `src/pages/Dashboard.jsx` - Main dashboard

### Remaining Components to Update:
- `src/pages/Home.jsx`
- `src/pages/Login.jsx`
- `src/pages/Signup.jsx`
- `src/pages/Courses.jsx`
- `src/pages/CourseDetails.jsx`
- `src/pages/Progress.jsx`
- `src/pages/AllCourses.jsx`
- `src/pages/Settings.jsx`
- `src/components/Recommendations.jsx`
- `src/components/ChatbotFloating.jsx`

---

**Maintained by**: Acadence Development Team  
**Last Updated**: November 7, 2025
