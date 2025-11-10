# Quick Reference Guide - Converting Components to New Design System

## 🎯 Common Replacements

### Background Colors
```jsx
// OLD
className="bg-slate-900"
className="bg-slate-800"  
className="bg-indigo-900"
className="bg-gray-100"

// NEW
style={{ backgroundColor: 'var(--color-bg-secondary)' }}
style={{ backgroundColor: 'var(--color-bg-elevated)' }}
style={{ backgroundColor: 'var(--color-bg-primary)' }}
className="bg-secondary"  // or use custom class
```

### Text Colors
```jsx
// OLD
className="text-white"
className="text-gray-300"
className="text-gray-400"
className="text-indigo-400"

// NEW
style={{ color: 'var(--color-text-primary)' }}
style={{ color: 'var(--color-text-secondary)' }}
style={{ color: 'var(--color-text-tertiary)' }}
style={{ color: 'var(--color-primary)' }}
```

### Buttons
```jsx
// OLD
<button className="bg-indigo-600 hover:bg-indigo-700 text-white">

// NEW
<button 
  className="text-inverse"
  style={{ backgroundColor: 'var(--color-primary)' }}
  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'}
  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
>
```

### Cards
```jsx
// OLD
<div className="bg-slate-800 rounded-xl shadow-lg">

// NEW
<div 
  className="rounded-xl shadow-custom-lg border"
  style={{
    backgroundColor: 'var(--color-bg-elevated)',
    borderColor: 'var(--color-border-light)'
  }}
>
```

### Gradients
```jsx
// OLD
className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent"

// NEW
style={{
  background: 'var(--gradient-primary)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text'
}}
```

### Borders
```jsx
// OLD
className="border-gray-700"
className="border-slate-600"

// NEW
className="border"
style={{ borderColor: 'var(--color-border-light)' }}
// or
className="border border-light"
```

### Shadows
```jsx
// OLD
className="shadow-lg"
className="shadow-xl"

// NEW
className="shadow-custom-lg"
className="shadow-custom-xl"
```

### Input Fields
```jsx
// OLD
<input className="bg-slate-700 text-white border-gray-600" />

// NEW
<input 
  className="rounded-lg border outline-none transition-all"
  style={{
    backgroundColor: 'var(--color-bg-primary)',
    borderColor: 'var(--color-border-medium)',
    color: 'var(--color-text-primary)'
  }}
  onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
  onBlur={(e) => e.target.style.borderColor = 'var(--color-border-medium)'}
/>
```

## 🎨 Color Mapping Reference

| Old Tailwind Class | New CSS Variable |
|-------------------|------------------|
| `bg-white` | `var(--color-bg-primary)` |
| `bg-gray-50` | `var(--color-bg-secondary)` |
| `bg-gray-100` | `var(--color-bg-tertiary)` |
| `bg-slate-900` | `var(--color-bg-secondary)` |
| `bg-slate-800` | `var(--color-bg-elevated)` |
| `text-gray-900` | `var(--color-text-primary)` |
| `text-gray-700` | `var(--color-text-secondary)` |
| `text-gray-500` | `var(--color-text-tertiary)` |
| `text-gray-400` | `var(--color-text-muted)` |
| `text-white` | `var(--color-text-inverse)` |
| `bg-indigo-600` | `var(--color-primary)` |
| `bg-indigo-700` | `var(--color-primary-hover)` |
| `bg-blue-500` | `var(--color-accent)` |
| `bg-green-600` | `var(--color-secondary)` |
| `text-green-500` | `var(--color-success)` |
| `text-red-500` | `var(--color-error)` |
| `text-yellow-500` | `var(--color-warning)` |
| `border-gray-300` | `var(--color-border-light)` |
| `border-gray-400` | `var(--color-border-medium)` |

## 📋 Step-by-Step Process for Updating a Component

1. **Find all hardcoded colors** - Search for: `bg-`, `text-`, `border-`, `from-`, `to-`
2. **Replace backgrounds** - Use `style={{ backgroundColor: 'var(--color-...)' }}`
3. **Replace text colors** - Use `style={{ color: 'var(--color-...)' }}`
4. **Update gradients** - Use `var(--gradient-primary)` or `var(--gradient-secondary)`
5. **Fix borders** - Use `borderColor: 'var(--color-border-...)'`
6. **Update shadows** - Use custom shadow classes
7. **Test hover states** - Add `onMouseEnter`/`onMouseLeave` for dynamic colors
8. **Check focus states** - Add `onFocus`/`onBlur` for inputs

## 🔥 Pro Tips

### Combining Tailwind + CSS Variables
```jsx
// ✅ GOOD - Mix of Tailwind utilities and CSS variables
<div 
  className="p-6 rounded-xl shadow-custom-lg border"
  style={{
    backgroundColor: 'var(--color-bg-elevated)',
    borderColor: 'var(--color-border-light)'
  }}
>
```

### Dynamic Hover States
```jsx
// ✅ GOOD - Smooth hover transitions
<button
  style={{ backgroundColor: 'var(--color-primary)' }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = 'var(--color-primary)';
    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
  }}
>
```

### Gradient Text
```jsx
// ✅ GOOD - Gradient text effect
<h1 style={{
  background: 'var(--gradient-primary)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text'
}}>
  Gradient Title
</h1>
```

## ⚠️ Common Mistakes to Avoid

❌ **DON'T** mix old and new systems:
```jsx
<div className="bg-slate-900" style={{ color: 'var(--color-text-primary)' }}>
```

❌ **DON'T** use hardcoded hex values:
```jsx
<div style={{ backgroundColor: '#2563EB' }}>
```

❌ **DON'T** forget to handle hover/focus states:
```jsx
<button style={{ backgroundColor: 'var(--color-primary)' }}>
  // Missing hover state!
</button>
```

✅ **DO** use consistent patterns:
```jsx
<div 
  className="p-6 rounded-xl shadow-custom-lg border"
  style={{
    backgroundColor: 'var(--color-bg-elevated)',
    borderColor: 'var(--color-border-light)'
  }}
>
```

## 🎯 Priority Order for Updates

1. **High Priority** (User-facing, frequently used):
   - ✅ Navbar (DONE)
   - ✅ Dashboard (DONE)
   - ✅ Login (DONE)
   - ✅ Signup (DONE)
   - ⏳ Home
   - ⏳ Courses
   - ⏳ CourseDetails

2. **Medium Priority**:
   - ⏳ Progress
   - ⏳ AllCourses
   - ⏳ Settings
   - ⏳ Profile

3. **Low Priority**:
   - ⏳ Chatbot
   - ⏳ Recommendations
   - ⏳ Other components

## 🔍 Testing Checklist

After updating a component, verify:
- [ ] All text is readable (good contrast)
- [ ] Buttons have hover states
- [ ] Input fields have focus states
- [ ] Cards have proper shadows and borders
- [ ] Gradients render correctly
- [ ] Colors match the design system
- [ ] No hardcoded color values remain
- [ ] Component looks professional and clean

---

**Happy Coding! 🚀**
