from gaia_test import GaiaRecallTest

def test_different_tool_calls():
    """
    Test different trading scenarios with GAIA
    """
    test = GaiaRecallTest()
    
    # Different trading scenarios to test
    test_scenarios = [
        "Swap 100 USDC to WETH on Ethereum mainnet to verify my Recall account",
        "Trade 50 USDC to DAI on Ethereum",
        "Buy WETH with 75 USDC for portfolio diversification",
        "Convert 25 USDC to WETH for testing purposes",
        "Exchange 200 USDC for WETH on Ethereum",
        "Swap 150 USDC to DAI to hedge my position",
        "Trade 80 USDC to WETH for short-term gains",
        "Convert 100 USDC to WETH for long-term holding"
    ]
    
    print("🧪 Testing Different Tool Calls with GAIA")
    print("=" * 60)
    
    for i, scenario in enumerate(test_scenarios, 1):
        print(f"\n Test {i}/{len(test_scenarios)}")
        print(f"Command: {scenario}")
        print("-" * 40)
        
        test.test_gaia_integration(scenario)
        
        # Ask user if they want to continue
        if i < len(test_scenarios):
            response = input("\nPress Enter to continue to next test, or 'q' to quit: ")
            if response.lower() == 'q':
                break

if __name__ == "__main__":
    test_different_tool_calls() 