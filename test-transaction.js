const axios = require("axios");
require("dotenv").config();

const API_BASE_URL = "https://api.sandbox.competitions.recall.network";
const API_KEY = "c00c9cdc0a7dc916_3dcec57cc76dc626";

class RecallSandboxTester {
  constructor() {
    this.apiKey = API_KEY;
    this.baseURL = API_BASE_URL;
  }

  // Execute a test trade
  async executeTestTrade() {
    try {
      console.log("Executing test trade on Recall sandbox...");
      
      const tradeData = {
        fromToken: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
        toToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
        amount: "100", // 100 USDC
        reason: "Testing Recall sandbox transaction"
      };

      console.log("Trade data:", JSON.stringify(tradeData, null, 2));

      const response = await axios.post(`${this.baseURL}/api/trade/execute`, tradeData, {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        }
      });

      console.log("✅ Trade executed successfully!");
      console.log("Response:", JSON.stringify(response.data, null, 2));
      
      return response.data;
    } catch (error) {
      console.error("❌ Error executing trade:", error.message);
      if (error.response) {
        console.error("Response data:", JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
  }

  // Get price quote before trading
  async getPriceQuote() {
    try {
      console.log("Getting price quote...");
      
      const response = await axios.get(`${this.baseURL}/api/trade/quote`, {
        params: {
          fromToken: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
          toToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
          amount: "100"
        },
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        }
      });

      console.log("Price quote:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error("Error getting price quote:", error.message);
      throw error;
    }
  }

  // Get agent portfolio
  async getPortfolio() {
    try {
      console.log("Getting agent portfolio...");
      
      const response = await axios.get(`${this.baseURL}/api/agent/portfolio`, {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        }
      });

      console.log("Portfolio:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error("Error getting portfolio:", error.message);
      throw error;
    }
  }

  // Get agent profile
  async getAgentProfile() {
    try {
      console.log("Getting agent profile...");
      
      const response = await axios.get(`${this.baseURL}/api/agent/profile`, {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        }
      });

      console.log("Agent profile:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error("Error getting agent profile:", error.message);
      throw error;
    }
  }
}

// Test the sandbox transaction
async function main() {
  const tester = new RecallSandboxTester();
  
  try {
    console.log("=== Recall Sandbox Transaction Test ===\n");
    
    // Step 1: Get agent profile
    console.log("Step 1: Getting agent profile...");
    await tester.getAgentProfile();
    
    // Step 2: Get current portfolio
    console.log("\nStep 2: Getting current portfolio...");
    await tester.getPortfolio();
    
    // Step 3: Get price quote
    console.log("\nStep 3: Getting price quote...");
    await tester.getPriceQuote();
    
    // Step 4: Execute test trade
    console.log("\nStep 4: Executing test trade...");
    await tester.executeTestTrade();
    
    // Step 5: Get updated portfolio
    console.log("\nStep 5: Getting updated portfolio...");
    await tester.getPortfolio();
    
    console.log("\n🎉 Sandbox transaction test completed!");
    
  } catch (error) {
    console.error("Test failed:", error.message);
  }
}

main(); 