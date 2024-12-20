# AskFinance

A comprehensive Q&A web application where users can post and engage in finance-related questions, and admins manage content. This project demonstrates a full-stack implementation using modern technologies.

---
[screen-capture (2).webm](https://github.com/user-attachments/assets/1d9e8e97-04e3-435f-be19-72af2ba02819)


## 🚀 Features

### User Functionality
1. **Signup/Login**  
   - Secure signup and login with email and password.  
   - Google OAuth for alternative login.
   - Logout functionality included.

2. **Posting Questions**  
   - Users can post finance-related questions with mandatory tags.  

3. **Comments**  
   - Users can comment on their posts or approved posts by admins.  
   - Admins can comment on any post.

4. **Likes & Dislikes**  
   - Users can like or dislike posts, including their own.

5. **Edit/Delete**  
   - Users can edit or delete their own posts.

6. **Feed**  
   - View all approved posts in a user-friendly feed.

7. **Search/Filter**  
   - Search or filter posts based on tags.

### Admin Functionality
1. **Manage Questions**  
   - Approve or reject pending questions.
   - Delete any post.

2. **Comments Management**  
   - Add or delete comments on any post.

---

## 💻 Tech Stack

### Frontend
- **React** for UI development.
- **Tailwind CSS** for styling.

### Backend
- **FastAPI** for backend logic and APIs.
- **MongoDB Atlas** for database management.

### Deployment
- **Netlify** for frontend deployment.
- **Render** for backend deployment.

---

## 🌐 Live Demo
**Deployed Link:** https://askfinance.netlify.app/

---

## 🛠️ Setup Instructions

Follow these steps to set up and run the project locally:

### Prerequisites
- [Node.js](https://nodejs.org/) installed for frontend development.
- [Python 3.9+](https://www.python.org/) installed for backend development.
- MongoDB Atlas URI for database connection.

### Backend Setup
1. Clone the repository:  
   ```bash
   git clone https://github.com/your-repo.git
   cd your-repo/server
   ```

2. Create a virtual environment:  
   ```bash
   python -m venv env
   source env/bin/activate  # For macOS/Linux
   env\Scripts\activate  # For Windows
   ```

3. Install dependencies:  
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:  
   - Create a `.env` file in the `server` directory and add:  
     ```env
     MONGO_URI=your_mongo_uri
     SECRET_KEY=your_jwt_secret_key
     GOOGLE_CLIENT_ID=your_google_client_id
     GOOGLE_CLIENT_SECRET=your_google_client_secret
     ```

5. Run the backend server:  
   ```bash
   uvicorn app.main:app --reload
   ```

6. Access the backend at: `http://127.0.0.1:8000`

---

### Frontend Setup
1. Navigate to the frontend folder:  
   ```bash
   cd ../client
   ```

2. Install dependencies:  
   ```bash
   npm install
   ```

3. Configure environment variables:  
   - Create a `.env` file in the `client` directory and add:  
     ```env
     REACT_APP_API_URL=http://127.0.0.1:8000
     REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
     ```

4. Start the development server:  
   ```bash
   npm start
   ```

5. Access the frontend at: `http://localhost:3000`

---

## 📚 Documentation

- **API Endpoints**:  
  The backend provides a variety of endpoints for user authentication, question management, and commenting.

  | Endpoint             | Method | Description                          |
  |----------------------|--------|--------------------------------------|
  | `/auth/signup`       | POST   | User signup                         |
  | `/auth/login`        | POST   | User login                          |
  | `/auth/google-login` | POST   | Google OAuth login                  |
  | `/questions`         | GET    | Fetch all approved questions        |
  | `/questions/pending` | GET    | Fetch pending questions (Admin/User)|
  | `/questions/<id>`    | DELETE | Delete a specific question          |
  | `/comments/<id>`     | POST   | Add a comment to a question         |

---

## 📂 Folder Structure
```
root
├── client/                # Frontend code
│   ├── public/            # Static files
│   ├── src/               # React components, styles, etc.
│   └── .env               # Frontend environment variables
├── server/                # Backend code
│   ├── app/               # FastAPI application files
│   └── .env               # Backend environment variables
└── README.md              # Documentation
```

---

Developed with 💙 by Saar Agrawal

--- 

Feel free to expand this README further as needed!
