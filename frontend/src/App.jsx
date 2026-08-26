import React, { useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import contractArtifact from "./LandRegistry.json";

const ABI = contractArtifact.abi;

const CONTRACT_ADDRESS =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const STATUS = [
  "REGISTERED",
  "VERIFIED",
  "TRANSFER_PENDING",
  "TRANSFERRED",
  "DISPUTED"
];

export default function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [id, setId] = useState("1");
  const [property, setProperty] = useState(null);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [buyer, setBuyer] = useState("");

  async function connect() {
    if (!window.ethereum) return setMessage("Install MetaMask first.");
    const p = new BrowserProvider(window.ethereum);
    await p.send("eth_requestAccounts", []);
    const signer = await p.getSigner();
    setProvider(p);
    setAccount(await signer.getAddress());
    setContract(new Contract(CONTRACT_ADDRESS, ABI, signer));
  }

  async function lookup() {
    try {
      const p = await contract.getProperty(id);
      const h = await contract.getOwnershipHistory(id);
      setProperty(p); setHistory(h); setMessage("Property loaded.");
    } catch (e) { setProperty(null); setHistory([]); setMessage(e.shortMessage || e.message); }
  }

  async function verify() {
    const tx = await contract.verifyProperty(id); await tx.wait(); await lookup();
  }

  async function transfer() {
    const hash = keccak256(toUtf8Bytes(`demo-deed-${id}-${Date.now()}`));
    const tx = await contract.transferOwnership(id, buyer, hash); await tx.wait(); await lookup();
  }

  return <main>
    <header><div><span className="eyebrow">BLOCKCHAIN PROTOTYPE</span><h1>Land Registry</h1><p>Tamper-evident property records using Solidity.</p></div><button onClick={connect}>{account ? `${account.slice(0,6)}...${account.slice(-4)}` : "Connect Wallet"}</button></header>
    <section className="notice">Educational prototype only — all property data is synthetic and does not establish legal ownership.</section>
    <section className="card search"><label>Property ID<input value={id} onChange={e => setId(e.target.value)} /></label><button onClick={lookup} disabled={!contract}>Search Property</button></section>
    {message && <p className="message">{message}</p>}
    {property && <>
      <section className="grid">
        <div className="card"><h2>{property[1]}</h2><p className="muted">{property[2]}</p><dl><dt>Area</dt><dd>{property[3].toString()} sq ft</dd><dt>Type</dt><dd>{property[4]}</dd><dt>Current owner</dt><dd>{property[5]}</dd><dt>Previous owner</dt><dd>{property[6]}</dd><dt>Status</dt><dd><span className="pill">{STATUS[Number(property[9])]}</span></dd><dt>Document hash</dt><dd className="mono">{property[7]}</dd></dl></div>
        <div className="card"><h2>Authority Actions</h2><button onClick={verify}>Verify Property</button><div className="divider"/><label>New owner wallet<input value={buyer} onChange={e => setBuyer(e.target.value)} placeholder="0x..." /></label><button onClick={transfer}>Transfer Ownership</button></div>
      </section>
      <section className="card"><h2>Ownership History</h2>{history.map((r,i)=><div className="history" key={i}><b>#{i+1}</b><span>{r.owner}</span><span>{new Date(Number(r.timestamp)*1000).toLocaleString()}</span><span className="mono">{r.deedHash}</span></div>)}</section>
    </>}
  </main>;
}
