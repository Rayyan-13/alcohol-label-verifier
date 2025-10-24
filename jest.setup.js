// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Polyfill TextEncoder/TextDecoder for Node.js environment
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock environment variables for tests
process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON = JSON.stringify({
  type: 'service_account',
  project_id: 'test-project',
  private_key: 'test-key',
  client_email: 'test@test.iam.gserviceaccount.com',
})

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

// Mock Google Cloud Vision API
jest.mock('@google-cloud/vision', () => ({
  ImageAnnotatorClient: jest.fn().mockImplementation(() => ({
    textDetection: jest.fn().mockResolvedValue([
      {
        textAnnotations: [
          {
            description: 'JACK DANIELS\nOLD NO. 7\nTENNESSEE WHISKEY\n40% ALC/VOL\n750 ML\nGOVERNMENT WARNING',
          },
        ],
      },
    ]),
  })),
}))

