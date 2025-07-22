import requests
import os
from dotenv import load_dotenv

load_dotenv()

RECALL_API_URL = "https://api.sandbox.competitions.recall.network/api/trade/execute"
API_KEY = os.getenv("RECALL_API_KEY")

def recall_trade_tool(fromToken: str, toToken: str, amount: str, reason: str) -> dict:
    """
    Execute a trade using Recall API
    """
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    trade_data = {
        "fromToken": fromToken,
        "toToken": toToken,
        "amount": amount,
        "reason": reason
    }
    
    print(f"🔄 Executing trade: {amount} {fromToken} → {toToken}")
    print(f"Reason: {reason}")
    
    try:
        response = requests.post(RECALL_API_URL, json=trade_data, headers=headers)
        result = response.json()
        
        if response.status_code == 200:
            print("✅ Trade executed successfully!")
        else:
            print(f"❌ Trade failed: {result}")
            
        return result
    except Exception as e:
        error_msg = f"Error executing trade: {str(e)}"
        print(f"❌ {error_msg}")
        return {"error": error_msg}