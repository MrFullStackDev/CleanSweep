# CleanSweep 🧹

A fast, minimalist Chrome extension for clearing cookies, cache, and browsing data with one click. Choose between clearing data for the current site only or all sites.

## Features

- **One-Click Clearing**: Click the extension icon to instantly clear selected data
- **Auto Page Reload**: Page automatically reloads after clearing to show immediate effect
- **Flexible Scope**: Choose between clearing current site or all sites
- **Customizable Data Types**: Select what to clear:
  - Cookies
  - Cache
  - Local Storage
  - Session Storage
  - IndexedDB
  - Service Workers
  - Browsing History
- **No Confirmation Dialogs**: Fast, seamless clearing without interruptions
- **Minimalist Notification**: Small, clean popup shows what was cleared
- **Modern Design**: Clean interface following latest design principles
- **Cross-Device Sync**: Settings sync across devices via Chrome Sync

## Installation

### From Source (Developer Mode)

1. **Download or Clone** this repository to your local machine

2. **Open Chrome Extensions Page**:
   - Navigate to `chrome://extensions/`
   - Or click the Extensions icon in Chrome toolbar → Manage Extensions

3. **Enable Developer Mode**:
   - Toggle the "Developer mode" switch in the top right corner

4. **Load the Extension**:
   - Click "Load unpacked"
   - Select the `CleanSweep` folder

5. **Pin the Extension** (Optional):
   - Click the Extensions icon in Chrome toolbar
   - Pin "CleanSweep" for easy access

### From Chrome Web Store

*Coming soon - CleanSweep will be available on Chrome Web Store*

## Usage

### Basic Usage

1. **Click the extension icon** to clear data based on your current settings
2. A **success badge (✓)** will appear on the icon
3. The popup shows what was cleared and when

### Configuring Settings

1. **Click the extension icon** to open the popup
2. **Click "Settings"** button at the bottom
3. Configure your preferences:
   - **Clearing Scope**: Choose "Current Site Only" or "All Sites"
   - **Data Types**: Toggle what types of data to clear
4. Settings are **saved automatically** when you make changes

### Default Settings

On first install, these defaults are set:

- **Scope**: Current Site Only (safer)
- **Enabled**: Cookies, Cache, Local Storage, Session Storage
- **Disabled**: IndexedDB, Service Workers, Browsing History

## Permissions Explained

This extension requires the following permissions:

- **`browsingData`**: Required to clear cache, cookies, and other browsing data
- **`cookies`**: Required for targeted cookie removal
- **`storage`**: Required to save your settings
- **`activeTab`**: Required to identify the current website when clearing site-specific data
- **`tabs`**: Required to show status badges on the extension icon
- **`<all_urls>`**: Required to clear cookies from any domain

**Privacy Note**: This extension does NOT collect, store, or transmit any of your data. All operations are performed locally on your device.

## Technical Details

### Architecture

- **Manifest Version**: V3 (latest Chrome standard)
- **Background**: Service Worker architecture
- **Storage**: Chrome Storage Sync API
- **Styling**: Pure CSS with system font stack
- **No External Dependencies**: No external libraries or frameworks

### Browser Compatibility

- Chrome 88+ (Manifest V3 support)
- Microsoft Edge 88+ (Chromium-based)
- Brave, Opera, and other Chromium browsers

### File Structure

```
CleanSweep/
├── manifest.json           # Extension configuration
├── background.js           # Service worker (core logic)
├── popup/
│   ├── popup.html         # Popup interface
│   ├── popup.js           # Popup logic
│   └── popup.css          # Popup styling
├── settings/
│   ├── settings.html      # Settings page
│   ├── settings.js        # Settings logic
│   └── settings.css       # Settings styling
├── icons/
│   ├── icon16.png        # 16x16 icon
│   ├── icon48.png        # 48x48 icon
│   └── icon128.png       # 128x128 icon
└── README.md              # This file
```

## FAQ

### Q: Does this extension slow down my browser?

No. The extension uses a lightweight service worker that only runs when you click the icon. It has minimal impact on browser performance.

### Q: Can I undo clearing data?

No. Once data is cleared, it cannot be recovered. Be careful when using "All Sites" mode with History enabled.

### Q: Why can't I clear data on chrome:// pages?

Chrome extensions cannot access or modify internal Chrome pages (chrome://, about://, etc.) for security reasons.

### Q: Does this work in Incognito mode?

The extension can work in Incognito mode if you enable it in Chrome Extensions settings. However, Incognito mode already limits data storage.

### Q: What's the difference between Local Storage and Session Storage?

- **Local Storage**: Persists until explicitly cleared
- **Session Storage**: Cleared when the tab/window is closed
- Both are cleared by this extension if enabled

## Privacy Policy

CleanSweep respects your privacy:

- **No Data Collection**: We do not collect any user data
- **No Analytics**: No tracking or analytics of any kind
- **No External Connections**: All operations are local
- **Open Source**: Code is fully transparent and auditable
- **Minimal Permissions**: Only requests permissions necessary for functionality

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

### Development Setup

1. Clone the repository
2. Make your changes
3. Test in Chrome with Developer Mode
4. Submit a pull request

### Testing Checklist

- [ ] Test clearing on HTTP sites
- [ ] Test clearing on HTTPS sites
- [ ] Test "Current Site" mode
- [ ] Test "All Sites" mode
- [ ] Test with different data type combinations
- [ ] Verify settings persistence
- [ ] Check visual feedback (badges, status messages)
- [ ] Test on different screen sizes

## Support

If you encounter any issues or have suggestions:

1. Check the FAQ above
2. Review existing issues on GitHub
3. Create a new issue with details about your problem

## License

MIT License - Feel free to use, modify, and distribute this extension.

## Acknowledgments

Built with care following Chrome Extension best practices and modern web design principles.

---

**Version**: 1.0.0  
**Last Updated**: November 2025

