import type { NextApiRequest, NextApiResponse } from 'next';

const tokens = ['USDC', 'WETH', 'DAI', 'SOL', 'MATIC'];
const chains = ['Ethereum', 'Solana', 'Polygon', 'Arbitrum', 'Base'];

function randomResult() {
  return {
    token: tokens[Math.floor(Math.random() * tokens.length)],
    chain: chains[Math.floor(Math.random() * chains.length)],
    liquidity: Math.floor(Math.random() * 1000000) + 10000,
    score: Math.random() * 10,
    timestamp: new Date().toISOString(),
  };
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Return 5 random results for demo
  const results = Array.from({ length: 5 }, randomResult);
  res.status(200).json({ results });
} 