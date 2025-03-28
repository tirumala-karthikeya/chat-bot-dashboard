
// Fallback service for when the main API is unavailable

// Simple fallback responses based on message content
const FALLBACK_RESPONSES = [
  {
    keywords: ['hello', 'hi', 'hey', 'greetings'],
    response: "Hello there! I'm currently operating in fallback mode due to connectivity issues. I can only provide basic responses right now."
  },
  {
    keywords: ['help', 'support', 'assist'],
    response: "I'd like to help, but I'm currently in fallback mode due to connectivity issues. Please try again later or contact support if this persists."
  },
  // Add more fallback responses as needed
];

// Default fallback response
const DEFAULT_FALLBACK = "I'm sorry, I'm currently experiencing connectivity issues and can't provide a detailed response. Please try again later.";

export const getFallbackResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  // Check for keyword matches
  for (const option of FALLBACK_RESPONSES) {
    if (option.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return option.response;
    }
  }
  
  return DEFAULT_FALLBACK;
};

// Generate a fallback conversation ID when needed
export const generateFallbackConversationId = (): string => {
  return `fallback-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// Log fallback usage for monitoring
export const logFallbackUsage = (botId: string, message: string): void => {
  console.warn(`Fallback mode activated for bot ${botId} with message: ${message}`);
  // In a real implementation, you might want to send this to your backend
  // for monitoring and alerting purposes
};
