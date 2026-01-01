import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

// Setup Environment Variables for Supabase
process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://milbmtxprwlgrtizrxwg.supabase.co';
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'sb_publishable_jZLKUowm3a2ltI2mZLN3Hw_ELsi4mPZ';

// Mock global objects or native modules here if needed
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock expo-sqlite with in-memory implementation (Fake)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockData: any[] = [];

jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(() => Promise.resolve({
    execAsync: jest.fn(async (sql: string) => {
      if (sql.includes('DELETE')) {
        mockData.length = 0; // Clear array
      }
    }), // Handle DELETE and ignore table creation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    runAsync: jest.fn(async (sql: string, params: any[] = []) => {
      if (sql.includes('INSERT') || sql.includes('REPLACE')) {
        // Simple mock for: INSERT OR REPLACE INTO auth_session (...) VALUES (?, ...)
        // We assume the params match the order: id, email, name, role, status, created_at, avatar
        // This is coupled to the implementation but necessary for a functional fake without a real SQL engine.
        const [id, email, name, role, status, created_at, avatar] = params;
        
        // Remove existing if any (simulate replace)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const index = mockData.findIndex((d: any) => d.id === id);
        if (index >= 0) {
          mockData.splice(index, 1);
        }
        
        mockData.push({ id, email, name, role, status, created_at, avatar });
      } else if (sql.includes('DELETE')) {
        mockData.length = 0; // Clear array
      }
    }),
    getAllAsync: jest.fn(async (sql: string) => {
      if (sql.includes('SELECT')) {
        return [...mockData];
      }
      return [];
    }),
  })),
}));
