import { render, screen } from '@testing-library/react'
import ResultsDisplay from '../../components/ResultsDisplay'

describe('ResultsDisplay Component', () => {
  const mockSuccessResults = {
    overallMatch: true,
    checks: [
      {
        field: 'Brand Name',
        expected: 'Jack Daniels',
        found: 'JACK DANIELS',
        match: true,
      },
      {
        field: 'Product Type',
        expected: 'Whiskey',
        found: 'WHISKEY',
        match: true,
      },
      {
        field: 'Alcohol Content (ABV)',
        expected: '40%',
        found: '40%',
        match: true,
      },
      {
        field: 'Government Warning',
        expected: 'Required',
        found: 'GOVERNMENT WARNING',
        match: true,
      },
    ],
    extractedText: 'JACK DANIELS WHISKEY 40% GOVERNMENT WARNING',
    ocrConfidence: 95.5,
    detectionCount: 15,
  }

  const mockFailureResults = {
    overallMatch: false,
    checks: [
      {
        field: 'Brand Name',
        expected: 'Jack Daniels',
        found: 'JACK DANIELS',
        match: true,
      },
      {
        field: 'Product Type',
        expected: 'Vodka',
        found: 'WHISKEY',
        match: false,
      },
      {
        field: 'Alcohol Content (ABV)',
        expected: '40%',
        found: 'Not found',
        match: false,
      },
      {
        field: 'Government Warning',
        expected: 'Required',
        found: 'Not found',
        match: false,
      },
    ],
    extractedText: 'JACK DANIELS WHISKEY',
    ocrConfidence: 92.0,
    detectionCount: 10,
  }

  const mockFormData = {
    brandName: 'Jack Daniels',
    productType: 'Whiskey',
    alcoholContent: '40',
    netContents: '750ml',
  }

  it('should render success message for passing verification', () => {
    render(<ResultsDisplay results={mockSuccessResults} formData={mockFormData} />)

    expect(screen.getByText(/Label Approved/i)).toBeInTheDocument()
    expect(screen.getByText(/matches the form data/i)).toBeInTheDocument()
  })

  it('should render failure message for failing verification', () => {
    render(<ResultsDisplay results={mockFailureResults} formData={mockFormData} />)

    expect(screen.getByText(/Label Verification Failed/i)).toBeInTheDocument()
    expect(screen.getByText(/does not match the form data/i)).toBeInTheDocument()
  })

  it('should display all verification checks', () => {
    render(<ResultsDisplay results={mockSuccessResults} formData={mockFormData} />)

    expect(screen.getByText('Brand Name')).toBeInTheDocument()
    expect(screen.getByText('Product Type')).toBeInTheDocument()
    expect(screen.getByText(/Alcohol Content/)).toBeInTheDocument()
    expect(screen.getByText('Government Warning')).toBeInTheDocument()
  })

  it('should show check marks for passed checks', () => {
    const { container } = render(
      <ResultsDisplay results={mockSuccessResults} formData={mockFormData} />
    )

    // All checks should pass, so we should see success indicators
    const successChecks = mockSuccessResults.checks.filter((c) => c.match)
    expect(successChecks.length).toBe(4)
  })

  it('should show X marks for failed checks', () => {
    render(<ResultsDisplay results={mockFailureResults} formData={mockFormData} />)

    // Product Type check should fail
    const productTypeSection = screen.getByText('Product Type').closest('div')
    expect(productTypeSection).toBeInTheDocument()
  })

  it('should display expected vs found values', () => {
    render(<ResultsDisplay results={mockSuccessResults} formData={mockFormData} />)

    expect(screen.getAllByText(/Jack Daniels/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/JACK DANIELS/i).length).toBeGreaterThan(0)
  })

  it('should show extracted text in collapsible section', () => {
    render(<ResultsDisplay results={mockSuccessResults} formData={mockFormData} />)

    expect(screen.getByText(/View Extracted Text/i)).toBeInTheDocument()
  })

  it('should handle missing optional fields', () => {
    const resultsWithoutNetContents = {
      ...mockSuccessResults,
      checks: mockSuccessResults.checks.filter((c) => c.field !== 'Net Contents'),
    }

    render(<ResultsDisplay results={resultsWithoutNetContents} formData={mockFormData} />)

    expect(screen.queryByText('Net Contents')).not.toBeInTheDocument()
  })

  it('should display all form data that was submitted', () => {
    render(<ResultsDisplay results={mockSuccessResults} formData={mockFormData} />)

    expect(screen.getAllByText(/Jack Daniels/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Whiskey/i).length).toBeGreaterThan(0)
  })
})

