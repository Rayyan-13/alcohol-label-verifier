import { verifyLabel } from '../../lib/verification'

describe('verifyLabel', () => {
  describe('Brand Name Verification', () => {
    it('should pass when brand name is found in OCR text', () => {
      const formData = {
        brandName: 'Jack Daniels',
        productType: 'Whiskey',
        alcoholContent: '40',
        netContents: '750ml',
      }
      const ocrText = 'JACK DANIELS OLD NO. 7 TENNESSEE WHISKEY 40% ALC/VOL 750 ML GOVERNMENT WARNING'

      const result = verifyLabel(formData, ocrText)

      expect(result.overallMatch).toBe(true)
      const brandCheck = result.checks.find((c) => c.field === 'Brand Name')
      expect(brandCheck.match).toBe(true)
      expect(brandCheck.found).toBe(true)
    })

    it('should fail when brand name is not found', () => {
      const formData = {
        brandName: 'Grey Goose',
        productType: 'Vodka',
        alcoholContent: '40',
        netContents: '',
      }
      const ocrText = 'JACK DANIELS WHISKEY'

      const result = verifyLabel(formData, ocrText)

      expect(result.overallMatch).toBe(false)
      const brandCheck = result.checks.find((c) => c.field === 'Brand Name')
      expect(brandCheck.match).toBe(false)
    })

    it('should be case-insensitive', () => {
      const formData = {
        brandName: 'jack daniels',
        productType: 'Whiskey',
        alcoholContent: '40',
        netContents: '',
      }
      const ocrText = 'JACK DANIELS WHISKEY 40% GOVERNMENT WARNING'

      const result = verifyLabel(formData, ocrText)

      const brandCheck = result.checks.find((c) => c.field === 'Brand Name')
      expect(brandCheck.match).toBe(true)
    })
  })

  describe('Product Type Verification', () => {
    it('should pass when product type is found', () => {
      const formData = {
        brandName: 'Jack Daniels',
        productType: 'Whiskey',
        alcoholContent: '40',
        netContents: '',
      }
      const ocrText = 'JACK DANIELS TENNESSEE WHISKEY 40% GOVERNMENT WARNING'

      const result = verifyLabel(formData, ocrText)

      const productCheck = result.checks.find((c) => c.field === 'Product Class/Type')
      expect(productCheck.match).toBe(true)
      expect(productCheck.found).toBe(true)
    })

    it('should fail when product type is not found', () => {
      const formData = {
        brandName: 'Jack Daniels',
        productType: 'Vodka',
        alcoholContent: '40',
        netContents: '',
      }
      const ocrText = 'JACK DANIELS WHISKEY 40% GOVERNMENT WARNING'

      const result = verifyLabel(formData, ocrText)

      expect(result.overallMatch).toBe(false)
      const productCheck = result.checks.find((c) => c.field === 'Product Class/Type')
      expect(productCheck.match).toBe(false)
    })
  })

  describe('Alcohol Content Verification', () => {
    it('should pass when ABV matches exactly', () => {
      const formData = {
        brandName: 'Jack Daniels',
        productType: 'Whiskey',
        alcoholContent: '40',
        netContents: '',
      }
      const ocrText = 'JACK DANIELS WHISKEY 40% ALC/VOL GOVERNMENT WARNING'

      const result = verifyLabel(formData, ocrText)

      const abvCheck = result.checks.find((c) => c.field === 'Alcohol Content (ABV)')
      expect(abvCheck.match).toBe(true)
      expect(abvCheck.found).toBe('40%')
    })

    it('should pass when ABV is within tolerance (±0.5%)', () => {
      const formData = {
        brandName: 'Jack Daniels',
        productType: 'Whiskey',
        alcoholContent: '40',
        netContents: '',
      }
      const ocrText = 'JACK DANIELS WHISKEY 40.3% ALC/VOL'

      const result = verifyLabel(formData, ocrText)

      const abvCheck = result.checks.find((c) => c.field === 'Alcohol Content (ABV)')
      expect(abvCheck.match).toBe(true)
    })

    it('should fail when ABV is outside tolerance', () => {
      const formData = {
        brandName: 'Jack Daniels',
        productType: 'Whiskey',
        alcoholContent: '40',
        netContents: '',
      }
      const ocrText = 'JACK DANIELS WHISKEY 45% ALC/VOL'

      const result = verifyLabel(formData, ocrText)

      expect(result.overallMatch).toBe(false)
      const abvCheck = result.checks.find((c) => c.field === 'Alcohol Content (ABV)')
      expect(abvCheck.match).toBe(false)
    })

    it('should handle various ABV formats', () => {
      const formats = [
        '40%',
        '40% ABV',
        '40% ALC/VOL',
        'ALC 40% BY VOL',
        '40 PERCENT ALCOHOL',
      ]

      formats.forEach((format) => {
        const formData = {
          brandName: 'Test',
          productType: 'Whiskey',
          alcoholContent: '40',
          netContents: '',
        }
        const ocrText = `TEST WHISKEY ${format} GOVERNMENT WARNING`

        const result = verifyLabel(formData, ocrText)
        const abvCheck = result.checks.find((c) => c.field === 'Alcohol Content (ABV)')
        
        expect(abvCheck.match).toBe(true)
      })
    })

    it('should fail when ABV is not found', () => {
      const formData = {
        brandName: 'Jack Daniels',
        productType: 'Whiskey',
        alcoholContent: '40',
        netContents: '',
      }
      const ocrText = 'JACK DANIELS WHISKEY'

      const result = verifyLabel(formData, ocrText)

      expect(result.overallMatch).toBe(false)
      const abvCheck = result.checks.find((c) => c.field === 'Alcohol Content (ABV)')
      expect(abvCheck.match).toBe(false)
      expect(abvCheck.found).toBe('Not found')
    })
  })

  describe('Net Contents Verification', () => {
    it('should pass when net contents matches', () => {
      const formData = {
        brandName: 'Jack Daniels',
        productType: 'Whiskey',
        alcoholContent: '40',
        netContents: '750ml',
      }
      const ocrText = 'JACK DANIELS WHISKEY 40% ALC/VOL 750 ML'

      const result = verifyLabel(formData, ocrText)

      const netContentsCheck = result.checks.find((c) => c.field === 'Net Contents')
      expect(netContentsCheck.match).toBe(true)
    })

    it('should handle different spacing and case variations', () => {
      const formData = {
        brandName: 'Test',
        productType: 'Whiskey',
        alcoholContent: '40',
        netContents: '750 ml',
      }
      const ocrText = 'TEST WHISKEY 750ML'

      const result = verifyLabel(formData, ocrText)

      const netContentsCheck = result.checks.find((c) => c.field === 'Net Contents')
      expect(netContentsCheck.match).toBe(true)
    })

    it('should handle various volume formats', () => {
      const testCases = [
        { input: '750ml', ocr: '750 ML' },
        { input: '1L', ocr: '1 LITER' },
        { input: '750 mL', ocr: '750ML' },
        { input: '1.75L', ocr: '1.75 LITERS' },
      ]

      testCases.forEach(({ input, ocr }) => {
        const formData = {
          brandName: 'Test',
          productType: 'Whiskey',
          alcoholContent: '40',
          netContents: input,
        }
        const ocrText = `TEST WHISKEY 40% ${ocr}`

        const result = verifyLabel(formData, ocrText)
        const netContentsCheck = result.checks.find((c) => c.field === 'Net Contents')
        
        expect(netContentsCheck.match).toBe(true)
      })
    })

    it('should not check if net contents is not provided', () => {
      const formData = {
        brandName: 'Jack Daniels',
        productType: 'Whiskey',
        alcoholContent: '40',
        netContents: '',
      }
      const ocrText = 'JACK DANIELS WHISKEY 40%'

      const result = verifyLabel(formData, ocrText)

      const netContentsCheck = result.checks.find((c) => c.field === 'Net Contents')
      expect(netContentsCheck).toBeUndefined()
    })
  })

  describe('Government Warning Verification', () => {
    it('should pass when government warning is present', () => {
      const formData = {
        brandName: 'Jack Daniels',
        productType: 'Whiskey',
        alcoholContent: '40',
        netContents: '',
      }
      const ocrText = 'JACK DANIELS WHISKEY 40% GOVERNMENT WARNING: ACCORDING TO THE SURGEON GENERAL'

      const result = verifyLabel(formData, ocrText)

      const warningCheck = result.checks.find((c) => c.field === 'Government Warning Statement')
      expect(warningCheck.match).toBe(true)
    })

    it('should pass with partial warning text', () => {
      const formData = {
        brandName: 'Jack Daniels',
        productType: 'Whiskey',
        alcoholContent: '40',
        netContents: '',
      }
      const ocrText = 'JACK DANIELS WHISKEY 40% GOVERNMENT WARNING'

      const result = verifyLabel(formData, ocrText)

      const warningCheck = result.checks.find((c) => c.field === 'Government Warning Statement')
      expect(warningCheck.match).toBe(true)
    })

    it('should fail when government warning is missing', () => {
      const formData = {
        brandName: 'Jack Daniels',
        productType: 'Whiskey',
        alcoholContent: '40',
        netContents: '',
      }
      const ocrText = 'JACK DANIELS WHISKEY 40%'

      const result = verifyLabel(formData, ocrText)

      expect(result.overallMatch).toBe(false)
      const warningCheck = result.checks.find((c) => c.field === 'Government Warning Statement')
      expect(warningCheck.match).toBe(false)
    })
  })

  describe('Overall Verification', () => {
    it('should pass when all checks pass', () => {
      const formData = {
        brandName: 'Jack Daniels',
        productType: 'Whiskey',
        alcoholContent: '40',
        netContents: '750ml',
      }
      const ocrText = 'JACK DANIELS OLD NO. 7 TENNESSEE WHISKEY 40% ALC/VOL 750 ML GOVERNMENT WARNING'

      const result = verifyLabel(formData, ocrText)

      expect(result.overallMatch).toBe(true)
      expect(result.checks.every((c) => c.match)).toBe(true)
    })

    it('should fail if any check fails', () => {
      const formData = {
        brandName: 'Jack Daniels',
        productType: 'Vodka', // Wrong type
        alcoholContent: '40',
        netContents: '750ml',
      }
      const ocrText = 'JACK DANIELS WHISKEY 40% 750ML GOVERNMENT WARNING'

      const result = verifyLabel(formData, ocrText)

      expect(result.overallMatch).toBe(false)
    })

    it('should return extracted text', () => {
      const formData = {
        brandName: 'Jack Daniels',
        productType: 'Whiskey',
        alcoholContent: '40',
        netContents: '',
      }
      const ocrText = 'JACK DANIELS WHISKEY 40% GOVERNMENT WARNING'

      const result = verifyLabel(formData, ocrText)

      expect(result.extractedText).toBe(ocrText)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty OCR text', () => {
      const formData = {
        brandName: 'Jack Daniels',
        productType: 'Whiskey',
        alcoholContent: '40',
        netContents: '',
      }
      const ocrText = ''

      const result = verifyLabel(formData, ocrText)

      expect(result.overallMatch).toBe(false)
      expect(result.checks.every((c) => !c.match)).toBe(true)
    })

    it('should handle special characters in brand name', () => {
      const formData = {
        brandName: "Maker's Mark",
        productType: 'Bourbon',
        alcoholContent: '45',
        netContents: '',
      }
      const ocrText = "MAKER'S MARK KENTUCKY STRAIGHT BOURBON 45% GOVERNMENT WARNING"

      const result = verifyLabel(formData, ocrText)

      const brandCheck = result.checks.find((c) => c.field === 'Brand Name')
      expect(brandCheck.match).toBe(true)
    })

    it('should handle decimal ABV values', () => {
      const formData = {
        brandName: 'Test',
        productType: 'Whiskey',
        alcoholContent: '43.5',
        netContents: '',
      }
      const ocrText = 'TEST WHISKEY 43.5% ABV GOVERNMENT WARNING'

      const result = verifyLabel(formData, ocrText)

      const abvCheck = result.checks.find((c) => c.field === 'Alcohol Content (ABV)')
      expect(abvCheck.match).toBe(true)
    })
  })
})

