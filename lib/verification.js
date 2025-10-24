/**
 * Verification utilities for comparing form data with OCR extracted text
 */

/**
 * Normalize text for comparison (case-insensitive, trim whitespace)
 */
function normalizeText(text) {
  if (!text) return '';
  return text.toString().toLowerCase().trim();
}

/**
 * Check if a value exists in the text (flexible matching)
 */
function findInText(text, value) {
  const normalizedText = normalizeText(text);
  const normalizedValue = normalizeText(value);
  return normalizedText.includes(normalizedValue);
}

/**
 * Extract alcohol percentage from text
 */
function extractAlcoholContent(text) {
  // Look for patterns like "45%", "45% ABV", "45% alc/vol", "Alc 45% by Vol", "40 PERCENT ALCOHOL"
  const patterns = [
    /(\d+(?:\.\d+)?)\s*%\s*(?:ABV|alc|alcohol)/i,
    /(?:ABV|alc|alcohol)[\s:]*(\d+(?:\.\d+)?)\s*%/i,
    /(\d+(?:\.\d+)?)\s*percent\s*(?:alcohol|alc)?/i, // Handle "40 PERCENT ALCOHOL"
    /(\d+(?:\.\d+)?)\s*%/g,
  ];
  
  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches) {
      // Extract just the number
      const numberMatch = matches[0].match(/(\d+(?:\.\d+)?)/);
      if (numberMatch) {
        return parseFloat(numberMatch[1]);
      }
    }
  }
  return null;
}

/**
 * Extract volume/net contents from text
 */
function extractNetContents(text) {
  // Look for patterns like "750 mL", "750mL", "12 fl oz", "1 PINT"
  const patterns = [
    /(\d+(?:\.\d+)?)\s*(?:ml|mL|ML|milliliters?)/i,
    /(\d+(?:\.\d+)?)\s*(?:l|L|liters?)/i,
    /(\d+(?:\.\d+)?)\s*(?:oz|fl\s*oz|fluid\s*ounces?)/i,
    /(\d+(?:\.\d+)?)\s*(?:pint|pt)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0].trim();
    }
  }
  return null;
}

/**
 * Check for government warning statement
 */
function hasGovernmentWarning(text) {
  const normalizedText = normalizeText(text);
  
  // Check for key phrases in the government warning
  const requiredPhrases = [
    'government warning',
    'surgeon general',
  ];
  
  let foundCount = 0;
  for (const phrase of requiredPhrases) {
    if (normalizedText.includes(phrase)) {
      foundCount++;
    }
  }
  
  // Return true if we found at least one key phrase
  return foundCount >= 1;
}

/**
 * Main verification function
 */
export function verifyLabel(formData, extractedText) {
  const results = {
    overallMatch: true,
    checks: [],
    extractedText: extractedText,
  };

  // 1. Check Brand Name
  const brandCheck = {
    field: 'Brand Name',
    expected: formData.brandName,
    found: null,
    match: false,
  };

  if (formData.brandName) {
    brandCheck.found = findInText(extractedText, formData.brandName);
    brandCheck.match = brandCheck.found;
    if (!brandCheck.match) {
      results.overallMatch = false;
    }
  }
  results.checks.push(brandCheck);

  // 2. Check Product Class/Type
  const productTypeCheck = {
    field: 'Product Class/Type',
    expected: formData.productType,
    found: null,
    match: false,
  };

  if (formData.productType) {
    productTypeCheck.found = findInText(extractedText, formData.productType);
    productTypeCheck.match = productTypeCheck.found;
    if (!productTypeCheck.match) {
      results.overallMatch = false;
    }
  }
  results.checks.push(productTypeCheck);

  // 3. Check Alcohol Content
  const alcoholCheck = {
    field: 'Alcohol Content (ABV)',
    expected: formData.alcoholContent ? `${formData.alcoholContent}%` : null,
    found: null,
    match: false,
  };

  if (formData.alcoholContent) {
    const extractedABV = extractAlcoholContent(extractedText);
    alcoholCheck.found = extractedABV ? `${extractedABV}%` : 'Not found';
    
    // Allow small tolerance (0.5% difference) for OCR errors
    if (extractedABV !== null) {
      const expectedABV = parseFloat(formData.alcoholContent);
      const difference = Math.abs(extractedABV - expectedABV);
      alcoholCheck.match = difference <= 0.5;
    }
    
    if (!alcoholCheck.match) {
      results.overallMatch = false;
    }
  }
  results.checks.push(alcoholCheck);

  // 4. Check Net Contents (if provided)
  if (formData.netContents) {
    const netContentsCheck = {
      field: 'Net Contents',
      expected: formData.netContents,
      found: null,
      match: false,
    };

    const extractedVolume = extractNetContents(extractedText);
    netContentsCheck.found = extractedVolume || 'Not found';
    
    // Flexible matching for volume - normalize both and compare
    if (extractedVolume) {
      // Remove all spaces and normalize case for comparison
      const normalizedExtracted = normalizeText(extractedVolume).replace(/\s/g, '');
      const normalizedExpected = normalizeText(formData.netContents).replace(/\s/g, '');
      
      // Check if they match or if one contains the other
      netContentsCheck.match = normalizedExtracted.includes(normalizedExpected) || 
                                normalizedExpected.includes(normalizedExtracted);
    }
    
    if (!netContentsCheck.match) {
      results.overallMatch = false;
    }
    
    results.checks.push(netContentsCheck);
  }

  // 5. Check Government Warning (mandatory)
  const warningCheck = {
    field: 'Government Warning Statement',
    expected: 'Required by law',
    found: null,
    match: false,
  };

  warningCheck.match = hasGovernmentWarning(extractedText);
  warningCheck.found = warningCheck.match ? 'Present' : 'Not found';
  
  if (!warningCheck.match) {
    results.overallMatch = false;
  }
  results.checks.push(warningCheck);

  return results;
}

