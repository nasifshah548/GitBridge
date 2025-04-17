import React, { useState } from "react";
import { cloneRepository } from "../api/gitApi";

const CloneRepo = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [message, setMessage] = useState("");

  const handleClone = async () => {
    try {
      const result = await cloneRepository(repoUrl);
      setMessage(result.message);
    } catch (err) {
      setMessage(err.error || "Something went wrong.");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        placeholder="Paste your repo URL here"
        style={{ width: "300px", marginRight: "1rem" }}
      />
      <button onClick={handleClone}>Clone Repo</button>
      <p>{message}</p>
    </div>
  );
};

export default CloneRepo;
