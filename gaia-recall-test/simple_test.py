from gaia_test import GaiaRecallTest

def simple_test():
    test = GaiaRecallTest()
    
    user_message = "Swap 100 USDC to WETH on Ethereum mainnet to verify my Recall account"
    
    print(" Simple GAIA-Recall Test")
    print("=" * 50)
    
    test.test_gaia_integration(user_message)

if __name__ == "__main__":
    simple_test()