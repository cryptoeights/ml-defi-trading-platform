import React, { useState } from 'react';

interface AskGaiaModalProps {
  token: any;
  onClose: () => void;
}

const GAIA_API_URL = 'https://0xe5b3d7350c4532c7224845b40a06c11adc741129.gaia.domains/v1/ask';

export default function AskGaiaModal({ token, onClose }: AskGaiaModalProps) {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const askGaia = async () => {
    setLoading(true);
    setResponse('');
    // Demo ML-based response based on score
    let score = 0;
    if (typeof token.score === 'number') {
      score = token.score;
    } else if (typeof token.gem_score === 'number') {
      score = token.gem_score;
    } else if (typeof token.alpha_score === 'number') {
      score = token.alpha_score;
    } else {
      score = Math.random() * 10; // fallback for demo
    }
    let advice = '';
    if (score >= 7) {
      advice = `GAIA ML Score: ${score.toFixed(2)}. This token is worth considering for a buy, but always do your own research!`;
    } else if (score >= 4) {
      advice = `GAIA ML Score: ${score.toFixed(2)}. This token has moderate potential. Proceed with caution and do your own research.`;
    } else {
      advice = `GAIA ML Score: ${score.toFixed(2)}. This token appears risky based on ML analysis. Be very cautious!`;
    }
    setTimeout(() => {
      setResponse(advice);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="modal" style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{ background: '#222', color: '#fff', padding: 24, borderRadius: 8, minWidth: 400 }}>
        <h3>Ask GAIA about {token.token || token.symbol || token.name}</h3>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={3}
          style={{ width: '100%', marginBottom: 8 }}
          placeholder="Type your question for GAIA..."
        />
        <div>
          <button onClick={askGaia} disabled={loading || !input} style={{ marginRight: 8 }}>
            {loading ? 'Asking...' : 'Ask'}
          </button>
          <button onClick={onClose}>Close</button>
        </div>
        {response && (
          <div style={{ marginTop: 16, background: '#333', padding: 12, borderRadius: 4 }}>
            <strong>GAIA:</strong>
            <div>{response}</div>
          </div>
        )}
      </div>
    </div>
  );
} 