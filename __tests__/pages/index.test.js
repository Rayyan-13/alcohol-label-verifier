import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '../../pages/index'

// Mock fetch
global.fetch = jest.fn()

describe('Home Page', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('should render the main heading', () => {
    render(<Home />)
    
    expect(screen.getByText(/TTB Label Verifier/i)).toBeInTheDocument()
  })

  it('should render all form inputs', () => {
    render(<Home />)

    expect(screen.getByLabelText(/Brand Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Product Class\/Type/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Alcohol Content \(ABV %\)/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Net Contents/i)).toBeInTheDocument()
  })

  it('should have file upload section', () => {
    render(<Home />)

    expect(screen.getAllByText(/Label Image/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/Click to upload/i)).toBeInTheDocument()
  })

  it('should have submit button', () => {
    render(<Home />)

    expect(screen.getByRole('button', { name: /Verify Label Compliance/i })).toBeInTheDocument()
  })

  describe('Form Validation', () => {
    it('should require brand name', async () => {
      render(<Home />)
      
      const submitButton = screen.getByRole('button', { name: /Verify Label Compliance/i })
      fireEvent.click(submitButton)

      // Form shouldn't submit without brand name
      await waitFor(() => {
        expect(fetch).not.toHaveBeenCalled()
      })
    })

    it('should require product type', async () => {
      render(<Home />)
      
      const brandInput = screen.getByLabelText(/Brand Name/i)
      await userEvent.type(brandInput, 'Jack Daniels')
      
      const submitButton = screen.getByRole('button', { name: /Verify Label Compliance/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(fetch).not.toHaveBeenCalled()
      })
    })

    it('should require alcohol content', async () => {
      render(<Home />)
      
      const brandInput = screen.getByLabelText(/Brand Name/i)
      const productInput = screen.getByLabelText(/Product Class\/Type/i)
      
      await userEvent.type(brandInput, 'Jack Daniels')
      await userEvent.type(productInput, 'Whiskey')
      
      const submitButton = screen.getByRole('button', { name: /Verify Label Compliance/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(fetch).not.toHaveBeenCalled()
      })
    })

    it('should require image upload', async () => {
      render(<Home />)
      
      const brandInput = screen.getByLabelText(/Brand Name/i)
      const productInput = screen.getByLabelText(/Product Class\/Type/i)
      const alcoholInput = screen.getByLabelText(/Alcohol Content \(ABV %\)/i)
      
      await userEvent.type(brandInput, 'Jack Daniels')
      await userEvent.type(productInput, 'Whiskey')
      await userEvent.type(alcoholInput, '40')
      
      const submitButton = screen.getByRole('button', { name: /Verify Label Compliance/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(fetch).not.toHaveBeenCalled()
      })
    })
  })

  describe('File Upload', () => {
    it('should accept image files', async () => {
      const { container } = render(<Home />)
      
      const file = new File(['dummy content'], 'label.jpg', { type: 'image/jpeg' })
      const input = container.querySelector('input[type="file"]')
      
      await userEvent.upload(input, file)

      // File name should be displayed
      await waitFor(() => {
        expect(screen.getByText(/Selected:/i)).toBeInTheDocument()
        expect(screen.getByText(/label.jpg/i)).toBeInTheDocument()
      })
    })

    it('should show preview of uploaded image', async () => {
      const { container } = render(<Home />)
      
      const file = new File(['dummy content'], 'label.jpg', { type: 'image/jpeg' })
      const input = container.querySelector('input[type="file"]')
      
      await userEvent.upload(input, file)

      // Image preview should be shown
      await waitFor(() => {
        const preview = screen.getByAltText(/Label preview/i)
        expect(preview).toBeInTheDocument()
      })
    })
  })

  describe('Form Submission', () => {
    it('should submit form with all fields filled', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          results: {
            overallMatch: true,
            checks: [],
            extractedText: 'TEST',
            ocrConfidence: 95,
            detectionCount: 10,
          },
          formData: {},
        }),
      })

      const { container } = render(<Home />)
      
      // Fill form
      const brandInput = screen.getByLabelText(/Brand Name/i)
      const productInput = screen.getByLabelText(/Product Class\/Type/i)
      const alcoholInput = screen.getByLabelText(/Alcohol Content \(ABV %\)/i)
      
      await userEvent.type(brandInput, 'Jack Daniels')
      await userEvent.type(productInput, 'Whiskey')
      await userEvent.type(alcoholInput, '40')
      
      // Upload file
      const file = new File(['dummy content'], 'label.jpg', { type: 'image/jpeg' })
      const fileInput = container.querySelector('input[type="file"]')
      await userEvent.upload(fileInput, file)
      
      // Submit
      const submitButton = screen.getByRole('button', { name: /Verify Label Compliance/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/verify', expect.objectContaining({
          method: 'POST',
        }))
      })
    })

    it('should show loading state during submission', async () => {
      fetch.mockImplementation(() => new Promise(() => {})) // Never resolves

      const { container } = render(<Home />)
      
      // Fill form
      await userEvent.type(screen.getByLabelText(/Brand Name/i), 'Jack Daniels')
      await userEvent.type(screen.getByLabelText(/Product Class\/Type/i), 'Whiskey')
      await userEvent.type(screen.getByLabelText(/Alcohol Content \(ABV %\)/i), '40')
      
      const file = new File(['dummy content'], 'label.jpg', { type: 'image/jpeg' })
      await userEvent.upload(container.querySelector('input[type="file"]'), file)
      
      const submitButton = screen.getByRole('button', { name: /Verify Label Compliance/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/Processing Image with AI/i)).toBeInTheDocument()
      })
    })

    it('should display results after successful submission', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          results: {
            overallMatch: true,
            checks: [
              { field: 'Brand Name', expected: 'Jack Daniels', found: 'JACK DANIELS', match: true },
            ],
            extractedText: 'JACK DANIELS',
            ocrConfidence: 95,
            detectionCount: 10,
          },
          formData: {},
        }),
      })

      const { container } = render(<Home />)
      
      // Fill and submit form
      await userEvent.type(screen.getByLabelText(/Brand Name/i), 'Jack Daniels')
      await userEvent.type(screen.getByLabelText(/Product Class\/Type/i), 'Whiskey')
      await userEvent.type(screen.getByLabelText(/Alcohol Content \(ABV %\)/i), '40')
      
      const file = new File(['dummy content'], 'label.jpg', { type: 'image/jpeg' })
      await userEvent.upload(container.querySelector('input[type="file"]'), file)
      
      fireEvent.click(screen.getByRole('button', { name: /Verify Label Compliance/i }))

      await waitFor(() => {
        expect(screen.getByText(/Label Approved/i)).toBeInTheDocument()
      })
    })

    it('should handle API errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'))

      const { container } = render(<Home />)
      
      // Fill and submit form
      await userEvent.type(screen.getByLabelText(/Brand Name/i), 'Jack Daniels')
      await userEvent.type(screen.getByLabelText(/Product Class\/Type/i), 'Whiskey')
      await userEvent.type(screen.getByLabelText(/Alcohol Content \(ABV %\)/i), '40')
      
      const file = new File(['dummy content'], 'label.jpg', { type: 'image/jpeg' })
      await userEvent.upload(container.querySelector('input[type="file"]'), file)
      
      fireEvent.click(screen.getByRole('button', { name: /Verify Label Compliance/i }))

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument()
      })
    })
  })

  describe('Drag and Drop', () => {
    it('should handle drag over event', () => {
      render(<Home />)
      
      const dropZone = screen.getByText(/Drag and drop/i).closest('label')
      
      fireEvent.dragOver(dropZone, {
        dataTransfer: {
          types: ['Files'],
        },
      })

      // Drop zone should indicate drag state
      expect(dropZone).toHaveClass('border-blue-500')
    })

    it('should handle drop event', async () => {
      render(<Home />)
      
      const file = new File(['dummy content'], 'label.jpg', { type: 'image/jpeg' })
      const dropZone = screen.getByText(/Drag and drop/i).closest('label')
      
      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [file],
        },
      })

      await waitFor(() => {
        expect(screen.getByText(/label.jpg/i)).toBeInTheDocument()
      })
    })
  })
})

