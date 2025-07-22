from cross_chain_trading import CrossChainTrading
from gaia_cross_chain import GaiaCrossChainTrading

def run_all_tests():
    """Run all cross-chain tests"""
    print("🧪 Cross-Chain Trading Test Suite")
    print("=" * 60)
    
    # Test 1: Basic cross-chain trading
    print("\n1️⃣ Testing Basic Cross-Chain Trading")
    print("-" * 40)
    basic_trading = CrossChainTrading()
    basic_trading.list_supported_networks()
    
    # Test 2: GAIA cross-chain integration
    print("\n2️⃣ Testing GAIA Cross-Chain Integration")
    print("-" * 40)
    gaia_trading = GaiaCrossChainTrading()
    
    test_commands = [
        "Bridge 100 USDC from Ethereum to Optimism",
        "Trade 50 USDC to WETH from Arbitrum to Polygon",
        "Cross-chain swap 75 USDC to WETH from Base to Ethereum"
    ]
    
    for i, command in enumerate(test_commands, 1):
        print(f"\n Test {i}: {command}")
        gaia_trading.process_cross_chain_command(command)
        
        if i < len(test_commands):
            input("\nPress Enter to continue...")
    
    print("\n✅ All cross-chain tests completed!")

if __name__ == "__main__":
    run_all_tests() 