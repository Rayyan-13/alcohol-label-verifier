# Sample Images Guide

This document describes the sample label images that can be used for testing the TTB Label Verifier.

## Images Provided in Assignment

The following images were included with the assignment prompt:

### 1. Lagavulin - Islay Single Malt Scotch Whisky
**Image Description**: Two label views (front and back)
- **Brand Name**: Lagavulin
- **Product Type**: Islay Single Malt Scotch Whisky
- **Alcohol Content**: 43% or 56% (depending on expression)
- **Net Contents**: 750 mL
- **Notable Features**: 
  - Contains government warning on back label
  - Shows distillery information
  - Includes alcohol content clearly marked

**Test Case**: Perfect match scenario
```
Form Data:
- Brand Name: Lagavulin
- Product Type: Islay Single Malt Scotch Whisky
- ABV: 43 (or 56 depending on variant)
- Net Contents: 750 mL

Expected Result: ✓ All checks pass
```

---

### 2. Lighthouse - Stormchaser White Chardonnay
**Image Description**: Front and back label views
- **Brand Name**: Lighthouse
- **Product Type**: Chardonnay
- **Region**: Hudson River Region
- **Vintage**: 2018
- **Alcohol Content**: ~13.5% ABV
- **Net Contents**: 750 mL
- **Notable Features**:
  - Wine label with government warning
  - Contains sulfites declaration
  - Producer information included

**Test Case**: Wine label verification
```
Form Data:
- Brand Name: Lighthouse
- Product Type: Chardonnay
- ABV: 13.5
- Net Contents: 750 mL

Expected Result: ✓ All checks pass
```

---

### 3. Ridge Geyserville
**Image Description**: Wine label (likely front and back)
- **Brand Name**: Ridge
- **Product Name**: Geyserville
- **Vintage**: 2011
- **Alcohol Content**: ~14-15% ABV (typical for Ridge)
- **Notable Features**:
  - Premium wine label
  - Detailed vineyard information
  - Government warning present

**Test Case**: Premium wine label
```
Form Data:
- Brand Name: Ridge
- Product Type: Geyserville
- ABV: 14.5
- Net Contents: 750 mL

Expected Result: ✓ All checks pass
```

---

### 4. ABC Distillery - Single Barrel Straight Rye Whisky
**Image Description**: Front and back label (example/template labels)
- **Brand Name**: ABC
- **Product Type**: Straight Rye Whisky
- **Alcohol Content**: 45% ALC/VOL
- **Net Contents**: 750 mL
- **Location**: Frederick, MD
- **Notable Features**:
  - Template/example label design
  - Clear government warning
  - All mandatory information present
  - Barcode included

**Test Case**: Perfect example for template
```
Form Data:
- Brand Name: ABC
- Product Type: Straight Rye Whisky
- ABV: 45
- Net Contents: 750 mL

Expected Result: ✓ All checks pass
```

---

### 5. Seagram's Seven Crown
**Image Description**: Classic American whiskey label
- **Brand Name**: Seagram's Seven Crown
- **Product Type**: American Whiskey
- **Alcohol Content**: ~7% (note: this seems unusual, likely 40% or 80 proof)
- **Serving Size**: 1.5 fl oz (44 mL)
- **Notable Features**:
  - Well-known brand label
  - Nutrition facts panel
  - Government warning
  - Established brand (historic)

**Test Case**: Established brand verification
```
Form Data:
- Brand Name: Seagram's Seven Crown
- Product Type: Whiskey
- ABV: 40
- Net Contents: 750 mL

Expected Result: ✓ All checks pass
```

---

### 6. Orpheus Brewing - Over and Over (Hazy Pale Ale)
**Image Description**: Craft beer label
- **Brand Name**: Orpheus Brewing
- **Product Name**: Over and Over
- **Product Type**: Hazy Pale Ale
- **Alcohol Content**: ~5-7% ABV (typical for pale ale)
- **Notable Features**:
  - Craft beer design
  - Artistic label
  - Government warning
  - Brewery information

**Test Case**: Beer label verification
```
Form Data:
- Brand Name: Orpheus Brewing
- Product Type: Ale
- ABV: 5.5
- Net Contents: 16 fl oz

Expected Result: ✓ All checks pass
```

---

### 7. Malt & Hop Brewery - Honey Huckleberry Pie Ale
**Image Description**: Front and back label (craft beer)
- **Brand Name**: Malt & Hop Brewery
- **Product Name**: Honey Huckleberry Pie
- **Product Type**: Ale with Honey and Huckleberry Flavor
- **Alcohol Content**: 5% ALC/VOL
- **Net Contents**: 1 PINT, 0.9 FL OZ
- **Location**: Hyattsville, MD
- **Notable Features**:
  - Farm to table series #1
  - Flavored beer
  - Clear government warning
  - Barcode and recycling symbol

**Test Case**: Flavored beer verification
```
Form Data:
- Brand Name: Malt & Hop
- Product Type: Ale
- ABV: 5
- Net Contents: 1 pint

Expected Result: ✓ All checks pass
```

---

### 8. William Grant & Sons Import Label
**Image Description**: Back label detail showing government warning
- **Importer**: William Grant and Sons, Inc., New York, NY
- **Established**: 1886
- **Notable Features**:
  - Detailed government warning text
  - Barcode present
  - Refund information
  - Complete warning statement visible

**Test Case**: Warning verification focus
```
Use this image specifically to test:
- Government warning detection
- Complete warning text presence
- Proper formatting
```

---

