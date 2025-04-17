// src/components/InitRepo.js
import React, { useState } from "react";
import { initRepository } from "../api/gitApi";

function InitRepo() {
  const [message, setMessage] = useState("");

  const handleInit = async () => {
    try {
      const result = await initRepository();
      setMessage(result.message);
    } catch (err) {
      setMessage(err.error || "Initialization failed.");
    }
  };

  return (
    <div>
      <h2>Initialize Repository</h2>
      <button onClick={handleInit}>Init Repo</button>
      <p>{message}</p>
    </div>
  );
}

export default InitRepo;
