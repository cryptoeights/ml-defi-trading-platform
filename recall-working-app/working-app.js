const axios = require("axios");
require("dotenv").config();

const API_BASE_URL = "https://api.competitions.recall.network";
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

  // Get portfolio
  async getPortfolio() {
    try {
      const response = await axios.get(`${this.baseURL}/api/portfolio`, {
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
}

// Test the app
async function main() {
  const app = new RecallWorkingApp();
  
  try {
    console.log("=== Recall Working App ===\n");
    
    // Get competitions
    console.log("1. Fetching competitions...");
    const competitions = await app.getCompetitions();
    console.log(`Found ${competitions.length} competitions`);
    
    if (competitions.length > 0) {
      console.log("First competition:", JSON.stringify(competitions[0], null, 2));
    }
    
    // Get portfolio
    console.log("\n2. Fetching portfolio...");
    const portfolio = await app.getPortfolio();
    console.log("Portfolio:", JSON.stringify(portfolio, null, 2));
    
    // Get price quote example
    console.log("\n3. Getting price quote...");
    const quote = await app.getPriceQuote(
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
      "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
      "100"
    );
    console.log("Price quote:", JSON.stringify(quote, null, 2));
    
    console.log("\n4. App is ready for trading!");
    console.log("You can now execute trades using the executeTrade method.");
    
  } catch (error) {
    console.error("App error:", error.message);
  }
}

main(); 