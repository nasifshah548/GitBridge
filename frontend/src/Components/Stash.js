import React, { useState } from "react";
import { stashChanges } from "../api/gitApi";

function Stash() {
  const [repoName, setRepoName] = useState("");
  const [message, setMessage] = useState("");

  const handleStash = async () => {
    try {
      const res = await stashChanges({ repoName });
      setMessage(res.message);
    } catch (err) {
      setMessage(err.error || "Failed to stash changes.");
    }
  };

  return (
    <div>
      <h2>Stash Changes</h2>
      <input
        type="text"
        placeholder="Repository Name"
        value={repoName}
        onChange={(e) => setRepoName(e.target.value)}
      />
      <button onClick={handleStash}>Stash</button>
      <p>{message}</p>
    </div>
  );
}

export default Stash;
