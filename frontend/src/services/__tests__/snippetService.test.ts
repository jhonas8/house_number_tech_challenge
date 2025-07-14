// Mock axios BEFORE importing the service!
jest.mock('axios', () => {
  function mockCreateMockApiInstance() {
    return {
      post: jest.fn(),
      get: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      patch: jest.fn(),
      request: jest.fn(),
      interceptors: { request: { use: jest.fn(), eject: jest.fn() }, response: { use: jest.fn(), eject: jest.fn() } },
      defaults: {},
      getUri: jest.fn(),
      head: jest.fn(),
      options: jest.fn(),
    };
  }
  const mockAxiosCreate = jest.fn(() => {
    const instance = mockCreateMockApiInstance();
    return instance;
  });
  return {
    create: mockAxiosCreate,
  };
});

import axios from 'axios';
import { snippetService } from '../snippetService';
import { Snippet, CreateSnippetRequest } from '../../types/snippet';

const mockAxios = axios as jest.Mocked<typeof axios>;

describe('snippetService', () => {
  const mockSnippet: Snippet = {
    id: '1',
    text: 'Test Snippet Text',
    summary: 'Test Summary',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  };

  const mockCreateRequest: CreateSnippetRequest = {
    text: 'Test Snippet Text'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment variable
    delete process.env.REACT_APP_API_URL;
  });

  describe('createSnippet', () => {
    it('should create a snippet successfully', async () => {
      const mockInstance = {
        post: jest.fn().mockResolvedValue({ data: mockSnippet }),
        get: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        patch: jest.fn(),
        request: jest.fn(),
        interceptors: { request: { use: jest.fn(), eject: jest.fn() }, response: { use: jest.fn(), eject: jest.fn() } },
        defaults: {},
        getUri: jest.fn(),
        head: jest.fn(),
        options: jest.fn(),
      };
      (axios.create as jest.Mock).mockReturnValueOnce(mockInstance);

      const result = await snippetService.createSnippet(mockCreateRequest);

      expect(mockAxios.create).toHaveBeenCalledWith({
        baseURL: 'http://localhost:3000',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result).toEqual(mockSnippet);
      expect(mockInstance.post).toHaveBeenCalledWith('/snippets', mockCreateRequest);
    });

    it('should use custom API URL when REACT_APP_API_URL is set', async () => {
      process.env.REACT_APP_API_URL = 'http://custom-api.com';
      const mockInstance = {
        post: jest.fn().mockResolvedValue({ data: mockSnippet }),
        get: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        patch: jest.fn(),
        request: jest.fn(),
        interceptors: { request: { use: jest.fn(), eject: jest.fn() }, response: { use: jest.fn(), eject: jest.fn() } },
        defaults: {},
        getUri: jest.fn(),
        head: jest.fn(),
        options: jest.fn(),
      };
      (axios.create as jest.Mock).mockReturnValueOnce(mockInstance);

      await snippetService.createSnippet(mockCreateRequest);

      expect(mockAxios.create).toHaveBeenCalledWith({
        baseURL: 'http://custom-api.com',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(mockInstance.post).toHaveBeenCalledWith('/snippets', mockCreateRequest);
    });

    it('should throw error when API call fails', async () => {
      const error = new Error('Network error');
      const mockInstance = {
        post: jest.fn().mockRejectedValue(error),
        get: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        patch: jest.fn(),
        request: jest.fn(),
        interceptors: { request: { use: jest.fn(), eject: jest.fn() }, response: { use: jest.fn(), eject: jest.fn() } },
        defaults: {},
        getUri: jest.fn(),
        head: jest.fn(),
        options: jest.fn(),
      };
      (axios.create as jest.Mock).mockReturnValueOnce(mockInstance);

      await expect(snippetService.createSnippet(mockCreateRequest)).rejects.toThrow('Network error');
    });
  });

  describe('getSnippet', () => {
    it('should get a snippet by id successfully', async () => {
      const mockInstance = {
        post: jest.fn(),
        get: jest.fn().mockResolvedValue({ data: mockSnippet }),
        put: jest.fn(),
        delete: jest.fn(),
        patch: jest.fn(),
        request: jest.fn(),
        interceptors: { request: { use: jest.fn(), eject: jest.fn() }, response: { use: jest.fn(), eject: jest.fn() } },
        defaults: {},
        getUri: jest.fn(),
        head: jest.fn(),
        options: jest.fn(),
      };
      (axios.create as jest.Mock).mockReturnValueOnce(mockInstance);

      const result = await snippetService.getSnippet('1');

      expect(result).toEqual(mockSnippet);
      expect(mockInstance.get).toHaveBeenCalledWith('/snippets/1');
    });
  });

  describe('getAllSnippets', () => {
    it('should get all snippets successfully', async () => {
      const mockSnippets = [mockSnippet];
      const mockInstance = {
        post: jest.fn(),
        get: jest.fn().mockResolvedValue({ data: mockSnippets }),
        put: jest.fn(),
        delete: jest.fn(),
        patch: jest.fn(),
        request: jest.fn(),
        interceptors: { request: { use: jest.fn(), eject: jest.fn() }, response: { use: jest.fn(), eject: jest.fn() } },
        defaults: {},
        getUri: jest.fn(),
        head: jest.fn(),
        options: jest.fn(),
      };
      (axios.create as jest.Mock).mockReturnValueOnce(mockInstance);

      const result = await snippetService.getAllSnippets();

      expect(result).toEqual(mockSnippets);
      expect(mockInstance.get).toHaveBeenCalledWith('/snippets');
    });
  });
}); 