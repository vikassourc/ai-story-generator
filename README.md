
https://ai-story-generator-1-43ea.onrender.com/    (web application Link)


Starlight Weaver: An AI Story Generation Application
Overview
Starlight Weaver is a full-stack web application that leverages Generative AI to assist users in creating unique and coherent stories. Users can provide various parameters like a main idea, character, setting, and conflict, along with desired story length and tone, to generate a complete narrative. The application also includes a feature to generate random prompts for inspiration and allows users to save, load, and delete their generated stories.

This project demonstrates the practical application of Large Language Models (LLMs) in creative content generation and showcases a modern web development stack with a React frontend and a Node.js backend.

Features
AI-Powered Story Generation: Generate creative stories based on user inputs using the Gemini API.

Random Prompt Generation: Get inspired with automatically generated story ideas.

Customizable Stories: Control story length (short, medium, long) and tone/genre (neutral, mysterious, humorous, dramatic, fantasy, sci-fi, horror, romantic).

Story Management: Save, load, and delete generated stories using local browser storage.

Responsive Design: User-friendly interface optimized for various screen sizes.

Full-Stack Deployment: Backend deployed as a Web Service and frontend as a Static Site on Render.com.

Technologies Used
Frontend
React.js: For building the dynamic user interface.

Tailwind CSS: For rapid and responsive UI styling.

HTML/CSS/JavaScript: Core web technologies.

Backend
Node.js: JavaScript runtime environment.

Express.js: Web application framework for the backend API.

Google Gemini API: For accessing powerful Large Language Models for text generation.

dotenv: For managing environment variables securely.

cors: For enabling Cross-Origin Resource Sharing.

node-fetch: For making HTTP requests from the Node.js backend.

Deployment
Render.com: Cloud platform for deploying both the backend web service and the frontend static site.

GitHub: Version control and code hosting.

Project Structure
The repository is organized into two main directories:

backend/: Contains the Node.js Express server code.

frontend/: Contains the React.js application code (HTML, JavaScript, Manifest, Service Worker).

ai-story-generator/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env (ignored by Git, for local development only)
└── frontend/
    ├── index.html
    ├── App.js
    ├── manifest.json
    └── service-worker.js

Setup and Local Development
To run this project locally, you'll need Node.js and Git installed on your machine.

1. Clone the Repository
git clone YOUR_GITHUB_REPOSITORY_LINK_HERE
cd ai-story-generator

(Replace YOUR_GITHUB_REPOSITORY_LINK_HERE with the actual URL of your GitHub repository)

2. Backend Setup
Navigate into the backend directory:

cd backend

Install backend dependencies:

npm install

Create a .env file in the backend directory (at the same level as server.js) and add your Gemini API key:

GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE

(Replace YOUR_GEMINI_API_KEY_HERE with your actual Gemini API Key)
Note: This .env file is ignored by Git for security reasons.

Start the backend server:

node server.js

The backend server will typically run on http://localhost:3001. Keep this terminal window open.

3. Frontend Setup
Open a new terminal window and navigate back to the root of your project, then into the frontend directory:

cd ../frontend

Open the index.html file using a local web server (e.g., Live Server VS Code extension).

If using Live Server, right-click index.html in VS Code and select "Open with Live Server."

Your frontend application will open in your browser, usually at http://127.0.0.1:5500/index.html.

Important: Ensure your frontend/App.js file's BACKEND_URL constant is set to http://localhost:3001 for local development.

Deployment
Both the frontend and backend are deployed on Render.com.

1. Backend Deployment (Render Web Service)
The backend is deployed as a Node.js Web Service on Render.

Root Directory on Render: backend

Build Command: npm install

Start Command: node server.js

Environment Variable: GEMINI_API_KEY (set your actual key in Render's environment settings).

Live Backend URL: https://ai-story-generator-156s.onrender.com

2. Frontend Deployment (Render Static Site)
The frontend is deployed as a Static Site on Render.

Root Directory on Render: frontend

Build Command: (Leave empty for this simple setup)

Publish Directory: (Leave empty or set to ./)

Live Frontend URL: (Your Render Static Site URL, e.g., https://your-static-site-name.onrender.com)

Important: For the deployed frontend to communicate with the deployed backend, ensure the BACKEND_URL in your frontend/App.js is updated to point to your live Render backend URL (e.g., https://ai-story-generator-156s.onrender.com). After updating App.js, commit and push the change to GitHub, then trigger a new deploy for your frontend static site on Render.

Usage
Open the live frontend URL in your browser.

Enter your desired story ideas, characters, settings, and conflicts into the input fields.

Select your preferred story length and tone.

Click "Weave Story" to generate a new narrative.

You can also click "Generate Random Prompt" for inspiration.

Use the "Copy Story" button to copy the generated text or "Save Story" to store it locally in your browser.

"View Saved Stories" allows you to load or delete previously saved stories.

Note on Free Tier Deployment: If the application has been inactive for a while, the first "Weave Story" or "Generate Random Prompt" request might experience a delay (30-60 seconds) as the backend service spins up from inactivity. Subsequent requests will be much faster.

Future Enhancements
Database Integration: Implement persistent user accounts and story storage using a cloud database (e.g., Firestore) instead of local storage.

Multi-Modal Output: Integrate image generation APIs to create visuals accompanying the stories.

Advanced Customization: Add more granular controls for story elements, plot points, or character development.

User Feedback: Implement a system for users to rate or refine generated stories to improve model performance.

Multi-Language Support: Expand the application to generate stories in various languages.
