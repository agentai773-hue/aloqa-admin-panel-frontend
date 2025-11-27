# Logo Setup Guide for Aloqa AI Admin Panel

## Logo File Placement

### Required Files:

1. **Main Logo** - `/public/logo.png`
   - **Location**: Place your logo file at the root of the `public` folder
   - **Path**: `aloqa-admin-panel-frontend/public/logo.png`
   - **Recommended Size**: 512x512 pixels or higher (square format)
   - **Format**: PNG with transparent background preferred
   - **Usage**: Used in sidebar and as app icon

2. **Favicon** - `/public/favicon.png`
   - **Location**: Place your favicon at the root of the `public` folder  
   - **Path**: `aloqa-admin-panel-frontend/public/favicon.png`
   - **Recommended Size**: 32x32 pixels or 64x64 pixels
   - **Format**: PNG or ICO format
   - **Usage**: Browser tab icon

### File Structure:
```
aloqa-admin-panel-frontend/
├── public/
│   ├── logo.png          ← Your main logo (512x512px)
│   ├── favicon.png       ← Your favicon (32x32px or 64x64px)
│   └── manifest.json     ← Already configured
├── index.html            ← Already updated with logo references
└── src/
    └── components/
        └── layout/
            └── Sidebar.tsx  ← Logo already integrated
```

## Logo Display Configuration

### Sidebar Logo:
- **Open State**: Shows full logo (10x10 size) + "Aloqa AI" text with green gradient
- **Collapsed State**: Shows icon-only logo (10x10 size) centered
- **Responsive**: Automatically adjusts based on sidebar state
- **Fallback**: If logo image fails to load, it gracefully hides without breaking layout

### Logo Colors:
- Primary Brand Color: `#5DD149` (Light Green)
- Secondary Brand Color: `#306B25` (Dark Green)
- Text uses gradient from light to dark green

## Manifest Configuration

The `manifest.json` file is already configured with:
- App name: "Aloqa AI Admin Panel"
- Theme color: `#5DD149` (green)
- Icons referencing `/logo.png`
- PWA support enabled

## Design Recommendations

### Logo Design Tips:
1. **Keep it simple**: Icon should be recognizable even at small sizes
2. **Use brand colors**: Incorporate green (#5DD149) in your logo design
3. **Square format**: Ensures proper display in all contexts
4. **Transparent background**: PNG with transparency works best
5. **High resolution**: Use at least 512x512px for main logo

### Logo Variants:
- **Full Logo**: Can include text/wordmark (shown when sidebar is open)
- **Icon Logo**: Simplified icon version (shown when sidebar is collapsed)
- Use the same file for both - the sizing adapts automatically

## Testing Your Logo

After placing your logo files:

1. **Check Sidebar**:
   - Open sidebar: Should show logo + "Aloqa AI" text
   - Collapse sidebar: Should show logo icon only
   - Mobile view: Should display properly

2. **Check Browser Tab**:
   - Favicon should appear in browser tab
   - Should be visible and clear at small size

3. **Check PWA**:
   - When added to home screen, logo should appear as app icon

## Troubleshooting

### Logo not showing?
- Verify file is exactly at `/public/logo.png`
- Check file name is lowercase `logo.png` not `Logo.png`
- Ensure file format is PNG
- Clear browser cache and hard reload (Cmd+Shift+R or Ctrl+Shift+R)

### Favicon not showing?
- Verify file is at `/public/favicon.png`
- Try `favicon.ico` format if PNG doesn't work
- Clear browser cache
- Close and reopen browser tab

### Logo appears pixelated?
- Use higher resolution image (at least 512x512px)
- Ensure PNG is not compressed too heavily
- Use vector-based design exported at high DPI

## Quick Start

1. Create or obtain your logo image (512x512px PNG recommended)
2. Save it as `logo.png` 
3. Place it in: `aloqa-admin-panel-frontend/public/logo.png`
4. Create favicon (32x32px or 64x64px)
5. Save it as `favicon.png`
6. Place it in: `aloqa-admin-panel-frontend/public/favicon.png`
7. Restart development server: `npm run dev`
8. Check http://localhost:5173 - your logo should appear!

## Example File Paths

Correct:
```
✅ /Users/admin/Documents/GitHub/Aloqa-ai/aloqa-admin-panel-frontend/public/logo.png
✅ /Users/admin/Documents/GitHub/Aloqa-ai/aloqa-admin-panel-frontend/public/favicon.png
```

Incorrect:
```
❌ /Users/admin/Documents/GitHub/Aloqa-ai/aloqa-admin-panel-frontend/src/assets/logo.png
❌ /Users/admin/Documents/GitHub/Aloqa-ai/aloqa-admin-panel-frontend/logo.png
❌ /Users/admin/Documents/GitHub/Aloqa-ai/aloqa-admin-panel-frontend/public/images/logo.png
```

---

**Note**: All configuration is already complete! You just need to place your logo and favicon files in the public folder.
