import requests
import os
from dotenv import load_dotenv

load_dotenv()

class CrossChainTrading:
    def __init__(self):
        self.api_key = os.getenv("RECALL_API_KEY", "c00c9cdc0a7dc916_3dcec57cc76dc626")
        self.base_url = "https://api.sandbox.competitions.recall.network"
        
        # Network configurations
        self.networks = {
            "ethereum": {
                "name": "Ethereum Mainnet",
                "chain_id": 1,
                "tokens": {
                    "USDC": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                    "WETH": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                    "DAI": "0x6B175474E89094C44Da98b954EedeAC495271d0F"
                }
            },
            "optimism": {
                "name": "Optimism",
                "chain_id": 10,
                "tokens": {
                    "USDC": "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
                    "WETH": "0x4200000000000000000000000000000000000006"
                }
            },
            "arbitrum": {
                "name": "Arbitrum",
                "chain_id": 42161,
                "tokens": {
                    "USDC": "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
                    "WETH": "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"
                }
            },
            "polygon": {
                "name": "Polygon",
                "chain_id": 137,
                "tokens": {
                    "USDC": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                    "WETH": "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
                }
            },
            "base": {
                "name": "Base",
                "chain_id": 8453,
                "tokens": {
                    "USDC": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
                    "WETH": "0x4200000000000000000000000000000000000006"
                }
            }
        }
    
    def get_network_info(self, network_name):
        """Get network information"""
        return self.networks.get(network_name.lower())
    
    def get_token_address(self, network_name, token_symbol):
        """Get token address for specific network"""
        network = self.get_network_info(network_name)
        if network:
            return network["tokens"].get(token_symbol.upper())
        return None
    
    def execute_cross_chain_trade(self, from_network, to_network, from_token, to_token, amount, reason=""):
        """
        Execute cross-chain trade
        """
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        # Get token addresses
        from_token_address = self.get_token_address(from_network, from_token)
        to_token_address = self.get_token_address(to_network, to_token)
        
        if not from_token_address or not to_token_address:
            return {"error": "Token not supported on specified network"}
        
        trade_data = {
            "fromToken": from_token_address,
            "toToken": to_token_address,
            "amount": str(amount),
            "reason": f"Cross-chain trade: {from_network} → {to_network} | {reason}",
            "fromNetwork": from_network,
            "toNetwork": to_network
        }
        
        print(f"🔄 Executing cross-chain trade:")
        print(f"   From: {from_network} ({from_token})")
        print(f"   To: {to_network} ({to_token})")
        print(f"   Amount: {amount}")
        print(f"   Reason: {reason}")
        
        try:
            response = requests.post(
                f"{self.base_url}/api/trade/execute",
                json=trade_data,
                headers=headers
            )
            
            result = response.json()
            
            if response.status_code == 200:
                print("✅ Cross-chain trade executed successfully!")
                return result
            else:
                print(f"❌ Cross-chain trade failed: {result}")
                return result
                
        except Exception as e:
            error_msg = f"Error executing cross-chain trade: {str(e)}"
            print(f"❌ {error_msg}")
            return {"error": error_msg}
    
    def get_cross_chain_quote(self, from_network, to_network, from_token, to_token, amount):
        """
        Get quote for cross-chain trade
        """
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        from_token_address = self.get_token_address(from_network, from_token)
        to_token_address = self.get_token_address(to_network, to_token)
        
        params = {
            "fromToken": from_token_address,
            "toToken": to_token_address,
            "amount": str(amount),
            "fromNetwork": from_network,
            "toNetwork": to_network
        }
        
        try:
            response = requests.get(
                f"{self.base_url}/api/trade/quote",
                params=params,
                headers=headers
            )
            
            return response.json()
            
        except Exception as e:
            return {"error": f"Error getting quote: {str(e)}"}
    
    def list_supported_networks(self):
        """List all supported networks"""
        print("🌐 Supported Networks:")
        for network, info in self.networks.items():
            print(f"   {network.title()}: {info['name']}")
            print(f"     Chain ID: {info['chain_id']}")
            print(f"     Tokens: {', '.join(info['tokens'].keys())}")
            print()

# Test cross-chain trading
def test_cross_chain_trading():
    trading = CrossChainTrading()
    
    print("🧪 Testing Cross-Chain Trading")
    print("=" * 50)
    
    # List supported networks
    trading.list_supported_networks()
    
    # Test cross-chain trade
    print("🚀 Testing cross-chain trade...")
    result = trading.execute_cross_chain_trade(
        from_network="ethereum",
        to_network="optimism", 
        from_token="USDC",
        to_token="WETH",
        amount="100",
        reason="Testing cross-chain functionality"
    )
    
    print(f"Result: {result}")

if __name__ == "__main__":
    test_cross_chain_trading() 