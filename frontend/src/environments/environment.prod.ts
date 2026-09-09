export const environment = {
  production: true,
  apiUrl: (typeof window !== 'undefined' && (window as any).env?.apiUrl) || 'http://localhost:8090/gateway',
  mockMode: false
};

