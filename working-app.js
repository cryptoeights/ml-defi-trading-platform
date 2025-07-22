const axios = require("axios");
require("dotenv").config();

// Use the sandbox API for testing
const API_BASE_URL = "https://api.sandbox.competitions.recall.network";
const API_KEY = "c00c9cdc0a7dc916_3dcec57cc76dc626";

class RecallWorkingApp {
  constructor() {
    this.apiKey = API_KEY;
    this.baseURL = API_BASE_URL;
  }

  // Get all competitions
  async getCompetitions() {
    try {
      const response = await axios.get(`${this.baseURL}/api/competitions`, {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching competitions:", error.message);
      throw error;
    }
  }

  // Execute a trade
  async executeTrade(fromToken, toToken, amount, reason) {
    try {
      const response = await axios.post(`${this.baseURL}/api/trade/execute`, {
        fromToken,
        toToken,
        amount,
        reason
      }, {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error executing trade:", error.message);
      throw error;
    }
  }

  // Get portfolio (try different endpoint)
  async getPortfolio() {
    try {
      // Try the agent portfolio endpoint
      const response = await axios.get(`${this.baseURL}/api/agent/portfolio`, {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching portfolio:", error.message);
      throw error;
    }
  }

  // Get agent profile
  async getAgentProfile() {
    try {
      const response = await axios.get(`${this.baseURL}/api/agent/profile`, {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching agent profile:", error.message);
      throw error;
    }
  }

  // Get competition details
  async getCompetitionDetails(competitionId) {
    try {
      const response = await axios.get(`${this.baseURL}/api/competitions/${competitionId}`, {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching competition details:", error.message);
      throw error;
    }
  }

  // Get leaderboard
  async getLeaderboard(competitionId) {
    try {
      const response = await axios.get(`${this.baseURL}/api/competitions/${competitionId}/leaderboard`, {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching leaderboard:", error.message);
      throw error;
    }
  }

  // Get price quote
  async getPriceQuote(fromToken, toToken, amount) {
    try {
      const response = await axios.get(`${this.baseURL}/api/trade/quote`, {
        params: {
          fromToken,
          toToken,
          amount
        },
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching price quote:", error.message);
      throw error;
    }
  }

  // Test API health
  async getHealth() {
    try {
      const response = await axios.get(`${this.baseURL}/api/health`, {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching health:", error.message);
      throw error;
    }
  }
}

// Test the app
async function main() {
  const app = new RecallWorkingApp();
  
  try {
    console.log("=== Recall Working App (Fixed) ===\n");
    
    // Test API health first
    console.log("0. Testing API health...");
    try {
      const health = await app.getHealth();
      console.log("API Health:", JSON.stringify(health, null, 2));
    } catch (error) {
      console.log("Health check failed, continuing...");
    }
    
    // Get competitions
    console.log("\n1. Fetching competitions...");
    const competitions = await app.getCompetitions();
    console.log(`Found ${competitions?.length || 0} competitions`);
    
    if (competitions && competitions.length > 0) {
      console.log("First competition:", JSON.stringify(competitions[0], null, 2));
    }
    
    // Get agent profile instead of portfolio
    console.log("\n2. Fetching agent profile...");
    try {
      const profile = await app.getAgentProfile();
      console.log("Agent Profile:", JSON.stringify(profile, null, 2));
    } catch (error) {
      console.log("Agent profile not available, trying portfolio...");
      try {
        const portfolio = await app.getPortfolio();
        console.log("Portfolio:", JSON.stringify(portfolio, null, 2));
      } catch (portfolioError) {
        console.log("Portfolio also not available");
      }
    }
    
    // Get price quote example
    console.log("\n3. Getting price quote...");
    try {
      const quote = await app.getPriceQuote(
        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
        "100"
      );
      console.log("Price quote:", JSON.stringify(quote, null, 2));
    } catch (error) {
      console.log("Price quote not available");
    }
    
    console.log("\n4. App is ready for trading!");
    console.log("You can now execute trades using the executeTrade method.");
    
  } catch (error) {
    console.error("App error:", error.message);
  }
}

main(); 