import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CloneRepo from "./Components/CloneRepo";
import InitRepo from "./Components/InitRepo";
import CommitChanges from "./Components/CommitChanges";
import PushRepo from "./Components/PushRepo";
import Dashboard from "./Components/Dashboard";
import BranchManager from "./Components/BranchManager";
import Stash from "./Components/Stash";
import Reset from "./Components/Reset";
import Checkout from "./Components/Checkout";

function App() {
  return (
    <Router>
      <div className="app-container">
        <aside className="sidebar">
          <h2 className="logo">GitBridge</h2>
          <nav>
            <ul className="sidebar-nav">
              <li>
                <Link to="/">Clone Repo</Link>
              </li>
              <li>
                <Link to="/init">Init Repo</Link>
              </li>
              <li>
                <Link to="/commit">Commit Changes</Link>
              </li>
              <li>
                <Link to="/push">Push Repo</Link>
              </li>
              <li>
                <Link to="/branch-manager">Branch Manager</Link>
              </li>
              <li>
                <Link to="/stash">Stash</Link>
              </li>
              <li>
                <Link to="/reset">Reset</Link>
              </li>
              <li>
                <Link to="/checkout">Checkout</Link>
              </li>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<CloneRepo />} />
            <Route path="/init" element={<InitRepo />} />
            <Route path="/commit" element={<CommitChanges />} />
            <Route path="/push" element={<PushRepo />} />
            <Route path="/branch-manager" element={<BranchManager />} />
            <Route path="/stash" element={<Stash />} />
            <Route path="/reset" element={<Reset />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
