'use client';
import React, { useEffect, useState, useRef } from 'react';
import AskGaiaModal from './AskGaiaModal';

const SCANNERS = [
  { key: 'alpha', label: 'Alpha Scanner', api: '/api/alpha-results' },
  { key: 'gem', label: 'Gem Hunter', api: '/api/gem-results' },
  { key: 'realtime', label: 'Real-Time Sniffer', api: '/api/realtime-results' },
  { key: 'massive', label: 'Dexscreener Massive', api: '/api/massive-results' },
];

interface ScannerResult {
  token?: string;
  chain?: string;
  liquidity?: number;
  score?: number;
  gem_score?: number;
  alpha_score?: number;
  timestamp?: string;
  [key: string]: any;
}

type TradeModalProps = {
  token: any;
  onClose: () => void;
  onTradeComplete?: (trade: any) => void;
};

function TradeModal({ token, onClose, onTradeComplete }: TradeModalProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [txid, setTxid] = useState('');
  // Demo: use ML or config for amount
  let amount = 300;
  if (token.chain === 'solana') amount = 300;
  if (token.chain === 'ethereum' && (token.symbol === 'WETH' || token.symbol === 'WBTC')) amount = 1500;
  if (token.chain === 'ethereum') amount = 300;
  // ...add more logic as needed

  const handleTrade = async () => {
    setLoading(true);
    setStatus('pending');
    setTxid('');
    // Demo: mock API call
    setTimeout(() => {
      setStatus('success');
      setTxid('0xMOCKTXID');
      setLoading(false);
      onTradeComplete && onTradeComplete({
        token: token.token || token.symbol || token.name,
        chain: token.chain || token.chainId,
        amount,
        score: token.score ?? token.gem_score ?? token.alpha_score ?? '-',
        status: 'success',
        txid: '0xMOCKTXID',
      });
    }, 1500);
    // For real API:
    // const res = await fetch('/api/trade', { ... })
    // ...
  };

  return (
    <div className="modal" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#222', color: '#fff', padding: 24, borderRadius: 8, minWidth: 400, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 8, right: 12, background: 'transparent', color: '#fff', border: 'none', fontSize: 20, cursor: 'pointer' }} title="Close">×</button>
        <h3>Trade Confirmation</h3>
        <p><b>Token:</b> {token.token || token.symbol || token.name}</p>
        <p><b>Chain:</b> {token.chain || token.chainId}</p>
        <p><b>Suggested Amount:</b> ${amount}</p>
        <p><b>ML Score:</b> {token.score ?? token.gem_score ?? token.alpha_score ?? '-'}</p>
        <button onClick={handleTrade} disabled={loading || status === 'success'} style={{ marginRight: 8 }}>
          {loading ? 'Trading...' : 'Confirm Trade'}
        </button>
        <button onClick={onClose} disabled={loading}>Cancel</button>
        {status === 'pending' && <div style={{ marginTop: 16 }}>Trade pending...</div>}
        {status === 'success' && <div style={{ marginTop: 16, color: 'lightgreen' }}>Trade executed! TxID: {txid}</div>}
        {status === 'error' && <div style={{ marginTop: 16, color: 'red' }}>Trade failed. Try again.</div>}
      </div>
    </div>
  );
}

