from openai import OpenAI
import json
import os
from dotenv import load_dotenv
from cross_chain_trading import CrossChainTrading

load_dotenv()

class GaiaCrossChainTrading:
    def __init__(self):
        self.client = OpenAI(
            base_url="https://qwen72b.gaia.domains/v1",
            api_key=os.getenv("GAIA_API_KEY", "dummy_key")
        )
        
        self.trading = CrossChainTrading()
        
        self.tools = [
            {
                "type": "function",
                "function": {
                    "name": "execute_cross_chain_trade",
                    "description": "Execute cross-chain trades between different networks",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "from_network": {
                                "type": "string",
                                "description": "Source network (ethereum, optimism, arbitrum, polygon, base)"
                            },
                            "to_network": {
                                "type": "string", 
                                "description": "Destination network (ethereum, optimism, arbitrum, polygon, base)"
                            },
                            "from_token": {
                                "type": "string",
                                "description": "Token to trade from (USDC, WETH, DAI)"
                            },
                            "to_token": {
                                "type": "string",
                                "description": "Token to trade to (USDC, WETH, DAI)"
                            },
                            "amount": {
                                "type": "string",
                                "description": "Amount to trade"
                            },
                            "reason": {
                                "type": "string",
                                "description": "Reason for the cross-chain trade"
                            }
                        },
                        "required": ["from_network", "to_network", "from_token", "to_token", "amount"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "get_cross_chain_quote",
                    "description": "Get quote for cross-chain trade",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "from_network": {"type": "string"},
                            "to_network": {"type": "string"},
                            "from_token": {"type": "string"},
                            "to_token": {"type": "string"},
                            "amount": {"type": "string"}
                        },
                        "required": ["from_network", "to_network", "from_token", "to_token", "amount"]
                    }
                }
            }
        ]
    
    def execute_cross_chain_trade(self, from_network, to_network, from_token, to_token, amount, reason=""):
        """Execute cross-chain trade"""
        return self.trading.execute_cross_chain_trade(
            from_network, to_network, from_token, to_token, amount, reason
        )
    
    def get_cross_chain_quote(self, from_network, to_network, from_token, to_token, amount):
        """Get cross-chain quote"""
        return self.trading.get_cross_chain_quote(
            from_network, to_network, from_token, to_token, amount
        )
    
    def process_cross_chain_command(self, user_message):
        """Process cross-chain trading command with GAIA"""
        messages = [{
            "role": "user",
            "content": user_message
        }]
        
        try:
            response = self.client.chat.completions.create(
                model="Qwen3-235B-A22B-Q4_K_M",
                messages=messages,
                tools=self.tools,
                tool_choice="auto"
            )
            
            response_message = response.choices[0].message
            print(f"📝 GAIA Response: {response_message.content}")
            
            tool_calls = response_message.tool_calls
            if tool_calls:
                print(f"\n🔧 GAIA wants to execute {len(tool_calls)} cross-chain operation(s)")
                
                messages.append(response_message)
                
                for i, tool_call in enumerate(tool_calls):
                    print(f"\n--- Cross-Chain Operation {i+1} ---")
                    
                    function_name = tool_call.function.name
                    function_args = json.loads(tool_call.function.arguments)
                    
                    print(f"Function: {function_name}")
                    print(f"Arguments: {json.dumps(function_args, indent=2)}")
                    
                    # Execute the cross-chain operation
                    if function_name == "execute_cross_chain_trade":
                        function_response = self.execute_cross_chain_trade(**function_args)
                    elif function_name == "get_cross_chain_quote":
                        function_response = self.get_cross_chain_quote(**function_args)
                    else:
                        function_response = {"error": "Unknown function"}
                    
                    messages.append({
                        "tool_call_id": tool_call.id,
                        "role": "tool",
                        "name": function_name,
                        "content": json.dumps(function_response)
                    })
                
                final_response = self.client.chat.completions.create(
                    model="Qwen3-235B-A22B-Q4_K_M",
                    messages=messages
                )
                
                print(f"\n🎯 Final GAIA Response: {final_response.choices[0].message.content}")
                
            else:
                print("ℹ️ No cross-chain operations requested by GAIA")
                
        except Exception as e:
            print(f"❌ Error: {str(e)}")

# Test cross-chain trading with GAIA
def test_gaia_cross_chain():
    gaia_trading = GaiaCrossChainTrading()
    
    print("🤖 GAIA Cross-Chain Trading Test")
    print("=" * 50)
    
    # Test cross-chain commands
    test_commands = [
        "Bridge 100 USDC from Ethereum to Optimism",
        "Trade 50 USDC to WETH from Arbitrum to Polygon",
        "Cross-chain swap 75 USDC to WETH from Base to Ethereum"
    ]
    
    for i, command in enumerate(test_commands, 1):
        print(f"\n Test {i}: {command}")
        print("-" * 40)
        gaia_trading.process_cross_chain_command(command)
        
        if i < len(test_commands):
            input("\nPress Enter to continue to next test...")

if __name__ == "__main__":
    test_gaia_cross_chain() 