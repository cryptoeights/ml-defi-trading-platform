from flask import Flask, render_template_string, request, jsonify
from gaia_test import GaiaRecallTest
import json
import io
import sys
import os
import requests
from dotenv import load_dotenv
import threading
import time
from datetime import datetime
import re

app = Flask(__name__)
test = GaiaRecallTest()

load_dotenv()
RECALL_KEY = os.getenv("RECALL_API_KEY")
RECALL_API = "https://api.competitions.recall.network"
TOKEN_MAP = {
    "USDC": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "WETH": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    "WBTC": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
}
COINGECKO_IDS = {
    "USDC": "usd-coin",
    "WETH": "weth",
    "WBTC": "wrapped-bitcoin",
}

# HTML template for the web UI
HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>GAIA-Recall Trading Interface</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background-color: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; text-align: center; }
        .input-group { margin: 20px 0; }
        input[type="text"] { width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 5px; font-size: 16px; }
        button { background: #007bff; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; }
        button:hover { background: #0056b3; }
        .result { margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 5px; white-space: pre-wrap; }
        .examples { background: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .example { color: #007bff; cursor: pointer; margin: 5px 0; }
        .example:hover { text-decoration: underline; }
        .gems-table { width: 100%; border-collapse: collapse; margin-top: 30px; }
        .gems-table th, .gems-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .gems-table th { background: #007bff; color: white; }
        .gems-table tr:nth-child(even) { background: #f2f2f2; }
        .gems-table tr:hover { background: #e9ecef; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🤖 GAIA-Recall Trading Interface</h1>
        
        <div class="examples">
            <h3>💡 Example Commands:</h3>
            <div class="example" onclick="setCommand('Swap 100 USDC to WETH on Ethereum')">Swap 100 USDC to WETH on Ethereum</div>
            <div class="example" onclick="setCommand('Trade 50 USDC to DAI')">Trade 50 USDC to DAI</div>
            <div class="example" onclick="setCommand('Buy WETH with 75 USDC')">Buy WETH with 75 USDC</div>
            <div class="example" onclick="setCommand('Convert 25 USDC to WETH for testing')">Convert 25 USDC to WETH for testing</div>
        </div>
        
        <form id="tradingForm">
            <div class="input-group">
                <label for="command">Enter your trading command:</label>
                <input type="text" id="command" name="command" placeholder="e.g., Swap 100 USDC to WETH on Ethereum" required>
            </div>
            <button type="submit">🚀 Execute Trade</button>
        </form>
        
        <div id="result" class="result" style="display: none;"></div>
        <h2 style="margin-top:40px;">🚀 Live DEX Gems (New High-Liquidity Pairs)</h2>
        <table class="gems-table" id="gems-table">
            <thead>
                <tr>
                    <th>Chain</th>
                    <th>Token</th>
                    <th>Symbol</th>
                    <th>Liquidity (USD)</th>
                    <th>Age (min)</th>
                    <th>24h Volume</th>
                    <th>Score</th>
                    <th>Link</th>
                </tr>
            </thead>
            <tbody id="gems-tbody">
                <tr><td colspan="7">Loading...</td></tr>
            </tbody>
        </table>
        <h2 style="margin-top:40px;">�� Trade Activity</h2>
        <table class="gems-table" id="trades-table">
            <thead>
                <tr>
                    <th>Time (UTC)</th>
                    <th>Chain</th>
                    <th>Token</th>
                    <th>Symbol</th>
                    <th>Score</th>
                    <th>Reason</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody id="trades-tbody">
                <tr><td colspan="7">Loading...</td></tr>
            </tbody>
        </table>
    </div>
    
    <script>
        function setCommand(cmd) {
            document.getElementById('command').value = cmd;
        }
        
        document.getElementById('tradingForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const command = document.getElementById('command').value;
            const resultDiv = document.getElementById('result');
            
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = '🔄 Processing...';
            
            try {
                const response = await fetch('/execute_trade', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({command: command})
                });
                
                const data = await response.json();
                resultDiv.innerHTML = data.result;
            } catch (error) {
                resultDiv.innerHTML = '❌ Error: ' + error.message;
            }
        });

    function fetchGems() {
        fetch('/api/dexscreener_gems').then(r => r.json()).then(data => {
            const tbody = document.getElementById('gems-tbody');
            tbody.innerHTML = '';
            if (!data.gems || data.gems.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7">No gems found.</td></tr>';
                return;
            }
            data.gems.forEach(gem => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${gem.chain}</td>
                    <td>${gem.name}</td>
                    <td>${gem.symbol}</td>
                    <td>${gem.liquidity.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                    <td>${gem.age_minutes !== null ? gem.age_minutes.toFixed(1) : '?'}</td>
                    <td>${gem.volume24h ? gem.volume24h.toLocaleString(undefined, {maximumFractionDigits:0}) : '?'}</td>
                    <td>${gem.score}</td>
                    <td><a href="${gem.url}" target="_blank">View</a></td>
                `;
                tbody.appendChild(row);
            });
        });
    }
    fetchGems();
    setInterval(fetchGems, 60000); // refresh every 60s
    function fetchTrades() {
        fetch("/api/trade_activity").then(r => r.json()).then(data => {
            const tbody = document.getElementById("trades-tbody");
            tbody.innerHTML = "";
            if (!data.trades || data.trades.length === 0) {
                tbody.innerHTML = "<tr><td colspan=\"7\">No trades yet.</td></tr>";
                return;
            }
            data.trades.forEach(trade => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${trade.time}</td>
                    <td>${trade.chain}</td>
                    <td>${trade.token}</td>
                    <td>${trade.symbol}</td>
                    <td>${trade.score}</td>
                    <td>${trade.reason}</td>
                    <td>${trade.status}</td>
                `;
                tbody.appendChild(row);
            });
        });
    }
    fetchTrades();
    setInterval(fetchTrades, 60000); // refresh every 60s
    </script>
</body>
</html>
"""

@app.route('/')
def home():
    return render_template_string(HTML_TEMPLATE)

# Chain mapping for Recall API (add more as needed)
CHAIN_MAP = {
    'ethereum': 'ethereum',
    'arbitrum': 'arbitrum',
    'optimism': 'optimism',
    'polygon': 'polygon',
    'base': 'base',
    'solana': 'solana',
}

# Example strategies (customize as needed)
STRATEGY = {
    'ethereum': {'stop_loss': 0.005, 'take_profit': 0.01},
    'arbitrum': {'stop_loss': 0.003, 'take_profit': 0.006},
    'optimism': {'stop_loss': 0.003, 'take_profit': 0.006},
    'polygon': {'stop_loss': 0.003, 'take_profit': 0.006},
    'base': {'stop_loss': 0.003, 'take_profit': 0.006},
    'solana': {'stop_loss': 0.05, 'take_profit': 0.1},
}

# Helper to parse trade command (support 0x... and base58 addresses)
trade_cmd_re = re.compile(r"Trade (\d+(?:\.\d+)?) (\w+) to ((?:0x[a-fA-F0-9]{40})|[A-Za-z0-9]{32,}) on (\w+)", re.IGNORECASE)

@app.route('/execute_trade', methods=['POST'])
def execute_trade():
    try:
        data = request.get_json()
        command = data.get('command', '')
        if not command:
            return jsonify({'result': '❌ No command provided'})

        # Try to parse new trade command
        m = trade_cmd_re.match(command.strip())
        if m:
            amount, from_token, to_token_addr, chain = m.groups()
            chain = chain.lower()
            if chain not in CHAIN_MAP:
                return jsonify({'result': f'❌ Unsupported chain: {chain}'})
            strat = STRATEGY.get(chain, {'stop_loss': 0.01, 'take_profit': 0.02})
            from_token_addr = TOKEN_MAP.get(from_token.upper(), None)
            if not from_token_addr:
                return jsonify({'result': f'❌ Unsupported base token: {from_token}'})
            # TODO: Adjust decimals per chain/token if needed
            payload = {
                'fromToken': from_token_addr,
                'toToken': to_token_addr,
                'amount': str(int(float(amount) * (10 ** 6))),  # Default: 6 decimals
                'reason': f'Chat trade command: {command}',
            }
            headers = {
                'Authorization': f'Bearer {RECALL_KEY}',
                'Content-Type': 'application/json',
            }
            try:
                r = requests.post(f'{RECALL_API}/api/trade/execute', json=payload, headers=headers, timeout=20)
                r.raise_for_status()
                res = r.json()
                log_trade({
                    'chain': chain,
                    'name': '',
                    'symbol': from_token,
                    'score': '',
                }, f'User chat command: {command}', res.get('status', 'success'))
                return jsonify({'result': f"✅ Trade executed! Status: {res.get('status', 'success')}\nTx: {res.get('txHash', 'N/A')}"})
            except Exception as e:
                return jsonify({'result': f'❌ Recall API error: {e}'})
        # If not recognized, show a helpful error
        return jsonify({'result': '❌ Command not recognized. Please use: Trade <amount> <base token> to <token address> on <chain>'})
    except Exception as e:
        return jsonify({'result': f'❌ Error: {str(e)}'})

@app.route('/api/portfolio')
def get_portfolio():
    # 1. Fetch balances from Recall API
    try:
        r = requests.get(
            f"{RECALL_API}/api/balance",
            headers={"Authorization": f"Bearer {RECALL_KEY}"},
            timeout=10,
        )
        r.raise_for_status()
        balances = r.json()  # {"USDC": 123.45, ...}
    except Exception as e:
        return jsonify({"error": f"Failed to fetch balances: {e}"}), 500

    # 2. Fetch prices from CoinGecko
    try:
        symbols = list(balances.keys())
        ids = ",".join(COINGECKO_IDS[sym] for sym in symbols if sym in COINGECKO_IDS)
        price_resp = requests.get(
            "https://api.coingecko.com/api/v3/simple/price",
            params={"ids": ids, "vs_currencies": "usd"},
            timeout=10,
        )
        price_data = price_resp.json()
        prices = {sym: price_data[COINGECKO_IDS[sym]]["usd"] for sym in symbols if sym in COINGECKO_IDS}
    except Exception as e:
        return jsonify({"error": f"Failed to fetch prices: {e}"}), 500

    # 3. Build portfolio summary
    portfolio = []
    total_usd = 0
    for sym, bal in balances.items():
        usd = bal * prices.get(sym, 0)
        total_usd += usd
        portfolio.append({
            "symbol": sym,
            "balance": bal,
            "usd_value": usd
        })
    return jsonify({"portfolio": portfolio, "total_usd": total_usd})

def score_gem(gem):
    # Rule-based: weight liquidity, age (younger better), and 24h volume
    liquidity_score = min(gem['liquidity'] / 10000, 1)  # up to 10k
    age_score = max(1 - (gem['age_minutes'] or 0) / (72*60), 0)  # younger is better
    volume_score = min((gem['volume24h'] or 0) / 50000, 1)  # up to 50k
    # Weights: liquidity 50%, age 30%, volume 20%
    score = 0.5 * liquidity_score + 0.3 * age_score + 0.2 * volume_score
    return round(score, 3)

@app.route('/api/dexscreener_gems')
def get_dexscreener_gems():
    chains = [
        'ethereum', 'base', 'polygon', 'solana', 'arbitrum', 'optimism'
    ]
    gems = []
    for chain in chains:
        try:
            resp = requests.get(f'https://api.dexscreener.com/latest/dex/pairs/{chain}', timeout=10)
            data = resp.json()
            pairs = data.get('pairs', [])
            for pair in pairs:
                liquidity = float(pair.get('liquidity', {}).get('usd', 0))
                age_minutes = None
                if 'createdAt' in pair and pair['createdAt']:
                    from datetime import datetime, timezone
                    try:
                        created = datetime.fromisoformat(pair['createdAt'].replace('Z', '+00:00'))
                        now = datetime.now(timezone.utc)
                        age_minutes = (now - created).total_seconds() / 60
                    except Exception:
                        pass
                if liquidity >= 2000 and (age_minutes is None or age_minutes < 72*60):
                    gem = {
                        'chain': chain,
                        'name': pair.get('baseToken', {}).get('name', ''),
                        'symbol': pair.get('baseToken', {}).get('symbol', ''),
                        'liquidity': liquidity,
                        'age_minutes': age_minutes,
                        'volume24h': pair.get('volume', {}).get('h24', 0),
                        'url': pair.get('url', '')
                    }
                    gem['score'] = score_gem(gem)
                    gems.append(gem)
        except Exception as e:
            continue
    gems.sort(key=lambda x: x['score'], reverse=True)
    return jsonify({'gems': gems})

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = "5076341147"  # from user memory

# In-memory set to track alerted gems (by unique key)
alerted_gems = set()

def send_telegram_alert(gem):
    if not TELEGRAM_BOT_TOKEN:
        print("No TELEGRAM_BOT_TOKEN set, skipping Telegram alert.")
        return
    msg = (
        f"🚨 New DEX Gem on {gem['chain'].capitalize()}!\n"
        f"Token: {gem['name']} ({gem['symbol']})\n"
        f"Liquidity: ${gem['liquidity']:.0f}\n"
        f"Age: {gem['age_minutes']:.1f} min\n"
        f"24h Volume: ${gem['volume24h']:,}\n"
        f"[View on Dexscreener]({gem['url']})"
    )
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": msg,
        "parse_mode": "Markdown",
        "disable_web_page_preview": False
    }
    try:
        requests.post(url, data=payload, timeout=10)
    except Exception as e:
        print(f"Failed to send Telegram alert: {e}")

def gem_unique_key(gem):
    # Use chain+symbol+liquidity as a unique key
    return f"{gem['chain']}|{gem['symbol']}|{int(gem['liquidity'])}"

TRADE_SCORE_THRESHOLD = 0.8
trade_activity = []  # In-memory log of trades
traded_gems = set()  # To avoid duplicate trades

def execute_trade(gem):
    # This is a mock; replace with real Recall API trade logic as needed
    # For real trading, use your Recall API endpoint and credentials
    # Example: POST to /api/trade/execute with token addresses and amount
    # Here, we just log the trade
    status = "success"  # or "mocked"
    return status

def log_trade(gem, reason, status):
    trade_activity.insert(0, {
        'time': datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S'),
        'chain': gem['chain'],
        'token': gem['name'],
        'symbol': gem['symbol'],
        'score': gem['score'],
        'reason': reason,
        'status': status
    })
    # Keep only last 50 trades
    if len(trade_activity) > 50:
        trade_activity.pop()

@app.route('/api/trade_activity')
def get_trade_activity():
    return jsonify({'trades': trade_activity})

# In monitor_and_alert_gems, add auto-trade logic

def monitor_and_alert_gems():
    while True:
        try:
            resp = requests.get('http://localhost:5000/api/dexscreener_gems', timeout=20)
            data = resp.json()
            for gem in data.get('gems', []):
                key = gem_unique_key(gem)
                if key not in alerted_gems:
                    send_telegram_alert(gem)
                    alerted_gems.add(key)
                # Automated trading logic
                if gem['score'] >= TRADE_SCORE_THRESHOLD and key not in traded_gems:
                    reason = f"Score {gem['score']} (liquidity/age/volume)"
                    status = execute_trade(gem)
                    log_trade(gem, reason, status)
                    traded_gems.add(key)
            if len(alerted_gems) > 1000:
                alerted_gems.clear()
            if len(traded_gems) > 1000:
                traded_gems.clear()
        except Exception as e:
            print(f"Error in gem monitor: {e}")
        time.sleep(60)

# Start the Telegram alert monitor in a background thread
if TELEGRAM_BOT_TOKEN:
    threading.Thread(target=monitor_and_alert_gems, daemon=True).start()

if __name__ == '__main__':
    print("🌐 Starting GAIA-Recall Web UI...")
    print("📱 Open your browser and go to: http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000) 