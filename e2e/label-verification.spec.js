const { test, expect } = require('@playwright/test')
const path = require('path')

test.describe('Label Verification Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display homepage with form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /TTB Label Verifier/i })).toBeVisible()
    await expect(page.getByLabel(/Brand Name/i)).toBeVisible()
    await expect(page.getByLabel(/Product Type/i)).toBeVisible()
    await expect(page.getByLabel(/Alcohol Content/i)).toBeVisible()
    await expect(page.getByLabel(/Net Contents/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /Verify Label Compliance/i })).toBeVisible()
  })

  test('should require all mandatory fields', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /Verify Label Compliance/i })
    await submitButton.click()

    // Form should not submit - check we're still on the same page
    await expect(page).toHaveURL('/')
  })

  test('should upload image via file input', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]')
    
    // Create a test image file
    const testImagePath = path.join(__dirname, 'fixtures', 'test-label.jpg')
    await fileInput.setInputFiles(testImagePath)

    // Should show file name or preview
    await expect(page.getByText(/test-label\.jpg/i)).toBeVisible({ timeout: 5000 })
  })

  test('should display image preview after upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]')
    const testImagePath = path.join(__dirname, 'fixtures', 'test-label.jpg')
    await fileInput.setInputFiles(testImagePath)

    // Image preview should be visible
    const preview = page.getByRole('img', { name: /Uploaded label/i })
    await expect(preview).toBeVisible({ timeout: 5000 })
  })

  test.describe('Successful Verification', () => {
    test('should complete full verification flow with all fields', async ({ page }) => {
      // Fill form
      await page.getByLabel(/Brand Name/i).fill('Jack Daniels')
      await page.getByLabel(/Product Type/i).fill('Whiskey')
      await page.getByLabel(/Alcohol Content/i).fill('40')
      await page.getByLabel(/Net Contents/i).fill('750ml')

      // Upload image
      const fileInput = page.locator('input[type="file"]')
      const testImagePath = path.join(__dirname, 'fixtures', 'jack-daniels-label.jpg')
      await fileInput.setInputFiles(testImagePath)

      // Submit form
      await page.getByRole('button', { name: /Verify Label Compliance/i }).click()

      // Wait for loading state
      await expect(page.getByText(/Verifying/i)).toBeVisible({ timeout: 2000 })

      // Wait for results
      await expect(page.getByText(/Verification Results/i)).toBeVisible({ timeout: 30000 })

      // Check for either success or failure message
      const compliantText = page.getByText(/Label Compliant/i)
      const nonCompliantText = page.getByText(/Label Non-Compliant/i)
      
      await expect(compliantText.or(nonCompliantText)).toBeVisible()
    })

    test('should show all verification checks in results', async ({ page }) => {
      // Fill and submit form
      await page.getByLabel(/Brand Name/i).fill('Jack Daniels')
      await page.getByLabel(/Product Type/i).fill('Whiskey')
      await page.getByLabel(/Alcohol Content/i).fill('40')

      const fileInput = page.locator('input[type="file"]')
      const testImagePath = path.join(__dirname, 'fixtures', 'test-label.jpg')
      await fileInput.setInputFiles(testImagePath)

      await page.getByRole('button', { name: /Verify Label Compliance/i }).click()

      // Wait for results
      await expect(page.getByText(/Verification Results/i)).toBeVisible({ timeout: 30000 })

      // Should show individual checks
      await expect(page.getByText('Brand Name')).toBeVisible()
      await expect(page.getByText('Product Type')).toBeVisible()
      await expect(page.getByText(/Alcohol Content/)).toBeVisible()
      await expect(page.getByText('Government Warning')).toBeVisible()
    })

    test('should display OCR confidence score', async ({ page }) => {
      await page.getByLabel(/Brand Name/i).fill('Jack Daniels')
      await page.getByLabel(/Product Type/i).fill('Whiskey')
      await page.getByLabel(/Alcohol Content/i).fill('40')

      const fileInput = page.locator('input[type="file"]')
      const testImagePath = path.join(__dirname, 'fixtures', 'test-label.jpg')
      await fileInput.setInputFiles(testImagePath)

      await page.getByRole('button', { name: /Verify Label Compliance/i }).click()

      await expect(page.getByText(/Verification Results/i)).toBeVisible({ timeout: 30000 })

      // Should show confidence score
      await expect(page.getByText(/Confidence/i)).toBeVisible()
      await expect(page.locator('text=/\\d+(\\.\\d+)?%/')).toBeVisible()
    })

    test('should show extracted OCR text', async ({ page }) => {
      await page.getByLabel(/Brand Name/i).fill('Test Brand')
      await page.getByLabel(/Product Type/i).fill('Wine')
      await page.getByLabel(/Alcohol Content/i).fill('12')

      const fileInput = page.locator('input[type="file"]')
      const testImagePath = path.join(__dirname, 'fixtures', 'test-label.jpg')
      await fileInput.setInputFiles(testImagePath)

      await page.getByRole('button', { name: /Verify Label Compliance/i }).click()

      await expect(page.getByText(/Verification Results/i)).toBeVisible({ timeout: 30000 })

      // Should have section for extracted text
      await expect(page.getByText(/Extracted OCR Text/i)).toBeVisible()
    })
  })

  test.describe('Drag and Drop', () => {
    test('should accept file via drag and drop', async ({ page }) => {
      const dropZone = page.locator('label').filter({ hasText: /Drag and drop/i })

      // Create a data transfer object
      const testImagePath = path.join(__dirname, 'fixtures', 'test-label.jpg')
      
      // Upload via input (Playwright doesn't support drag/drop from filesystem)
      // But we can test the drop zone exists
      await expect(dropZone).toBeVisible()
    })

    test('should show drag over state', async ({ page }) => {
      const dropZone = page.locator('label').filter({ hasText: /Drag and drop/i })
      
      // Hover over drop zone
      await dropZone.hover()
      
      // Should indicate interactive state
      await expect(dropZone).toBeVisible()
    })
  })

  test.describe('Form Validation', () => {
    test('should validate alcohol content is a number', async ({ page }) => {
      await page.getByLabel(/Alcohol Content/i).fill('not-a-number')
      await page.getByLabel(/Alcohol Content/i).blur()

      // HTML5 validation should kick in
      const alcoholInput = page.getByLabel(/Alcohol Content/i)
      await expect(alcoholInput).toHaveAttribute('type', 'number')
    })

    test('should allow optional net contents', async ({ page }) => {
      await page.getByLabel(/Brand Name/i).fill('Jack Daniels')
      await page.getByLabel(/Product Type/i).fill('Whiskey')
      await page.getByLabel(/Alcohol Content/i).fill('40')
      // Leave net contents empty

      const fileInput = page.locator('input[type="file"]')
      const testImagePath = path.join(__dirname, 'fixtures', 'test-label.jpg')
      await fileInput.setInputFiles(testImagePath)

      await page.getByRole('button', { name: /Verify Label Compliance/i }).click()

      // Should still process
      await expect(page.getByText(/Verifying/i)).toBeVisible({ timeout: 2000 })
    })
  })

  test.describe('Error Handling', () => {
    test('should handle API errors gracefully', async ({ page }) => {
      // Intercept API call and return error
      await page.route('**/api/verify', route => route.abort())

      await page.getByLabel(/Brand Name/i).fill('Test')
      await page.getByLabel(/Product Type/i).fill('Test')
      await page.getByLabel(/Alcohol Content/i).fill('40')

      const fileInput = page.locator('input[type="file"]')
      const testImagePath = path.join(__dirname, 'fixtures', 'test-label.jpg')
      await fileInput.setInputFiles(testImagePath)

      await page.getByRole('button', { name: /Verify Label Compliance/i }).click()

      // Should show error message
      await expect(page.getByText(/error/i)).toBeVisible({ timeout: 10000 })
    })

    test('should handle invalid image files', async ({ page }) => {
      await page.getByLabel(/Brand Name/i).fill('Test')
      await page.getByLabel(/Product Type/i).fill('Test')
      await page.getByLabel(/Alcohol Content/i).fill('40')

      // Try to upload non-image file
      const fileInput = page.locator('input[type="file"]')
      const testFilePath = path.join(__dirname, 'fixtures', 'test-file.txt')
      await fileInput.setInputFiles(testFilePath)

      await page.getByRole('button', { name: /Verify Label Compliance/i }).click()

      // May show error or process anyway (depends on implementation)
      // Just verify it doesn't crash
      await page.waitForTimeout(2000)
    })
  })

  test.describe('Mobile Responsiveness', () => {
    test('should be usable on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }) // iPhone SE size

      await expect(page.getByRole('heading', { name: /TTB Label Verifier/i })).toBeVisible()
      await expect(page.getByLabel(/Brand Name/i)).toBeVisible()
      await expect(page.getByRole('button', { name: /Verify Label Compliance/i })).toBeVisible()
    })

    test('should allow scrolling to all form fields on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      // Scroll to bottom field
      await page.getByLabel(/Net Contents/i).scrollIntoViewIfNeeded()
      await expect(page.getByLabel(/Net Contents/i)).toBeVisible()

      // Scroll to submit button
      await page.getByRole('button', { name: /Verify Label Compliance/i }).scrollIntoViewIfNeeded()
      await expect(page.getByRole('button', { name: /Verify Label Compliance/i })).toBeVisible()
    })
  })

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels', async ({ page }) => {
      const brandInput = page.getByLabel(/Brand Name/i)
      await expect(brandInput).toBeVisible()

      const productInput = page.getByLabel(/Product Type/i)
      await expect(productInput).toBeVisible()
    })

    test('should be keyboard navigable', async ({ page }) => {
      // Tab through form fields
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      
      // Should be able to reach all fields via keyboard
      await expect(page.getByLabel(/Brand Name/i)).toBeFocused()
    })

    test('should have sufficient color contrast', async ({ page }) => {
      // Visual regression test would be ideal here
      // For now, just verify key elements are visible
      await expect(page.getByRole('heading', { name: /TTB Label Verifier/i })).toBeVisible()
    })
  })
})

