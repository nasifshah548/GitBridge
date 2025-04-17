import React, { useState } from "react";
import { checkoutBranch } from "../api/gitApi";

function Checkout() {
  const [repoName, setRepoName] = useState("");
  const [branch, setBranch] = useState("");
  const [message, setMessage] = useState("");

  const handleCheckout = async () => {
    try {
      const res = await checkoutBranch({ repoName, branch });
      setMessage(res.message);
    } catch (err) {
      setMessage(err.error || "Checkout failed.");
    }
  };

  return (
    <div>
      <h2>Checkout Branch</h2>
      <input
        type="text"
        placeholder="Repository Name"
        value={repoName}
        onChange={(e) => setRepoName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Branch Name"
        value={branch}
        onChange={(e) => setBranch(e.target.value)}
      />
      <button onClick={handleCheckout}>Checkout</button>
      <p>{message}</p>
    </div>
  );
}

export default Checkout;
