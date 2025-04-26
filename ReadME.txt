🚀 GitBridge

GitBridge is a full-stack Git UI application designed to eliminate the need for using the command line when working with Git. 
It offers an intuitive interface to manage Git repositories, perform common Git operations, and interact with GitHub, GitLab, 
and Bitbucket seamlessly — all through button clicks.

✨ Key Features

Feature					Description
🔗 Clone Repo				Paste a repository link and clone it to your local workspace.
🛠 Init Repo				Initialize a brand new Git repository in your project folder.
💬 Commit Changes			Stage files and commit with a custom message directly from the UI.
⬆️ Push Repo				Push your committed changes to the connected remote repository.
🌿 Branch Manager			Create, switch, delete, and view branches with zero CLI needed.
🧳 Stash Changes			Stash your uncommitted work temporarily for later use.
♻️ Reset Repo				Reset your local repository to a previous state or commit.
🎯 Checkout Branch			Checkout to any specific branch directly from the UI.
👤 Git Account Link			Login or connect your GitHub/GitLab/Bitbucket accounts securely.
📊 Dashboard				View your connected accounts, linked repositories, and activity summary.


🧰 Tech Stack

- Frontend: React JS, Tailwind CSS, Axios, React Router

- Backend: Node.js, Express.js

- Authentication: Firebase Authentication

- Git Integration: NodeGit or Git CLI via child_process (depending on backend config)

- API Communication: RESTful APIs with Axios


📦 Installation & Setup

🖥 Frontend Setup

cd frontend
npm install
npm start

🖥 Backend Setup

cd backend
npm install
npm run dev

🔐 Environment Variables
.env (Frontend):

REACT_APP_BACKEND_URL=http://localhost:5000


.env (Backend):

PORT=5000
FIREBASE_API_KEY=your_firebase_api_key
GIT_TOKEN=your_git_token_if_required


🔐 Authentication Flow

- Users can log in or sign up using Firebase Authentication.

- After logging in, users can link their GitHub, GitLab, or Bitbucket accounts.

- The app verifies repo ownership before linking the account to the pasted repo.


📚 Folder Structure:

├── frontend/
│   ├── src/
│   │   ├── Components/
│   │   │   ├── CloneRepo.js
│   │   │   ├── InitRepo.js
│   │   │   ├── CommitChanges.js
│   │   │   ├── PushRepo.js
│   │   │   ├── BranchManager.js
│   │   │   ├── Stash.js
│   │   │   ├── Reset.js
│   │   │   ├── Checkout.js
│   │   │   └── Dashboard.js
│   │   └── api/
│   │       └── gitApi.js
├── backend/
│   ├── Controllers/
│   ├── Routes/
│   ├── Middleware/
│   └── app.js


📸 Screenshots

Coming soon... Add UI screenshots here to show what users can expect.


🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request for improvements, bug fixes, or new features.

⚠️ Disclaimer

GitBridge is currently under development. Please use with caution in production environments. Backup your repos before testing 
reset or stash functionalities.

🧠 Future Plans

- Add merge conflict resolution UI

- Integrate pull request creation support

- Visualize commit history using a Git graph

- Add support for GitHub Issues and Pull Requests


📬 Contact

For questions, suggestions, or collaboration:

📧 nasifshah548@gmail.com

🐙 GitHub: nasifshah548


