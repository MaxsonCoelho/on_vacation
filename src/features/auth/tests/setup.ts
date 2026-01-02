import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

// Setup Environment Variables for Supabase
process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://milbmtxprwlgrtizrxwg.supabase.co';
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'sb_publishable_jZLKUowm3a2ltI2mZLN3Hw_ELsi4mPZ';

// Mock global objects or native modules here if needed
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('@react-native-community/netinfo', () => ({
    addEventListener: jest.fn(),
    fetch: jest.fn().mockResolvedValue({
        isConnected: true,
        isInternetReachable: true,
        type: 'wifi',
    }),
    useNetInfo: jest.fn().mockReturnValue({
        isConnected: true,
        isInternetReachable: true,
        type: 'wifi',
    }),
}));


// Mock expo-sqlite with in-memory implementation (Fake)
// Store data by table name
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dbData: Record<string, any[]> = {};

jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(() => Promise.resolve({
    execAsync: jest.fn(async (sql: string) => {
      // Handle CREATE TABLE
      if (sql.trim().startsWith('CREATE TABLE')) {
         const match = sql.match(/CREATE TABLE IF NOT EXISTS (\w+)/);
         if (match) {
             const tableName = match[1];
             dbData[tableName] = dbData[tableName] || [];
         }
      } 
      // Handle DELETE FROM table
      else if (sql.trim().startsWith('DELETE FROM')) {
         const match = sql.match(/DELETE FROM (\w+)/);
         if (match) {
             const tableName = match[1];
             dbData[tableName] = [];
         }
      }
      return;
    }),
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    runAsync: jest.fn(async (sql: string, params: any[] = []) => {
      // console.log('[MockSQLite] runAsync:', sql);
      
      if (sql.trim().startsWith('INSERT OR REPLACE INTO')) {
          const match = sql.match(/INSERT OR REPLACE INTO (\w+)/);
          if (match) {
              const tableName = match[1];
              // Initialize table if it doesn't exist (implicit creation for tests)
              dbData[tableName] = dbData[tableName] || [];

              const colsMatch = sql.match(/\(([\s\S]*?)\)\s*VALUES/);
              if (colsMatch) {
                  const cols = colsMatch[1].split(',').map(s => s.trim());
                  // console.log('[MockSQLite] Inserting into', tableName, 'Cols:', cols);
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const row: any = {};
                  cols.forEach((col, i) => {
                      row[col] = params[i];
                  });
                  
                  // Handle replace by ID if exists
                  if (row.id) {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      dbData[tableName] = dbData[tableName].filter((r: any) => r.id !== row.id);
                  }
                  
                  dbData[tableName].push(row);
                  // console.log('[MockSQLite] Row inserted:', JSON.stringify(row));
              }
          }
      } else if (sql.trim().startsWith('UPDATE')) {
          const match = sql.match(/UPDATE (\w+) SET/);
          if (match) {
               const tableName = match[1];
               // console.log('[MockSQLite] Updating table:', tableName);
               
               // Very basic UPDATE parsing for "SET col1 = ?, col2 = ? WHERE id = ?"
               const setClause = sql.substring(sql.indexOf('SET') + 3, sql.indexOf('WHERE')).trim();
               const setCols = setClause.split(',').map(part => part.split('=')[0].trim());
               
               // Assume WHERE id = ? is the last parameter
               const id = params[params.length - 1];
               
               if (dbData[tableName]) {
                   // eslint-disable-next-line @typescript-eslint/no-explicit-any
                   const row = dbData[tableName].find((r: any) => r.id === id);
                   if (row) {
                       setCols.forEach((col, i) => {
                           row[col] = params[i];
                       });
                       // console.log('[MockSQLite] Row updated:', row);
                   } else {
                       console.warn('[MockSQLite] Row not found for update:', id);
                   }
               }
           }
      } else if (sql.trim().startsWith('DELETE FROM')) {
          // Fallback for DELETE in runAsync if used
          const match = sql.match(/DELETE FROM (\w+)/);
          if (match) {
             const tableName = match[1];
             dbData[tableName] = [];
          }
      }
      return { changes: 1, lastInsertRowId: 1 };
    }),
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getAllAsync: jest.fn(async (sql: string, params: any[] = []) => {
        // Match SELECT ... FROM table
        const match = sql.match(/SELECT .* FROM (\w+)/);
        if (match) {
            const tableName = match[1];
            let rows = dbData[tableName] || [];
            
            // Simple WHERE clause handling
            if (sql.includes('WHERE user_id = ?')) {
                const userId = params[0];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                rows = rows.filter((r: any) => r.user_id === userId);
            } else if (sql.includes('WHERE id = ?')) {
                const id = params[0];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                rows = rows.filter((r: any) => r.id === id);
            }
            
            if (sql.includes('LIMIT 1')) {
                rows = rows.slice(0, 1);
            }
            
            // Handle ORDER BY created_at DESC (simple sort)
            if (sql.includes('ORDER BY created_at DESC')) {
                rows = [...rows].sort((a, b) => {
                    return (b.created_at || '').localeCompare(a.created_at || '');
                });
            }
            
            return rows;
        }
        return [];
    }),
  })),
}));
