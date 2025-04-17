// src/components/CommitChanges.js
import React, { useState } from "react";
import { commitChanges } from "../api/gitApi";

function CommitChanges() {
  const [commitMessage, setCommitMessage] = useState("");
  const [message, setMessage] = useState("");

  const handleCommit = async () => {
    try {
      const result = await commitChanges(commitMessage);
      setMessage(result.message);
    } catch (err) {
      setMessage(err.error || "Commit failed.");
    }
  };

  return (
    <div>
      <h2>Commit Changes</h2>
      <input
        type="text"
        value={commitMessage}
        onChange={(e) => setCommitMessage(e.target.value)}
        placeholder="Enter commit message"
      />
      <button onClick={handleCommit}>Commit</button>
      <p>{message}</p>
    </div>
  );
}

export default CommitChanges;
