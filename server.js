const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const axios = require("axios");
require("dotenv").config();

const server = new Server(
  {
    name: "recall-competitions",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const API_BASE_URL = "https://api.competitions.recall.network";
const API_KEY = process.env.RECALL_API_KEY || "c00c9cdc0a7dc916_3dcec57cc76dc626";

server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "get_competitions") {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/competitions`, {
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      });
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error.message}`,
          },
        ],
      };
    }
  }

  if (name === "execute_trade") {
    try {
      const { fromToken, toToken, amount, reason } = args;
      const response = await axios.post(`${API_BASE_URL}/api/trade/execute`, {
        fromToken,
        toToken,
        amount,
        reason
      }, {
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      });
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error.message}`,
          },
        ],
      };
    }
  }

  return {
    content: [
      {
        type: "text",
        text: `Unknown tool: ${name}`,
      },
    ],
  };
});

const transport = new StdioServerTransport();
server.connect(transport); 