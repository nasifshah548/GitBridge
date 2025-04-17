// src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import { getLinkedGitAccounts, unlinkGitAccount } from "../api/gitApi";

function Dashboard() {
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const result = await getLinkedGitAccounts();
        setLinkedAccounts(result.accounts || []);
      } catch (err) {
        setMessage("Failed to fetch linked accounts.");
      }
    };
    fetchAccounts();
  }, []);

  const handleUnlink = async (provider) => {
    try {
      const result = await unlinkGitAccount(provider);
      setLinkedAccounts(
        linkedAccounts.filter((acc) => acc.provider !== provider)
      );
      setMessage(result.message);
    } catch (err) {
      setMessage("Unlinking failed.");
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Linked Git Accounts:</p>
      {linkedAccounts.length === 0 ? (
        <p>No linked accounts.</p>
      ) : (
        <ul>
          {linkedAccounts.map((account) => (
            <li key={account.provider}>
              <strong>{account.provider}</strong>: {account.username}
              <button onClick={() => handleUnlink(account.provider)}>
                Unlink
              </button>
            </li>
          ))}
        </ul>
      )}
      <p>{message}</p>
    </div>
  );
}

export default Dashboard;
