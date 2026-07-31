# ThreadBuy Image Specifications & Upload Guide

## 📸 Complete Image Requirements

### 🏢 Brand Logos

**Format**: SVG (preferred) or PNG  
**Background**: Transparent  
**Recommended Sizes**:
- **Source Upload**: 512x512px minimum
- **Navigation Menu**: 64x64px (auto-resized)
- **Brand Page Header**: 80x80px (auto-resized)
- **Product Cards**: 64x64px (auto-resized)

**Technical Requirements**:
```
- Format: SVG, PNG, WebP
- Max file size: 2MB
- Transparent background
- Square aspect ratio (1:1)
- Minimum resolution: 512x512px
- Vector format (SVG) preferred for scalability
```

### 🏪 Seller/Store Logos  

**Format**: SVG (preferred) or PNG  
**Background**: Transparent  
**Recommended Sizes**:
- **Source Upload**: 512x512px minimum
- **Navigation Logo**: 192x48px (4:1 ratio for horizontal layouts)
- **Seller Page Header**: 80x80px (auto-resized)
- **Product Info Cards**: 64x64px (auto-resized)

**Technical Requirements**:
```
- Format: SVG, PNG, WebP
- Max file size: 2MB
- Transparent background
- Square (1:1) or Horizontal (4:1) aspect ratio
- Minimum resolution: 512x512px (square) or 768x192px (horizontal)
```

### 🏷️ Navigation/Main Site Logo (Multitenant)

**Format**: SVG (preferred) or PNG  
**Background**: Transparent  
**Sizes**:
- **Desktop**: 192x48px (4:1 ratio)
- **Mobile**: 150x32px (auto-scaled)
- **Source Upload**: 768x192px minimum

**Multitenant Logic**:
```
1. If seller domain (shop.sellername.com) → Use seller logo
2. If main domain (threadbuy.com) → Use ThreadBuy logo
3. Fallback → Default ThreadBuy logo
```

### 📦 Product Images

**Format**: JPG (preferred for photos), PNG (for graphics), WebP  
**Background**: White (#FFFFFF) or transparent  
**Recommended Sizes**:
- **Source Upload**: 1200x1200px minimum
- **Thumbnail**: Auto-generated (280px, 360px, 480px, 800px)
- **Gallery**: Auto-generated responsive sizes

**Technical Requirements**:
```
- Format: JPG, PNG, WebP
- Max file size: 5MB per image
- Square aspect ratio (1:1) preferred
- Minimum resolution: 1200x1200px
- White background for consistency
- Multiple angles/views recommended
```

## 🎨 Crop Functionality Requirements

### For Brand/Seller Logos
- ✅ Aspect Ratio Lock: 1:1 (square)
- ✅ Minimum Size Enforcement: 512x512px
- ✅ Center Crop with zoom/pan
- ✅ Preview of all size variants
- ✅ Quality presets (web optimized)

### For Product Images
- ✅ Aspect Ratio Options: 1:1 (square), 4:3, 16:9
- ✅ Multiple Crop Areas: thumbnail, gallery, zoom
- ✅ Bulk upload with auto-crop
- ✅ Smart crop using AI (focus on product)
- ✅ Compression options

### For Navigation Logos
- ✅ Dual Aspect Ratios: 1:1 (square) and 4:1 (horizontal)
- ✅ Background removal tools
- ✅ Logo placement guides
- ✅ Multi-format export (SVG, PNG, WebP)

## 📱 File Size & Format Guidelines

| Image Type | Format | Max Size | Dimensions | Background |
|------------|--------|----------|------------|------------|
| Brand Logo | SVG/PNG | 2MB | 512x512px+ | Transparent |
| Seller Logo | SVG/PNG | 2MB | 512x512px+ | Transparent |
| Nav Logo | SVG/PNG | 2MB | 768x192px+ | Transparent |
| Product Image | JPG/WebP | 5MB | 1200x1200px+ | White/Transparent |
| Placeholder | SVG | - | Vector | - |

## 🔧 Implementation Status

### ✅ Completed
- Brand/Seller logo consistency components
- New ProductPlaceholder component
- Updated thumbnail component
- Image specifications guide

### 🔄 In Progress
- Enhanced file upload with crop functionality
- Image validation and optimization
- Upload progress indicators

### 📝 Planned
- AI-powered smart cropping
- Bulk image processing
- CDN optimization pipeline
