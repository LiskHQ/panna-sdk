import { PannaApiService, type PannaApiConfig } from './api-service';
import {
  AccountEventType,
  type AccountUpdateActivityRequest,
  type DisconnectActivityRequest,
  type OnConnectActivityRequest
} from './types';

// Mock fetch globally
global.fetch = jest.fn();

// Mock environment variables
const originalEnv = process.env;

describe('PannaApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('constructor', () => {
    it('should create instance with default config', () => {
      const service = new PannaApiService();
      expect(service).toBeInstanceOf(PannaApiService);
    });

    it('should create instance with custom config', () => {
      const config: PannaApiConfig = {
        baseUrl: 'https://custom-api.example.com/v1',
        isMockMode: true
      };
      const service = new PannaApiService(config);
      expect(service).toBeInstanceOf(PannaApiService);
    });

    it('should merge custom config with defaults', () => {
      process.env.PANNA_API_URL = 'https://default-api.example.com/v1';
      process.env.MOCK_PANNA_API = 'false';

      const config: PannaApiConfig = {
        isMockMode: true
      };
      const service = new PannaApiService(config);
      expect(service).toBeInstanceOf(PannaApiService);
    });

    it('should handle undefined environment variables', () => {
      delete process.env.PANNA_API_URL;
      delete process.env.MOCK_PANNA_API;

      const service = new PannaApiService();
      expect(service).toBeInstanceOf(PannaApiService);
    });
  });

  describe('sendAccountEvent', () => {
    const testAddress = '0x1234567890123456789012345678901234567890';
    const mockOnConnectPayload: OnConnectActivityRequest = {
      eventType: AccountEventType.ON_CONNECT,
      timestamp: '2024-01-01T10:00:00Z',
      ecosystemId: 'ecosystem.lisk',
      partnerId: '123e4567-e89b-12d3-a456-426614174000',
      chainId: 4202,
      smartAccount: {
        chain: 'lisk-sepolia',
        factoryAddress: '0x4be0ddfebca9a5a4a617dee4dece99e7c862dceb',
        entrypointAddress: '0x0000000071727De22E5E9d8BAf0edAc6f37da032',
        sponsorGas: true
      },
      social: {
        type: 'email',
        data: 'user@example.com'
      }
    };

    const mockDisconnectPayload: DisconnectActivityRequest = {
      eventType: AccountEventType.DISCONNECT,
      timestamp: '2024-01-01T11:00:00Z',
      ecosystemId: 'ecosystem.lisk',
      partnerId: '123e4567-e89b-12d3-a456-426614174000',
      chainId: 4202,
      reason: 'User initiated'
    };

    const mockAccountUpdatePayload: AccountUpdateActivityRequest = {
      eventType: AccountEventType.ACCOUNT_UPDATE,
      timestamp: '2024-01-01T12:00:00Z',
      ecosystemId: 'ecosystem.lisk',
      partnerId: '123e4567-e89b-12d3-a456-426614174000',
      chainId: 4202,
      updateType: 'profile_change'
    };

    describe('mock mode', () => {
      it('should return mock response for onConnect event', async () => {
        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com',
          isMockMode: true
        });

        const response = await service.sendAccountEvent(
          testAddress,
          mockOnConnectPayload
        );

        expect(response.status).toBe(201);
        expect(response.headers.get('Content-Type')).toBe('application/json');

        const responseData = await response.json();
        expect(responseData).toEqual({
          details: {
            id: 'c59309e4-3647-49a8-bf32-beab50923a27'
          },
          message: 'Account event received',
          status: 'success'
        });
      });

      it('should return mock response for disconnect event', async () => {
        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com',
          isMockMode: true
        });

        const response = await service.sendAccountEvent(
          testAddress,
          mockDisconnectPayload
        );

        expect(response.status).toBe(201);
        const responseData = await response.json();
        expect(responseData.status).toBe('success');
      });

      it('should return mock response for accountUpdate event', async () => {
        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com',
          isMockMode: true
        });

        const response = await service.sendAccountEvent(
          testAddress,
          mockAccountUpdatePayload
        );

        expect(response.status).toBe(201);
        const responseData = await response.json();
        expect(responseData.status).toBe('success');
      });

      it('should ignore authToken in mock mode', async () => {
        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com',
          isMockMode: true
        });

        const response = await service.sendAccountEvent(
          testAddress,
          mockOnConnectPayload,
          'mock-auth-token'
        );

        expect(response.status).toBe(201);
      });
    });

    describe('real mode', () => {
      beforeEach(() => {
        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          status: 201,
          statusText: 'Created',
          json: async () => ({ success: true })
        });
      });

      it('should make correct fetch request for onConnect event', async () => {
        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: false
        });

        await service.sendAccountEvent(testAddress, mockOnConnectPayload);

        expect(fetch).toHaveBeenCalledWith(
          `https://stg-panna-app.lisk.com/v1/account/${testAddress}/activity`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(mockOnConnectPayload)
          }
        );
      });

      it('should include Authorization header when authToken provided', async () => {
        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: false
        });
        const authToken = 'Bearer test-token-123';

        await service.sendAccountEvent(
          testAddress,
          mockOnConnectPayload,
          authToken
        );

        expect(fetch).toHaveBeenCalledWith(
          `https://stg-panna-app.lisk.com/v1/account/${testAddress}/activity`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify(mockOnConnectPayload)
          }
        );
      });

      it('should handle successful response', async () => {
        const mockResponse = { id: 'success-response-id', status: 'created' };
        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          status: 201,
          statusText: 'Created',
          json: async () => mockResponse
        });

        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: false
        });

        const response = await service.sendAccountEvent(
          testAddress,
          mockDisconnectPayload
        );

        expect(response.ok).toBe(true);
        expect(response.status).toBe(201);
      });

      it('should construct correct URL from baseUrl and address', async () => {
        const service = new PannaApiService({
          baseUrl: 'https://custom.api.com/v1',
          isMockMode: false
        });

        await service.sendAccountEvent(testAddress, mockAccountUpdatePayload);

        expect(fetch).toHaveBeenCalledWith(
          `https://custom.api.com/v1/account/${testAddress}/activity`,
          expect.any(Object)
        );
      });

      it('should handle different event types correctly', async () => {
        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: false
        });

        // Test onConnect
        await service.sendAccountEvent(testAddress, mockOnConnectPayload);
        expect(fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            body: JSON.stringify(mockOnConnectPayload)
          })
        );

        // Test disconnect
        await service.sendAccountEvent(testAddress, mockDisconnectPayload);
        expect(fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            body: JSON.stringify(mockDisconnectPayload)
          })
        );

        // Test accountUpdate
        await service.sendAccountEvent(testAddress, mockAccountUpdatePayload);
        expect(fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            body: JSON.stringify(mockAccountUpdatePayload)
          })
        );
      });
    });

    describe('error handling', () => {
      it('should throw error when fetch fails', async () => {
        (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: false
        });

        await expect(
          service.sendAccountEvent(testAddress, mockOnConnectPayload)
        ).rejects.toThrow('Network error');
      });

      it('should throw error when response is not ok', async () => {
        (fetch as jest.Mock).mockResolvedValue({
          ok: false,
          status: 400,
          statusText: 'Bad Request'
        });

        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com',
          isMockMode: false
        });

        await expect(
          service.sendAccountEvent(testAddress, mockOnConnectPayload)
        ).rejects.toThrow('Panna API request failed: 400 Bad Request');
      });

      it('should throw error for 401 Unauthorized', async () => {
        (fetch as jest.Mock).mockResolvedValue({
          ok: false,
          status: 401,
          statusText: 'Unauthorized'
        });

        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: false
        });

        await expect(
          service.sendAccountEvent(testAddress, mockOnConnectPayload)
        ).rejects.toThrow('Panna API request failed: 401 Unauthorized');
      });

      it('should throw error for 500 Internal Server Error', async () => {
        (fetch as jest.Mock).mockResolvedValue({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error'
        });

        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: false
        });

        await expect(
          service.sendAccountEvent(testAddress, mockOnConnectPayload)
        ).rejects.toThrow(
          'Panna API request failed: 500 Internal Server Error'
        );
      });

      it('should log error and re-throw', async () => {
        const consoleErrorSpy = jest
          .spyOn(console, 'error')
          .mockImplementation();
        (fetch as jest.Mock).mockRejectedValue(new Error('Test error'));

        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: false
        });

        await expect(
          service.sendAccountEvent(testAddress, mockOnConnectPayload)
        ).rejects.toThrow('Test error');

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to send account event to Panna API:',
          expect.any(Error)
        );

        consoleErrorSpy.mockRestore();
      });
    });
  });

  describe('getSessionStatus', () => {
    describe('mock mode', () => {
      it('should return mock created status for sessionId containing "created"', async () => {
        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com',
          isMockMode: true
        });

        const result = await service.getSessionStatus({
          sessionId: 'session-created-123'
        });

        expect(result).toEqual(
          expect.objectContaining({
            session_id: expect.any(String),
            status: 'created'
          })
        );
      });

      it('should return mock pending status for sessionId containing "pending"', async () => {
        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com',
          isMockMode: true
        });

        const result = await service.getSessionStatus({
          sessionId: 'session-pending-456'
        });

        expect(result).toEqual(
          expect.objectContaining({
            session_id: expect.any(String),
            status: 'pending'
          })
        );
      });

      it('should return mock completed status for other sessionIds', async () => {
        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com',
          isMockMode: true
        });

        const result = await service.getSessionStatus({
          sessionId: 'session-789'
        });

        expect(result).toEqual(
          expect.objectContaining({
            session_id: expect.any(String),
            status: 'completed'
          })
        );
      });

      it('should include delay in mock mode', async () => {
        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com',
          isMockMode: true
        });

        const startTime = Date.now();
        await service.getSessionStatus({
          sessionId: 'session-123'
        });
        const endTime = Date.now();

        expect(endTime - startTime).toBeGreaterThanOrEqual(500);
      });

      it('should ignore authToken in mock mode', async () => {
        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com',
          isMockMode: true
        });

        const result = await service.getSessionStatus({
          sessionId: 'session-123',
          authToken: 'mock-auth-token'
        });

        expect(result).toBeDefined();
      });
    });

    describe('real mode', () => {
      beforeEach(() => {
        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          status: 200,
          statusText: 'OK',
          json: async () => ({
            success: true,
            data: {
              session_id: 'real-session-123',
              status: 'completed',
              crypto_amount: '100',
              crypto_currency: 'USDC',
              fiat_amount: '100',
              fiat_currency: 'USD'
            }
          })
        });
      });

      it('should make correct fetch request including Authorization header when authToken provided', async () => {
        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com',
          isMockMode: false
        });
        const authToken = 'test-jwt-token';

        await service.getSessionStatus({
          sessionId: 'session-123',
          authToken
        });

        expect(fetch).toHaveBeenCalledWith(
          'https://stg-panna-app.lisk.com/v1/onramp/session/session-123',
          expect.objectContaining({
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`
            }
          })
        );
      });

      it('should return parsed session status data', async () => {
        const mockData = {
          session_id: 'session-456',
          status: 'pending',
          crypto_amount: '50',
          crypto_currency: 'ETH',
          fiat_amount: '150',
          fiat_currency: 'EUR'
        };

        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            data: mockData
          })
        });

        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com',
          isMockMode: false
        });

        const result = await service.getSessionStatus({
          sessionId: 'session-456',
          authToken: 'test-token'
        });

        expect(result).toEqual(mockData);
      });

      it('should construct correct URL with baseUrl', async () => {
        const service = new PannaApiService({
          baseUrl: 'https://custom.api.com',
          isMockMode: false
        });

        await service.getSessionStatus({
          sessionId: 'custom-session',
          authToken: 'test-token'
        });

        expect(fetch).toHaveBeenCalledWith(
          'https://custom.api.com/v1/onramp/session/custom-session',
          expect.any(Object)
        );
      });
    });

    describe('validation', () => {
      it('should throw error when sessionId is empty', async () => {
        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com',
          isMockMode: false
        });

        await expect(
          service.getSessionStatus({
            sessionId: '',
            authToken: 'test-token'
          })
        ).rejects.toThrow('Session ID is required');
      });

      it('should throw error when sessionId is null', async () => {
        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com',
          isMockMode: false
        });

        await expect(
          service.getSessionStatus({
            sessionId: null as unknown as string,
            authToken: 'test-token'
          })
        ).rejects.toThrow('Session ID is required');
      });

      it('should throw error when authToken is null', async () => {
        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com',
          isMockMode: false
        });

        await expect(
          service.getSessionStatus({
            sessionId: 'session-123',
            authToken: null as unknown as string
          })
        ).rejects.toThrow('Auth token is required to fetch session status');
      });
    });

    describe('error handling', () => {
      it('should throw error when fetch fails', async () => {
        (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com',
          isMockMode: false
        });

        await expect(
          service.getSessionStatus({
            sessionId: 'session-123',
            authToken: 'test-token'
          })
        ).rejects.toThrow('Failed to get onramp.money session status');
      });

      it('should throw error when response is not ok', async () => {
        (fetch as jest.Mock).mockResolvedValue({
          ok: false,
          status: 404,
          statusText: 'Not Found'
        });

        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com',
          isMockMode: false
        });

        await expect(
          service.getSessionStatus({
            sessionId: 'non-existent',
            authToken: 'test-token'
          })
        ).rejects.toThrow('Failed to get session status: 404 Not Found');
      });

      it('should throw error for invalid response format - missing success', async () => {
        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          status: 200,
          json: async () => ({
            data: { session_id: 'session-123' }
          })
        });

        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com',
          isMockMode: false
        });

        await expect(
          service.getSessionStatus({
            sessionId: 'session-123',
            authToken: 'test-token'
          })
        ).rejects.toThrow('Invalid response format from API');
      });

      it('should throw error for invalid response format - missing session_id', async () => {
        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            data: { status: 'completed' }
          })
        });

        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com',
          isMockMode: false
        });

        await expect(
          service.getSessionStatus({
            sessionId: 'session-123',
            authToken: 'test-token'
          })
        ).rejects.toThrow('Invalid response format from API');
      });

      it('should throw error for invalid response format - missing status', async () => {
        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            data: { session_id: 'session-123' }
          })
        });

        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com',
          isMockMode: false
        });

        await expect(
          service.getSessionStatus({
            sessionId: 'session-123',
            authToken: 'test-token'
          })
        ).rejects.toThrow('Invalid response format from API');
      });

      it('should log error and include session ID in error message', async () => {
        const consoleErrorSpy = jest
          .spyOn(console, 'error')
          .mockImplementation();
        (fetch as jest.Mock).mockRejectedValue(new Error('Test error'));

        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com',
          isMockMode: false
        });

        const sessionId = 'error-session-123';

        await expect(
          service.getSessionStatus({
            sessionId,
            authToken: 'test-token'
          })
        ).rejects.toThrow(
          `Failed to get onramp.money session status for ${sessionId}`
        );

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error fetching session status:',
          expect.any(Error)
        );

        consoleErrorSpy.mockRestore();
      });

      it('should handle 401 Unauthorized', async () => {
        (fetch as jest.Mock).mockResolvedValue({
          ok: false,
          status: 401,
          statusText: 'Unauthorized'
        });

        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com',
          isMockMode: false
        });

        await expect(
          service.getSessionStatus({
            sessionId: 'session-123',
            authToken: 'invalid-token'
          })
        ).rejects.toThrow('Failed to get session status: 401 Unauthorized');
      });

      it('should handle 500 Internal Server Error', async () => {
        (fetch as jest.Mock).mockResolvedValue({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error'
        });

        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com',
          isMockMode: false
        });

        await expect(
          service.getSessionStatus({
            sessionId: 'session-123',
            authToken: 'test-token'
          })
        ).rejects.toThrow(
          'Failed to get session status: 500 Internal Server Error'
        );
      });
    });
  });

  describe('getOnrampQuote', () => {
    const mockQuoteRequest = {
      tokenSymbol: 'USDC',
      network: 'lisk',
      fiatAmount: 100,
      fiatCurrency: 'USD'
    };
    const mockAuthToken = 'mock-auth-token';

    describe('mock mode', () => {
      it('should return mock quote data', async () => {
        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: true
        });

        const quote = await service.getOnrampQuote(
          mockQuoteRequest,
          mockAuthToken
        );

        expect(quote).toEqual({
          rate: 1,
          crypto_quantity: mockQuoteRequest.fiatAmount,
          onramp_fee: 0,
          gas_fee: 0,
          total_fiat_amount: mockQuoteRequest.fiatAmount,
          quote_timestamp: expect.any(String),
          quote_validity_mins: 15
        });
      });

      it('should return mock quote with correct fiat amount', async () => {
        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: true
        });

        const customRequest = { ...mockQuoteRequest, fiatAmount: 250 };
        const quote = await service.getOnrampQuote(
          customRequest,
          mockAuthToken
        );

        expect(quote.crypto_quantity).toBe(250);
        expect(quote.total_fiat_amount).toBe(250);
      });

      it('should ignore authToken in mock mode', async () => {
        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: true
        });

        const quote = await service.getOnrampQuote(
          mockQuoteRequest,
          mockAuthToken
        );

        expect(quote).toBeDefined();
        expect(quote.rate).toBe(1);
      });
    });

    describe('real mode', () => {
      beforeEach(() => {
        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          status: 200,
          statusText: 'OK',
          json: async () => ({
            success: true,
            data: {
              rate: 0.98,
              crypto_quantity: 98,
              onramp_fee: 2.5,
              gas_fee: 0.5,
              total_fiat_amount: 100,
              quote_timestamp: '2024-01-01T10:00:00Z',
              quote_validity_mins: 15
            }
          }),
          text: async () => ''
        });
      });

      it('should make correct fetch request', async () => {
        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: false
        });

        await service.getOnrampQuote(mockQuoteRequest, mockAuthToken);

        expect(fetch).toHaveBeenCalledWith(
          'https://stg-panna-app.lisk.com/v1/onramp/quote',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${mockAuthToken}`
            },
            body: JSON.stringify({
              token_symbol: mockQuoteRequest.tokenSymbol,
              network: mockQuoteRequest.network,
              fiat_amount: mockQuoteRequest.fiatAmount,
              fiat_currency: mockQuoteRequest.fiatCurrency
            })
          }
        );
      });

      it('should include Authorization header when authToken provided', async () => {
        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: false
        });
        const authToken = 'test-token-123';

        await service.getOnrampQuote(mockQuoteRequest, authToken);

        expect(fetch).toHaveBeenCalledWith(
          'https://stg-panna-app.lisk.com/v1/onramp/quote',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify({
              token_symbol: mockQuoteRequest.tokenSymbol,
              network: mockQuoteRequest.network,
              fiat_amount: mockQuoteRequest.fiatAmount,
              fiat_currency: mockQuoteRequest.fiatCurrency
            })
          }
        );
      });

      it('should return quote data from successful response', async () => {
        const mockQuoteData = {
          rate: 0.98,
          crypto_quantity: 98,
          onramp_fee: 2.5,
          gas_fee: 0.5,
          total_fiat_amount: 100,
          quote_timestamp: '2024-01-01T10:00:00Z',
          quote_validity_mins: 15
        };

        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          status: 200,
          statusText: 'OK',
          json: async () => ({
            success: true,
            data: mockQuoteData
          }),
          text: async () => ''
        });

        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: false
        });

        const quote = await service.getOnrampQuote(
          mockQuoteRequest,
          mockAuthToken
        );

        expect(quote).toEqual(mockQuoteData);
      });

      it('should handle different token symbols and networks', async () => {
        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: false
        });

        const customRequest = {
          tokenSymbol: 'ETH',
          network: 'ethereum',
          fiatAmount: 500,
          fiatCurrency: 'EUR'
        };

        await service.getOnrampQuote(customRequest, mockAuthToken);

        expect(fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            body: JSON.stringify({
              token_symbol: 'ETH',
              network: 'ethereum',
              fiat_amount: 500,
              fiat_currency: 'EUR'
            })
          })
        );
      });
    });

    describe('error handling', () => {
      it('should throw error when baseUrl is not configured', async () => {
        const service = new PannaApiService({
          baseUrl: undefined,
          isMockMode: false
        });

        await expect(
          service.getOnrampQuote(mockQuoteRequest, mockAuthToken)
        ).rejects.toThrow('Panna API base URL is not configured.');
      });

      it('should throw error when authToken is missing', async () => {
        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: false
        });

        await expect(
          service.getOnrampQuote(mockQuoteRequest, '' as unknown as string)
        ).rejects.toThrow(
          'Authentication token is required to fetch onramp quotes.'
        );
      });

      it('should throw error when fetch fails', async () => {
        (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: false
        });

        await expect(
          service.getOnrampQuote(mockQuoteRequest, mockAuthToken)
        ).rejects.toThrow('Network error');
      });

      it('should throw error when response is not ok', async () => {
        (fetch as jest.Mock).mockResolvedValue({
          ok: false,
          status: 400,
          statusText: 'Bad Request',
          text: async () => 'Invalid request parameters'
        });

        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: false
        });

        await expect(
          service.getOnrampQuote(mockQuoteRequest, mockAuthToken)
        ).rejects.toThrow(
          'Panna API onramp quote failed: 400 Bad Request - Invalid request parameters'
        );
      });

      it('should throw error for 401 Unauthorized', async () => {
        (fetch as jest.Mock).mockResolvedValue({
          ok: false,
          status: 401,
          statusText: 'Unauthorized',
          text: async () => 'Invalid authentication token'
        });

        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: false
        });

        await expect(
          service.getOnrampQuote(mockQuoteRequest, 'invalid-token')
        ).rejects.toThrow('Panna API onramp quote failed: 401 Unauthorized');
      });

      it('should throw error for 500 Internal Server Error', async () => {
        (fetch as jest.Mock).mockResolvedValue({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          text: async () => 'Server error occurred'
        });

        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: false
        });

        await expect(
          service.getOnrampQuote(mockQuoteRequest, mockAuthToken)
        ).rejects.toThrow(
          'Panna API onramp quote failed: 500 Internal Server Error'
        );
      });

      it('should throw error when response success is false', async () => {
        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          status: 200,
          statusText: 'OK',
          json: async () => ({
            success: false,
            error: 'Quote generation failed'
          }),
          text: async () => ''
        });

        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: false
        });

        await expect(
          service.getOnrampQuote(mockQuoteRequest, mockAuthToken)
        ).rejects.toThrow(
          'Panna API onramp quote response marked as unsuccessful.'
        );
      });

      it('should log error and re-throw', async () => {
        const consoleErrorSpy = jest
          .spyOn(console, 'error')
          .mockImplementation();
        (fetch as jest.Mock).mockRejectedValue(new Error('Test error'));

        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: false
        });

        await expect(
          service.getOnrampQuote(mockQuoteRequest, mockAuthToken)
        ).rejects.toThrow('Test error');

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to fetch onramp quote from Panna API:',
          expect.any(Error)
        );

        consoleErrorSpy.mockRestore();
      });
    });
  });

  describe('getOnrampQuote', () => {
    const mockQuoteRequest = {
      tokenSymbol: 'USDC',
      network: 'lisk',
      fiatAmount: 100,
      fiatCurrency: 'USD'
    };

    describe('mock mode', () => {
      it('should return mock quote data', async () => {
        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: true
        });

        const quote = await service.getOnrampQuote(
          mockQuoteRequest,
          'test-auth-token'
        );

        expect(quote).toEqual({
          rate: 1,
          crypto_quantity: mockQuoteRequest.fiatAmount,
          onramp_fee: 0,
          gas_fee: 0,
          total_fiat_amount: mockQuoteRequest.fiatAmount,
          quote_timestamp: expect.any(String),
          quote_validity_mins: 15
        });
      });

      it('should return mock quote with correct fiat amount', async () => {
        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: true
        });

        const customRequest = { ...mockQuoteRequest, fiatAmount: 250 };
        const quote = await service.getOnrampQuote(
          customRequest,
          'test-auth-token'
        );

        expect(quote.crypto_quantity).toBe(250);
        expect(quote.total_fiat_amount).toBe(250);
      });

      it('should ignore authToken in mock mode', async () => {
        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: true
        });

        const quote = await service.getOnrampQuote(
          mockQuoteRequest,
          'mock-auth-token'
        );

        expect(quote).toBeDefined();
        expect(quote.rate).toBe(1);
      });
    });

    describe('real mode', () => {
      beforeEach(() => {
        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          status: 200,
          statusText: 'OK',
          json: async () => ({
            success: true,
            data: {
              rate: 0.98,
              crypto_quantity: 98,
              onramp_fee: 2.5,
              gas_fee: 0.5,
              total_fiat_amount: 100,
              quote_timestamp: '2024-01-01T10:00:00Z',
              quote_validity_mins: 15
            }
          }),
          text: async () => ''
        });
      });

      it('should make correct fetch request', async () => {
        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: false
        });

        await service.getOnrampQuote(mockQuoteRequest, 'test-auth-token');

        expect(fetch).toHaveBeenCalledWith(
          'https://stg-panna-app.lisk.com/v1/onramp/quote',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer test-auth-token'
            },
            body: JSON.stringify({
              token_symbol: mockQuoteRequest.tokenSymbol,
              network: mockQuoteRequest.network,
              fiat_amount: mockQuoteRequest.fiatAmount,
              fiat_currency: mockQuoteRequest.fiatCurrency
            })
          }
        );
      });

      it('should include Authorization header when authToken provided', async () => {
        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: false
        });
        const authToken = 'test-token-123';

        await service.getOnrampQuote(mockQuoteRequest, authToken);

        expect(fetch).toHaveBeenCalledWith(
          'https://stg-panna-app.lisk.com/v1/onramp/quote',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify({
              token_symbol: mockQuoteRequest.tokenSymbol,
              network: mockQuoteRequest.network,
              fiat_amount: mockQuoteRequest.fiatAmount,
              fiat_currency: mockQuoteRequest.fiatCurrency
            })
          }
        );
      });

      it('should return quote data from successful response', async () => {
        const mockQuoteData = {
          rate: 0.98,
          crypto_quantity: 98,
          onramp_fee: 2.5,
          gas_fee: 0.5,
          total_fiat_amount: 100,
          quote_timestamp: '2024-01-01T10:00:00Z',
          quote_validity_mins: 15
        };

        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          status: 200,
          statusText: 'OK',
          json: async () => ({
            success: true,
            data: mockQuoteData
          }),
          text: async () => ''
        });

        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: false
        });

        const quote = await service.getOnrampQuote(
          mockQuoteRequest,
          'test-auth-token'
        );

        expect(quote).toEqual(mockQuoteData);
      });

      it('should handle different token symbols and networks', async () => {
        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: false
        });

        const customRequest = {
          tokenSymbol: 'ETH',
          network: 'ethereum',
          fiatAmount: 500,
          fiatCurrency: 'EUR'
        };

        await service.getOnrampQuote(customRequest, 'test-auth-token');

        expect(fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            body: JSON.stringify({
              token_symbol: 'ETH',
              network: 'ethereum',
              fiat_amount: 500,
              fiat_currency: 'EUR'
            })
          })
        );
      });
    });

    describe('error handling', () => {
      it('should throw error when baseUrl is not configured', async () => {
        const service = new PannaApiService({
          baseUrl: undefined,
          isMockMode: false
        });

        await expect(
          service.getOnrampQuote(mockQuoteRequest, 'test-auth-token')
        ).rejects.toThrow('Panna API base URL is not configured.');
      });

      it('should throw error when fetch fails', async () => {
        (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: false
        });

        await expect(
          service.getOnrampQuote(mockQuoteRequest, 'test-auth-token')
        ).rejects.toThrow('Network error');
      });

      it('should throw error when response is not ok', async () => {
        (fetch as jest.Mock).mockResolvedValue({
          ok: false,
          status: 400,
          statusText: 'Bad Request',
          text: async () => 'Invalid request parameters'
        });

        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: false
        });

        await expect(
          service.getOnrampQuote(mockQuoteRequest, 'test-auth-token')
        ).rejects.toThrow(
          'Panna API onramp quote failed: 400 Bad Request - Invalid request parameters'
        );
      });

      it('should throw error for 401 Unauthorized', async () => {
        (fetch as jest.Mock).mockResolvedValue({
          ok: false,
          status: 401,
          statusText: 'Unauthorized',
          text: async () => 'Invalid authentication token'
        });

        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: false
        });

        await expect(
          service.getOnrampQuote(mockQuoteRequest, 'invalid-token')
        ).rejects.toThrow('Panna API onramp quote failed: 401 Unauthorized');
      });

      it('should throw error for 500 Internal Server Error', async () => {
        (fetch as jest.Mock).mockResolvedValue({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          text: async () => 'Server error occurred'
        });

        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: false
        });

        await expect(
          service.getOnrampQuote(mockQuoteRequest, 'test-auth-token')
        ).rejects.toThrow(
          'Panna API onramp quote failed: 500 Internal Server Error'
        );
      });

      it('should throw error when response success is false', async () => {
        (fetch as jest.Mock).mockResolvedValue({
          ok: true,
          status: 200,
          statusText: 'OK',
          json: async () => ({
            success: false,
            error: 'Quote generation failed'
          }),
          text: async () => ''
        });

        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: false
        });

        await expect(
          service.getOnrampQuote(mockQuoteRequest, 'test-auth-token')
        ).rejects.toThrow(
          'Panna API onramp quote response marked as unsuccessful.'
        );
      });

      it('should log error and re-throw', async () => {
        const consoleErrorSpy = jest
          .spyOn(console, 'error')
          .mockImplementation();
        (fetch as jest.Mock).mockRejectedValue(new Error('Test error'));

        const service = new PannaApiService({
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
          isMockMode: false
        });

        await expect(
          service.getOnrampQuote(mockQuoteRequest, 'test-auth-token')
        ).rejects.toThrow('Test error');

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to fetch onramp quote from Panna API:',
          expect.any(Error)
        );

        consoleErrorSpy.mockRestore();
      });
    });
  });
});
