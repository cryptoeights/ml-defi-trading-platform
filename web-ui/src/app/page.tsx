'use client';
import React, { useState } from 'react';
import ScannerDashboard from '../components/ScannerDashboard';
import LitConsentDemo from '../components/LitConsentDemo';

export default function Home() {
  const [authSig, setAuthSig] = useState(null);

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Welcome to the ML DeFi Trading Platform</h1>
      {!authSig ? (
        <div>
          <h2>LIT Consent Required</h2>
          <LitConsentDemo onConsent={setAuthSig} />
        </div>
      ) : (
        <>
          <ScannerDashboard />
          <div style={{ marginTop: '2rem' }}>
            <button onClick={() => setAuthSig(null)}>
              Revoke Consent (Sign Again)
            </button>
          </div>
        </>
      )}
    </main>
  );
}