### 9. Nashville Barrel Co. - Stella's Stash Edition
**Image Description**: Premium spirit label
- **Brand Name**: Nashville Barrel Company
- **Product Name**: Stella's Stash Edition
- **Notable Features**:
  - Limited edition/special release
  - Tasting room and subscription exclusive
  - Complete government warning
  - DSP-TN-21095 (distillery identification)
  - Bottler information

**Test Case**: Premium/limited edition verification
```
Form Data:
- Brand Name: Nashville Barrel
- Product Type: Spirit
- ABV: (varies by bottling)
- Net Contents: (standard 750 mL assumed)

Expected Result: ✓ All checks pass
```

---

### 10. Alsace Grand Cru - Brand Grand Cru Kirchberg
**Image Description**: French wine label
- **Appellation**: Alsace Grand Cru Contrôlée
- **Wine**: Riesling 2022
- **Producer**: La Rogerie / Kirchberg
- **Importer**: Corkhoarder, New York, NY
- **Alcohol Content**: 13% by Vol
- **Net Contents**: 750 mL
- **Notable Features**:
  - French wine with US import label
  - Contains sulfites declaration
  - US government warning (required for US sale)
  - Detailed appellation information

**Test Case**: Imported wine verification
```
Form Data:
- Brand Name: Brand Grand Cru
- Product Type: Riesling
- ABV: 13
- Net Contents: 750 mL

Expected Result: ✓ All checks pass
```

---

### 11. Jonata - El Desafio de Jonata 2013
**Image Description**: Back label of premium California wine
- **Brand Name**: Jonata
- **Product Name**: El Desafio de Jonata 2013
- **Blend**: 87% Cabernet Sauvignon, 5% Cabernet Franc, 5% Petit Verdot, 3% Merlot
- **Region**: Ballard Canyon, Santa Ynez Valley
- **Bottler**: Jonata, Buellton, CA
- **Alcohol Content**: 14.1% by Volume
- **Notable Features**:
  - Contains sulfites
  - Complete government warning
  - Contact information (website, phone)
  - Estate bottled

**Test Case**: Premium California wine
```
Form Data:
- Brand Name: Jonata
- Product Type: Cabernet Sauvignon (or Red Wine Blend)
- ABV: 14.1
- Net Contents: 750 mL

Expected Result: ✓ All checks pass
```

---

## Testing Scenarios with These Images

### Scenario 1: Perfect Matches
Use any of the above images with matching form data. All checks should pass.

### Scenario 2: Brand Name Mismatch
- Use Lagavulin image
- Enter "Different Brand" in form
- **Expected**: Brand name check fails ✗

### Scenario 3: ABV Mismatch
- Use Lighthouse Chardonnay (13.5% ABV)
- Enter 18% in form
- **Expected**: ABV check fails ✗

### Scenario 4: Product Type Mismatch
- Use Orpheus Brewing (Ale)
- Enter "Lager" or "IPA" in form
- **Expected**: Product type check might fail depending on label text

### Scenario 5: Multiple Mismatches
- Use any image
- Enter completely wrong information
- **Expected**: Multiple checks fail ✗

## Tips for Testing

1. **Start with Perfect Matches**: Build confidence that OCR works
2. **Test One Mismatch at a Time**: Understand each verification check
3. **Try Different Image Qualities**: See how OCR handles various conditions
4. **Test Optional Fields**: Try with and without net contents
5. **Check Warning Detection**: All images should have government warnings

## Creating Your Own Test Images

If you want to create additional test images:

1. **Use AI Image Generation** (DALL-E, Midjourney, etc.)
   - Prompt: "alcohol beverage label with brand name, ABV, and government warning"

2. **Design in Canva or Photoshop**
   - Include all required elements
   - Make text clear and readable
   - Add realistic government warning

3. **Use Real Product Photos**
   - Take photos of actual bottles/labels
   - Ensure good lighting and focus
   - Capture both front and back labels

4. **Generate Mock Labels**
   - Use online label makers
   - Add all TTB-required information
   - Export as high-quality image

## Image Quality Requirements

For best OCR results:

✅ **Resolution**: Minimum 800x800 pixels  
✅ **Format**: JPEG or PNG  
✅ **Lighting**: Even, no shadows  
✅ **Focus**: Sharp, not blurry  
✅ **Angle**: Straight-on, not tilted  
✅ **Text**: Clear, readable font  
✅ **Size**: Under 10MB  

❌ **Avoid**:
- Blurry or out-of-focus images
- Heavy shadows or glare
- Extremely stylized fonts
- Curved text (on bottles)
- Low resolution (<300x300)
- Watermarks over text

## Expected OCR Performance by Image Type

| Image Type | Expected Accuracy | Notes |
|------------|------------------|-------|
| Flat labels, good lighting | 90-95% | Best case |
| Standard photos | 80-90% | Most common |
| Slightly curved labels | 70-85% | May have errors |
| Artistic/stylized fonts | 60-80% | Depends on font |
| Low light / blurry | 40-70% | May fail |
| Handwritten text | 20-50% | Often fails |

## Troubleshooting Image Issues

### Problem: OCR returns no text
**Solutions**:
- Check image file is valid
- Try different image format
- Increase image resolution
- Improve lighting

### Problem: Text partially extracted
**Solutions**:
- Use higher quality image
- Ensure full label is visible
- Reduce image complexity
- Remove background distractions

### Problem: Wrong text extracted
**Solutions**:
- Verify image shows correct label
- Check for text in unexpected places
- Ensure image orientation is correct
- Try preprocessing (brightness/contrast)

---

**Ready to test?** Upload any of these sample images and see the verification in action!

