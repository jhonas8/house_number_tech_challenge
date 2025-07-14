import axios from 'axios';
import { snippetService } from '../snippetService';
import { Snippet, CreateSnippetRequest } from '../../types/snippet';

// Mock axios
jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

describe('snippetService', () => {
  const mockSnippet: Snippet = {
    id: '1',
    title: 'Test Snippet',
    content: 'Test Content',
    summary: 'Test Summary',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  };

  const mockCreateRequest: CreateSnippetRequest = {
    title: 'Test Snippet',
    content: 'Test Content'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment variable
    delete process.env.REACT_APP_API_URL;
  });

  describe('createSnippet', () => {
    it('should create a snippet successfully', async () => {
      mockAxios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue({ data: mockSnippet }),
        get: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        patch: jest.fn(),
        request: jest.fn(),
        interceptors: { request: { use: jest.fn(), eject: jest.fn() }, response: { use: jest.fn(), eject: jest.fn() } },
        defaults: {},
        getUri: jest.fn(),
        delete: jest.fn(),
        head: jest.fn(),
        options: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        patch: jest.fn()
      } as any);

      const result = await snippetService.createSnippet(mockCreateRequest);

      expect(result).toEqual(mockSnippet);
      expect(mockAxios.create).toHaveBeenCalledWith({
        baseURL: 'http://localhost:3000',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should use custom API URL when REACT_APP_API_URL is set', async () => {
      process.env.REACT_APP_API_URL = 'http://custom-api.com';
      
      mockAxios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue({ data: mockSnippet }),
        get: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        patch: jest.fn(),
        request: jest.fn(),
        interceptors: { request: { use: jest.fn(), eject: jest.fn() }, response: { use: jest.fn(), eject: jest.fn() } },
        defaults: {},
        getUri: jest.fn(),
        delete: jest.fn(),
        head: jest.fn(),
        options: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        patch: jest.fn()
      } as any);

      await snippetService.createSnippet(mockCreateRequest);

      expect(mockAxios.create).toHaveBeenCalledWith({
        baseURL: 'http://custom-api.com',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should throw error when API call fails', async () => {
      const error = new Error('Network error');
      mockAxios.create.mockReturnValue({
        post: jest.fn().mockRejectedValue(error),
        get: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        patch: jest.fn(),
        request: jest.fn(),
        interceptors: { request: { use: jest.fn(), eject: jest.fn() }, response: { use: jest.fn(), eject: jest.fn() } },
        defaults: {},
        getUri: jest.fn(),
        delete: jest.fn(),
        head: jest.fn(),
        options: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        patch: jest.fn()
      } as any);

      await expect(snippetService.createSnippet(mockCreateRequest)).rejects.toThrow('Network error');
    });
  });

  describe('getSnippet', () => {
    it('should get a snippet by id successfully', async () => {
      const mockAxiosInstance = {
        get: jest.fn().mockResolvedValue({ data: mockSnippet }),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        patch: jest.fn(),
        request: jest.fn(),
        interceptors: { request: { use: jest.fn(), eject: jest.fn() }, response: { use: jest.fn(), eject: jest.fn() } },
        defaults: {},
        getUri: jest.fn(),
        delete: jest.fn(),
        head: jest.fn(),
        options: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        patch: jest.fn()
      };

      mockAxios.create.mockReturnValue(mockAxiosInstance as any);

      const result = await snippetService.getSnippet('1');

      expect(result).toEqual(mockSnippet);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/snippets/1');
    });
  });

  describe('getAllSnippets', () => {
    it('should get all snippets successfully', async () => {
      const mockSnippets = [mockSnippet];
      const mockAxiosInstance = {
        get: jest.fn().mockResolvedValue({ data: mockSnippets }),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        patch: jest.fn(),
        request: jest.fn(),
        interceptors: { request: { use: jest.fn(), eject: jest.fn() }, response: { use: jest.fn(), eject: jest.fn() } },
        defaults: {},
        getUri: jest.fn(),
        delete: jest.fn(),
        head: jest.fn(),
        options: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        patch: jest.fn()
      };

      mockAxios.create.mockReturnValue(mockAxiosInstance as any);

      const result = await snippetService.getAllSnippets();

      expect(result).toEqual(mockSnippets);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/snippets');
    });
  });
}); 