# Testing the Extension

## Important: Reload the Extension After Changes

Since you've just updated the extension files, you need to reload it in Chrome:

### How to Reload the Extension

1. **Go to** `chrome://extensions/`
2. **Find** "Cache & Cookie Cleaner" in the list
3. **Click the refresh/reload icon** 🔄 on the extension card
4. **Or** toggle it off and back on

## What You Should See Now

### When You Click the Extension Icon

**Minimalist notification** - clean and simple!

1. **Auto Page Reload** (NEW!)
   - Current page automatically reloads after clearing
   - See the effect of clearing immediately
   - Works for both current site and all sites mode

2. **Small Popup Window** (320x180px)
   - Appears in the center of your screen
   - Shows: "Data Cleared" with green checkmark
   - Displays what was cleared (e.g., "Cookies, Cache (current site)")
   - Auto-closes after 3 seconds
   - Click anywhere or press Escape to close immediately
   - Semi-transparent dark background

3. **✓ Badge on Extension Icon** (Optional visual feedback)
   - A green checkmark (✓) appears on the extension icon
   - Stays visible for 5 seconds
   - Red X (✗) if you're on a chrome:// page
   - Red exclamation (!) if there's an error

## Testing Checklist

### Test 1: Basic Clearing
1. Go to any normal website (e.g., https://example.com)
2. Click the extension icon
3. **Expected**: 
   - **Page automatically reloads**
   - **Small, clean popup appears in center of screen**
   - Shows "Data Cleared" with checkmark
   - Lists what was cleared
   - Window auto-closes after 3 seconds
   - Green ✓ badge shows on icon
   - Badge disappears after 5 seconds

### Test 2: Quick Close
1. Click the extension icon to clear data
2. The small popup appears
3. **Click anywhere** on the popup or press **Escape**
4. **Expected**: Popup closes immediately

### Test 3: Settings Page
1. Right-click extension icon → Click "Options"
2. Change some settings (toggle items on/off)
3. Change scope (Current Site ↔ All Sites)
4. **Expected**: Settings save automatically (you'll see "Settings saved successfully!")

### Test 4: Chrome Internal Pages
1. Go to `chrome://extensions/`
2. Click the extension icon
3. **Expected**: 
   - Red ✗ badge on icon
   - (No popup for Chrome internal pages)

### Test 5: Different Scopes
1. Enable "All Sites" in settings
2. Go to any website and click icon
3. **Expected**: Popup shows "(all sites)" in the message
4. Switch to "Current Site Only"
5. Click icon again
6. **Expected**: Popup shows "(current site)" in the message

## Troubleshooting

### "I don't see the popup"
- **The small popup should ALWAYS appear** - it's a popup window
- If you don't see it:
  - Make sure you're on a regular website (http:// or https://)
  - Reload the extension: `chrome://extensions/` → click reload 🔄
  - Check the service worker console for errors

### "Popup closes too fast"
- Default is 3 seconds auto-close
- Click anywhere on the popup to close immediately
- Or press Escape key to close

### "Badge doesn't appear"
- Make sure the extension is pinned to the toolbar
- Try clicking on a regular HTTP/HTTPS website (not chrome:// pages)
- Reload the extension

### "Nothing happens when I click"
- Open Chrome DevTools → Console
- Go to `chrome://extensions/` → click "service worker" link
- Check for any error messages
- Make sure you've reloaded the extension after the updates

## Debug Console

To see what's happening in the background:

1. Go to `chrome://extensions/`
2. Find "Cache & Cookie Cleaner"
3. Click "service worker" link under "Inspect views"
4. Watch the console when you click the extension icon

## Expected Console Output

When clearing succeeds, you should see:
```
(no errors - silent success)
```

When clearing fails, you should see:
```
Error clearing data: [error details]
```

## Performance Notes

- Clearing "All Sites" with History enabled may take 1-2 seconds
- Clearing "Current Site Only" is nearly instant
- Notification appears immediately after clearing completes

