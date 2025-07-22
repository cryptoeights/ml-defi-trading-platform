from gaia_test import GaiaRecallTest
import sys

def interactive_cli():
    """
    Interactive CLI for GAIA-Recall trading
    """
    test = GaiaRecallTest()
    
    print("🤖 GAIA-Recall Interactive Trading CLI")
    print("=" * 50)
    print("Type your trading commands in natural language!")
    print("Examples:")
    print("- Swap 100 USDC to WETH on Ethereum")
    print("- Trade 50 USDC to DAI")
    print("- Buy WETH with 75 USDC")
    print("- Convert 25 USDC to WETH for testing")
    print("Type 'quit' or 'exit' to stop")
    print("=" * 50)
    
    while True:
        try:
            # Get user input
            user_input = input("\n🤖 Enter your trading command: ").strip()
            
            # Check for exit commands
            if user_input.lower() in ['quit', 'exit', 'q']:
                print("👋 Goodbye! Happy trading!")
                break
            
            # Skip empty input
            if not user_input:
                continue
            
            # Execute the trade command
            print(f"\n🚀 Executing: {user_input}")
            test.test_gaia_integration(user_input)
            
        except KeyboardInterrupt:
            print("\n👋 Goodbye! Happy trading!")
            break
        except Exception as e:
            print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    interactive_cli() 