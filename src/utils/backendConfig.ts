
// Backend configuration management
interface BackendConfig {
  nextAgiApiUrl: string;
  nextAgiApiKey: string;
  fallbackEnabled: boolean;
  postgresUrl: string;
}

// Default configuration with fallback values
const defaultConfig: BackendConfig = {
  nextAgiApiUrl: process.env.NEXT_AGI_API_URL || 'https://api.next-agi.com/v1',
  nextAgiApiKey: process.env.NEXT_AGI_API_KEY || 'app-jqxu9a3lVE0kRGZQnoSWHIgN',
  fallbackEnabled: process.env.ENABLE_FALLBACK !== 'false', // Enable fallback by default
  postgresUrl: process.env.POSTGRES_URL || 'postgresql://localhost:5432/chatbot',
};

// Get the current configuration
export const getConfig = (): BackendConfig => {
  return {
    ...defaultConfig,
    // Add any runtime configuration overrides here
  };
};

// Validate the configuration
export const validateConfig = (): { valid: boolean; issues: string[] } => {
  const config = getConfig();
  const issues: string[] = [];

  if (!config.nextAgiApiUrl) issues.push('Next AGI API URL is not configured');
  if (!config.nextAgiApiKey) issues.push('Next AGI API key is not configured');
  if (!config.postgresUrl) issues.push('PostgreSQL connection URL is not configured');

  return {
    valid: issues.length === 0,
    issues
  };
};

// Utility function to check service availability
export const checkServiceAvailability = async (): Promise<{ 
  nextAgi: boolean;
  database: boolean;
}> => {
  const results = {
    nextAgi: false,
    database: false
  };

  // Check Next AGI API
  try {
    const response = await fetch(`${getConfig().nextAgiApiUrl}/health`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getConfig().nextAgiApiKey}`
      },
      timeout: 5000
    } as RequestInit & { timeout: number });
    
    results.nextAgi = response.ok;
  } catch (error) {
    console.error('Next AGI API health check failed:', error);
    results.nextAgi = false;
  }

  // The database check would normally happen on the backend
  // This is just a placeholder for frontend service status display
  results.database = true;

  return results;
};
