import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Configure axios defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increased timeout for potentially slow connections
});

// Helper function to implement retry logic
const retryRequest = async (func, retries = MAX_RETRIES, delay = RETRY_DELAY) => {
  try {
    return await func();
  } catch (error) {
    if (retries > 0) {
      console.log(`Request failed, retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryRequest(func, retries - 1, delay);
    }
    throw error;
  }
};

// Chat API methods
export const sendChatMessage = async (botId, message, conversationId = null) => {
  try {
    return await retryRequest(async () => {
      const response = await apiClient.post(`/chatbots/${botId}/chat`, {
        message,
        conversationId
      });
      return response.data;
    });
  } catch (error) {
    console.error('Chat error response:', error);
    
    // Provide a fallback response when API is unavailable
    if (error.response?.status === 503 || error.code === 'ECONNREFUSED') {
      console.log('Service unavailable, using fallback response');
      return {
        message: "I'm unable to connect to my brain right now. Please try again later or contact support if the issue persists.",
        conversationId: conversationId || 'fallback-conversation',
        fallback: true
      };
    }
    
    // Rethrow other errors
    throw error;
  }
};

// Other API methods (get bots, conversations, etc.)
export const getBots = async () => {
  try {
    const response = await apiClient.get('/chatbots');
    return response.data;
  } catch (error) {
    console.error('Error fetching bots:', error);
    toast.error('Failed to load chatbots');
    return [];
  }
};

export const getConversations = async (botId) => {
  try {
    const response = await apiClient.get(`/chatbots/${botId}/conversations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    toast.error('Failed to load conversations');
    return [];
  }
};

export const getConversationMessages = async (botId, conversationId) => {
  try {
    const response = await apiClient.get(`/chatbots/${botId}/conversations/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching conversation messages:', error);
    toast.error('Failed to load conversation');
    return { messages: [] };
  }
};

// Export other API methods as needed
