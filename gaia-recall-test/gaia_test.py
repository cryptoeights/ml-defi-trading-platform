from openai import OpenAI
import json
import os
from dotenv import load_dotenv
from recall_tool import recall_trade_tool

load_dotenv()

class GaiaRecallTest:
    def __init__(self):
        self.client = OpenAI(
            base_url="https://qwen72b.gaia.domains/v1",
            api_key=os.getenv("GAIA_API_KEY", "dummy_key")
        )
        
        self.tools = [{
            "type": "function",
            "function": {
                "name": "recall_trade_tool",
                "description": "Executes a token trade using the Recall API on Ethereum Mainnet sandbox",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "fromToken": {
                            "type": "string",
                            "description": "ERC-20 token address to trade from (e.g., 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 for USDC)"
                        },
                        "toToken": {
                            "type": "string",
                            "description": "ERC-20 token address to trade to (e.g., 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2 for WETH)"
                        },
                        "amount": {
                            "type": "string",
                            "description": "Amount of the fromToken to trade"
                        },
                        "reason": {
                            "type": "string",
                            "description": "Reason for making the trade"
                        }
                    },
                    "required": ["fromToken", "toToken", "amount", "reason"]
                }
            }
        }]
    
    def test_gaia_integration(self, user_message: str):
        print(f"\n🤖 Testing GAIA with message: '{user_message}'")
        print("=" * 60)
        
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
                print(f"\n🔧 GAIA wants to execute {len(tool_calls)} tool call(s)")
                
                messages.append(response_message)
                
                for i, tool_call in enumerate(tool_calls):
                    print(f"\n--- Tool Call {i+1} ---")
                    
                    function_name = tool_call.function.name
                    function_args = json.loads(tool_call.function.arguments)
                    
                    print(f"Function: {function_name}")
                    print(f"Arguments: {json.dumps(function_args, indent=2)}")
                    
                    function_response = recall_trade_tool(**function_args)
                    
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
                print("ℹ️ No tool calls made by GAIA")
                
        except Exception as e:
            print(f"❌ Error: {str(e)}")

def run_tests():
    test = GaiaRecallTest()
    
    test_scenarios = [
        "Swap 100 USDC to WETH on Ethereum mainnet to verify my Recall account"
    ]
    
    print("🚀 Starting GAIA-Recall Integration Tests")
    print("=" * 60)
    
    for i, scenario in enumerate(test_scenarios, 1):
        print(f"\n Test {i}/{len(test_scenarios)}")
        test.test_gaia_integration(scenario)

if __name__ == "__main__":
    run_tests()