export default function ScannerDashboard() {
  const [selected, setSelected] = useState('alpha');
  const [results, setResults] = useState<ScannerResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [askGaiaToken, setAskGaiaToken] = useState<any | null>(null);
  const [tradeToken, setTradeToken] = useState<any | null>(null);
  const [tradeHistory, setTradeHistory] = useState<any[]>([]);
  const [autoTraded, setAutoTraded] = useState<Set<string>>(new Set());
  const autoTradedRef = useRef(autoTraded);
  autoTradedRef.current = autoTraded;

  const fetchResults = async (api: string) => {
    setLoading(true);
    try {
      const res = await fetch(api);
      const data = await res.json();
      setResults(data.results || []);
    } catch (e) {
      setResults([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const api = SCANNERS.find(s => s.key === selected)?.api || SCANNERS[0].api;
    fetchResults(api);
    const interval = setInterval(() => fetchResults(api), 5000);
    return () => clearInterval(interval);
  }, [selected]);

  const getScore = (r: ScannerResult) => r.score ?? r.gem_score ?? r.alpha_score ?? 0;

  const getDisplayFields = (r: ScannerResult) => {
    if (selected === 'massive') {
      return {
        token: r.baseToken?.symbol || r.baseToken?.name || '-',
        chain: r.chainId || '-',
        liquidity: (typeof r.liquidity === 'object' && r.liquidity !== null && 'usd' in r.liquidity) ? (r.liquidity as any).usd : (typeof r.liquidity === 'number' ? r.liquidity : '-'),
        score: '-',
        timestamp: r.pairCreatedAt ? new Date(r.pairCreatedAt).toLocaleTimeString() : '-',
      };
    }
    return {
      token: r.token || r.symbol || r.name || '-',
      chain: r.chain || r.network || '-',
      liquidity: r.liquidity ?? '-',
      score: getScore(r).toFixed(2),
      timestamp: r.timestamp ? new Date(r.timestamp).toLocaleTimeString() : '-',
    };
  };

  const handleTradeComplete = (trade: any) => {
    setTradeHistory(prev => [trade, ...prev]);
  };

  // Auto-trade effect
  useEffect(() => {
    results.forEach(token => {
      const score = token.score ?? token.gem_score ?? token.alpha_score ?? 0;
      const uniqueId = token.pairAddress || `${token.token || token.symbol || token.name}_${token.chain || token.chainId}`;
      if (score >= 7 && !autoTradedRef.current.has(uniqueId)) {
        // Execute trade automatically
        let amount = 300;
        if (token.chain === 'solana') amount = 300;
        if (token.chain === 'ethereum' && (token.symbol === 'WETH' || token.symbol === 'WBTC')) amount = 1500;
        if (token.chain === 'ethereum') amount = 300;
        handleTradeComplete({
          token: token.token || token.symbol || token.name,
          chain: token.chain || token.chainId,
          amount,
          score,
          status: 'success',
          txid: '0xMOCKTXID',
        });
        setAutoTraded(prev => new Set(prev).add(uniqueId));
      }
    });
  }, [results]);

  return (
    <main style={{ padding: '2rem' }}>
      <h1>GeckoFit Recall Agent</h1>
      {/* Auto-Trading Status Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0' }}>
        <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: '#2ecc40', marginRight: 8, boxShadow: '0 0 6px #2ecc40' }}></span>
        <span style={{ color: '#2ecc40', fontWeight: 'bold', fontSize: 16 }}>Auto-Trading Active</span>
      </div>
      <div className="card">
        <h2>Live Scanner Dashboard</h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          {SCANNERS.map(s => (
            <button
              key={s.key}
              onClick={() => setSelected(s.key)}
              className={selected === s.key ? 'button-primary' : 'button-secondary'}
              style={{ fontWeight: selected === s.key ? 'bold' : 'normal' }}
            >
              {s.label}
            </button>
          ))}
        </div>
        {loading && <p>Loading...</p>}
        {!loading && results.length === 0 && <p>No scanner results yet.</p>}
        {!loading && results.length > 0 && (
          <table>
            <thead>
              <tr>
                <th style={{ width: '18%' }}>Token</th>
                <th style={{ width: '12%' }}>Chain</th>
                <th style={{ width: '18%' }}>Liquidity ($)</th>
                <th style={{ width: '10%' }}>Score</th>
                <th style={{ width: '16%' }}>Timestamp</th>
                <th style={{ width: '13%' }}>GAIA</th>
                <th style={{ width: '13%' }}>Trade</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => {
                const f = getDisplayFields(r);
                const score = r.score ?? r.gem_score ?? r.alpha_score ?? 0;
                return (
                  <tr key={i}>
                    <td>{f.token}</td>
                    <td>{f.chain}</td>
                    <td>{typeof f.liquidity === 'number' ? f.liquidity.toLocaleString() : f.liquidity}</td>
                    <td>{f.score}</td>
                    <td>{f.timestamp}</td>
                    <td><button className="button-secondary" onClick={() => setAskGaiaToken(r)}>Ask GAIA</button></td>
                    <td>
                      {score >= 7 ? (
                        <button className="button-primary" onClick={() => setTradeToken(r)}>Trade Now</button>
                      ) : (
                        <span style={{ color: '#888' }}>N/A</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {askGaiaToken && (
        <AskGaiaModal token={askGaiaToken} onClose={() => setAskGaiaToken(null)} />
      )}
      {tradeToken && (
        <TradeModal
          token={tradeToken}
          onClose={() => setTradeToken(null)}
          onTradeComplete={(trade) => {
            handleTradeComplete(trade);
            setTradeToken(null);
          }}
        />
      )}
      {/* Trade History Section */}
      <div className="card" style={{ marginTop: '3rem' }}>
        <h3>Trade History</h3>
        {tradeHistory.length === 0 ? (
          <p>No trades executed yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th style={{ width: '18%' }}>Token</th>
                <th style={{ width: '12%' }}>Chain</th>
                <th style={{ width: '18%' }}>Amount ($)</th>
                <th style={{ width: '10%' }}>Score</th>
                <th style={{ width: '16%' }}>Status</th>
                <th style={{ width: '26%' }}>TxID</th>
              </tr>
            </thead>
            <tbody>
              {tradeHistory.map((t, i) => (
                <tr key={i}>
                  <td>{t.token}</td>
                  <td>{t.chain}</td>
                  <td>${t.amount}</td>
                  <td>{t.score}</td>
                  <td>{t.status}</td>
                  <td style={{ wordBreak: 'break-all' }}>{t.txid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
} 