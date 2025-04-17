import React, { useState } from "react";
import { resetRepo } from "../api/gitApi";

function Reset() {
  const [repoName, setRepoName] = useState("");
  const [commitHash, setCommitHash] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    try {
      const res = await resetRepo({ repoName, commitHash });
      setMessage(res.message);
    } catch (err) {
      setMessage(err.error || "Reset failed.");
    }
  };

  return (
    <div>
      <h2>Reset Repository</h2>
      <input
        type="text"
        placeholder="Repository Name"
        value={repoName}
        onChange={(e) => setRepoName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Commit Hash"
        value={commitHash}
        onChange={(e) => setCommitHash(e.target.value)}
      />
      <button onClick={handleReset}>Reset</button>
      <p>{message}</p>
    </div>
  );
}

export default Reset;
