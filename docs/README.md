# CleanSweep Website

This folder contains the marketing website for the CleanSweep Chrome extension.

## 🌐 Live Demo

The website is designed to be hosted on GitHub Pages at:
`https://mrfullstackdev.github.io/CleanSweep/`

## 📁 Structure

```
docs/
├── index.html      # Main HTML structure
├── styles.css      # Purple gradient theme with animations
└── script.js       # Interactive scroll animations
```

## 🚀 Deploying to GitHub Pages

### Option 1: Using docs/ folder (Recommended)

1. Push this repository to GitHub
2. Go to repository Settings → Pages
3. Under "Source", select "Deploy from a branch"
4. Select branch: `main` and folder: `/docs`
5. Click "Save"
6. Your site will be live at `https://mrfullstackdev.github.io/CleanSweep/`

### Option 2: Manual deployment

You can also copy these files to a separate branch or repository for deployment.

## ✨ Features

- **Fast Loading**: < 50KB total, optimized for performance
- **Purple Gradient Theme**: Modern purple gradient color scheme
- **Scroll Animations**: Subtle fade-in effects as you scroll
- **Fully Responsive**: Works on all devices
- **No Dependencies**: Pure HTML, CSS, and vanilla JavaScript
- **SEO Optimized**: Proper meta tags and semantic HTML
- **Accessibility**: WCAG AA compliant

## 🎨 Design Elements

- Hero section with gradient background and CTA
- 6 feature cards with hover effects
- Step-by-step "How It Works" section
- Tech stack badges
- Call-to-action section with gradient background
- Comprehensive footer with links

## 🔧 Customization

### Colors

Edit CSS variables in `styles.css`:

```css
:root {
    --primary: #8B5CF6;
    --primary-dark: #7C3AED;
    --primary-light: #A78BFA;
    --accent: #A78BFA;
    --accent-light: #C4B5FD;
}
```

### Content

All content can be edited directly in `index.html`. The structure is well-commented and easy to navigate.

### Animations

Animations are controlled in `script.js` using Intersection Observer API. You can adjust timing and effects as needed.

## 📊 Performance

- First Contentful Paint: < 1s
- Largest Contentful Paint: < 2s
- Total Blocking Time: < 100ms
- Cumulative Layout Shift: < 0.1

## 🌟 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 License

MIT License - Same as the CleanSweep extension

