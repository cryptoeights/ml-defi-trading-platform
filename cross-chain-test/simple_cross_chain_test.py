from cross_chain_trading import CrossChainTrading

def simple_cross_chain_test():
    """Simple cross-chain test without GAIA"""
    trading = CrossChainTrading()
    
    print("🧪 Simple Cross-Chain Trading Test")
    print("=" * 50)
    
    # List supported networks
    trading.list_supported_networks()
    
    # Test different cross-chain scenarios
    test_scenarios = [
        {
            "from_network": "ethereum",
            "to_network": "optimism",
            "from_token": "USDC",
            "to_token": "WETH",
            "amount": "100",
            "reason": "Ethereum to Optimism bridge"
        },
        {
            "from_network": "arbitrum",
            "to_network": "polygon",
            "from_token": "USDC",
            "to_token": "WETH",
            "amount": "50",
            "reason": "Arbitrum to Polygon swap"
        },
        {
            "from_network": "base",
            "to_network": "ethereum",
            "from_token": "USDC",
            "to_token": "WETH",
            "amount": "75",
            "reason": "Base to Ethereum cross-chain"
        }
    ]
    
    for i, scenario in enumerate(test_scenarios, 1):
        print(f"\n🚀 Test {i}: {scenario['reason']}")
        print("-" * 40)
        
        result = trading.execute_cross_chain_trade(
            from_network=scenario["from_network"],
            to_network=scenario["to_network"],
            from_token=scenario["from_token"],
            to_token=scenario["to_token"],
            amount=scenario["amount"],
            reason=scenario["reason"]
        )
        
        print(f"Result: {result}")
        
        if i < len(test_scenarios):
            input("\nPress Enter to continue to next test...")
    
    print("\n✅ Simple cross-chain tests completed!")

if __name__ == "__main__":
    simple_cross_chain_test() 