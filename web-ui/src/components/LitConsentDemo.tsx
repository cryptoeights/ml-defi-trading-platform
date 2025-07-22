'use client';
// @ts-expect-error: No types for @lit-protocol/sdk-browser
import LitJsSdk from "@lit-protocol/sdk-browser";
import React, { useState } from "react";

export default function LitConsentDemo({ onConsent }: { onConsent?: (sig: any) => void }) {
  const [authSig, setAuthSig] = useState<any>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConsent = async () => {
    setError(null);
    setIsSigning(true);
    try {
      if (typeof window === "undefined" || !(window as any).ethereum) {
        setError("Please install MetaMask or another Ethereum wallet extension.");
        setIsSigning(false);
        return;
      }
      // Explicitly request account access
      await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      const client = new LitJsSdk.LitNodeClient();
      await client.connect();
      const sig = await LitJsSdk.checkAndSignAuthMessage({ chain: "ethereum" });
      setAuthSig(sig);
      if (onConsent) onConsent(sig);
      alert("User consent granted! Signature:\n" + JSON.stringify(sig, null, 2));
    } catch (e: any) {
      setError(e?.message || "Signature failed or was cancelled.");
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div>
      <h2>LIT Consent Demo</h2>
      <p style={{ maxWidth: 500, marginBottom: '1em', color: '#ccc' }}>
        <strong>Why sign?</strong> <br />
        This signature is required to grant user consent via the <b>LIT Protocol</b>. It enables secure, permissioned actions on this platform—ensuring that all sensitive operations (like trading, portfolio changes, or withdrawals) are only performed with your explicit approval. Your signature is never used to move funds directly, but acts as a cryptographic proof of your consent and policy agreement.
      </p>
      <button
        onClick={handleConsent}
        style={{
          padding: '16px 32px',
          fontSize: '1.2em',
          fontWeight: 'bold',
          background: '#f6851b',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: isSigning ? 'not-allowed' : 'pointer',
          opacity: isSigning ? 0.6 : 1,
          marginBottom: '1em',
        }}
        disabled={isSigning}
      >
        {isSigning ? 'Waiting for MetaMask...' : 'Sign with MetaMask to Continue'}
      </button>
      {error && <div style={{ color: 'red', marginBottom: '1em' }}>{error}</div>}
      {authSig && (
        <pre style={{ fontSize: "0.8em", marginTop: "1em" }}>
          {JSON.stringify(authSig, null, 2)}
        </pre>
      )}
    </div>
  );
} 