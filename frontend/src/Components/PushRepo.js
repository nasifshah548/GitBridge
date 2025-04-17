// src/components/PushRepo.js
import React, { useState } from "react";
import { pushRepository } from "../api/gitApi";

function PushRepo() {
  const [message, setMessage] = useState("");

  const handlePush = async () => {
    try {
      const result = await pushRepository();
      setMessage(result.message);
    } catch (err) {
      setMessage(err.error || "Push failed.");
    }
  };

  return (
    <div>
      <h2>Push to Remote</h2>
      <button onClick={handlePush}>Push Repo</button>
      <p>{message}</p>
    </div>
  );
}

export default PushRepo;
