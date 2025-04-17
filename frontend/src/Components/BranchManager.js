import React, { useState, useEffect } from "react";
import {
  createBranch,
  switchBranch,
  listBranches,
  deleteBranch,
} from "../api/gitApi";

function BranchManager() {
  const [branchName, setBranchName] = useState("");
  const [branches, setBranches] = useState([]);
  const [message, setMessage] = useState("");

  const fetchBranches = async () => {
    try {
      const result = await listBranches();
      setBranches(result.branches);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch branches.");
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleCreateBranch = async () => {
    try {
      const result = await createBranch(branchName);
      setMessage(result.message);
      setBranchName("");
      fetchBranches();
    } catch (err) {
      setMessage(err.error || "Create branch failed.");
    }
  };

  const handleSwitchBranch = async (branch) => {
    try {
      const result = await switchBranch(branch);
      setMessage(result.message);
    } catch (err) {
      setMessage(err.error || "Switch branch failed.");
    }
  };

  const handleDeleteBranch = async (branch) => {
    try {
      const result = await deleteBranch(branch);
      setMessage(result.message);
      fetchBranches();
    } catch (err) {
      setMessage(err.error || "Delete branch failed.");
    }
  };

  return (
    <div
      style={{ padding: "1rem", border: "1px solid #ccc", marginTop: "2rem" }}
    >
      <h2>Branch Manager</h2>
      <input
        type="text"
        placeholder="Branch name"
        value={branchName}
        onChange={(e) => setBranchName(e.target.value)}
        style={{ marginRight: "1rem" }}
      />
      <button onClick={handleCreateBranch}>Create Branch</button>

      <h3>Available Branches</h3>
      <ul>
        {branches.map((branch, index) => (
          <li key={index}>
            {branch}
            <button
              onClick={() => handleSwitchBranch(branch)}
              style={{ marginLeft: "1rem" }}
            >
              Switch
            </button>
            <button
              onClick={() => handleDeleteBranch(branch)}
              style={{ marginLeft: "0.5rem", color: "red" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {message && <p>{message}</p>}
    </div>
  );
}

export default BranchManager;

/*
What This Component Does:

Displays a list of all Git branches

Lets the user:

Create a new branch

Switch to another branch

Delete any branch (carefully!)
*/
