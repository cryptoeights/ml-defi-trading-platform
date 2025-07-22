from gaia_cross_chain import GaiaCrossChainTrading

def cross_chain_cli():
    """Interactive CLI for cross-chain trading"""
    gaia_trading = GaiaCrossChainTrading()
    
    print("🌐 GAIA Cross-Chain Trading CLI")
    print("=" * 50)
    print("Supported Networks: Ethereum, Optimism, Arbitrum, Polygon, Base")
    print("Supported Tokens: USDC, WETH, DAI")
    print("Examples:")
    print("- Bridge 100 USDC from Ethereum to Optimism")
    print("- Trade 50 USDC to WETH from Arbitrum to Polygon")
    print("- Cross-chain swap 75 USDC to WETH from Base to Ethereum")
    print("Type 'quit' or 'exit' to stop")
    print("=" * 50)
    
    while True:
        try:
            user_input = input("\n🌐 Enter your cross-chain command: ").strip()
            
            if user_input.lower() in ['quit', 'exit', 'q']:
                print("👋 Goodbye! Happy cross-chain trading!")
                break
            
            if not user_input:
                continue
            
            print(f"\n🚀 Executing: {user_input}")
            gaia_trading.process_cross_chain_command(user_input)
            
        except KeyboardInterrupt:
            print("\n👋 Goodbye! Happy cross-chain trading!")
            break
        except Exception as e:
            print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    cross_chain_cli() 