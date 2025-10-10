import {
  PannaApiService,
  pannaApiService,
  type PannaApiConfig
} from './api-service';
import {
  type OnConnectActivityRequest,
  type DisconnectActivityRequest,
  type AccountUpdateActivityRequest,
  AccountEventType
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
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
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
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
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
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
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
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
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
          baseUrl: 'https://stg-panna-app.lisk.com/v1',
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

  describe('default instance', () => {
    it('should export a default instance', () => {
      expect(pannaApiService).toBeInstanceOf(PannaApiService);
    });

    it('should be ready to use without configuration', async () => {
      const service = new PannaApiService({ isMockMode: true });

      const testPayload: OnConnectActivityRequest = {
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
          data: 'test@example.com'
        }
      };

      const response = await service.sendAccountEvent(
        '0x1234567890123456789012345678901234567890',
        testPayload
      );

      expect(response.status).toBe(201);
    });
  });

  describe('configuration edge cases', () => {
    it('should handle missing baseUrl gracefully', async () => {
      const service = new PannaApiService({
        baseUrl: undefined,
        isMockMode: true
      });

      const testPayload: DisconnectActivityRequest = {
        eventType: AccountEventType.DISCONNECT,
        timestamp: '2024-01-01T11:00:00Z',
        ecosystemId: 'ecosystem.lisk',
        partnerId: '123e4567-e89b-12d3-a456-426614174000',
        chainId: 4202
      };

      const response = await service.sendAccountEvent(
        '0x1234567890123456789012345678901234567890',
        testPayload
      );

      expect(response.status).toBe(201);
    });

    it('should handle environment variables correctly', () => {
      process.env.PANNA_API_URL = 'https://env-api.example.com/v1';
      process.env.MOCK_PANNA_API = 'true';

      const service = new PannaApiService();
      expect(service).toBeInstanceOf(PannaApiService);
    });

    it('should handle invalid MOCK_PANNA_API environment variable', () => {
      process.env.MOCK_PANNA_API = 'invalid-value';

      const service = new PannaApiService();
      expect(service).toBeInstanceOf(PannaApiService);
    });
  });
});
