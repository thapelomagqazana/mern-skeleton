---
---

# **MERN Skeleton 🚀**
A minimal yet powerful **MERN (MongoDB, Express, React, Node.js) boilerplate** to kickstart full-stack web applications. This template provides a **structured setup** with authentication, API integration, state management, and best practices for **scalability and maintainability**.


## **📌 Features**
✅ **User Authentication** (Sign Up, Sign In, Logout)  
✅ **React with TypeScript** & **Material-UI** for UI  
✅ **API Integration** with Express & MongoDB  
✅ **JWT-based authentication** for secure access  
✅ **State Management** with Context API  
✅ **Dockerized** for easy deployment  
✅ **Cypress E2E Testing** setup  


---


## **📦 Tech Stack**
- **Frontend**: React, TypeScript, Vite, React Router, Material-UI, React Hook Form  
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT Authentication  
- **DevOps**: Docker, Docker Compose  
- **Testing**: Cypress (E2E), Jest, Supertest  


---


## **🚀 Getting Started**
Follow the steps below to set up the project:


### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/thapelomagqazana/mern-skeleton.git
cd mern-skeleton


```


### **2️⃣ Install Dependencies**
#### **Frontend**
```bash
cd frontend
npm install
```
#### **Backend**
```bash
cd backend
npm install
```


### **3️⃣ Set Up Environment Variables**
Create a `.env` file in both **frontend** and **backend** folders.  


#### **Frontend (`frontend/.env`)**
```ini
VITE_API_URL=http://localhost:5000
VITE_PORT=8080
```


#### **Backend (`backend/.env`)**
```ini
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern_skeleton
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:8080
NODE_ENV=development
```


---


## **🛠 Running the Application**


### **⚡ Start the Backend**
```bash
cd backend
npm run dev
```
- Runs the server on **http://localhost:5000**  


### **⚡ Start the Frontend**
```bash
cd frontend
npm run dev
```
- Runs the client on **http://localhost:8080**  


---


## **🐳 Running with Docker**
```bash
docker-compose up --build
```
- Runs both frontend and backend inside containers

### **Remove Docker Container**
```bash
docker-compose down -v --remove-orphans
```
- Remove both frontend and backend containers  


---


## **🧪 Running Tests**
### **Cypress E2E Tests**
```bash
cd frontend
npx cypress open
```
- Opens the Cypress test runner  


---


## **📂 Project Structure**
```
mern-skeleton
│── frontend/         # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │── .env
│   │── package.json
│── backend/          # Node.js backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── server.js
│   ├── .env
│   ├── package.json
│── docker-compose.yml
│── README.md
```


---


## **📜 API Endpoints**
### **🟢 Authentication**
| Method | Endpoint | Description |
|--------|---------|-------------|
| `POST` | `/auth/signup` | Register a new user |
| `POST` | `/auth/signin` | Login user |
| `GET` | `/auth/signout` | Logout user |
| `GET` | `/api/users` | Get users |
| `GET` | `/api/users/:userId` | Get user details |
| `PUT` | `/api/users/:userId` | Update user |
| `DELETE` | `/api/users/:userId` | Delete user |


---


## **📜 License**
This project is licensed under the **MIT License**.  


---


## **🌟 Contributing**
Feel free to contribute! Fork the repository and submit a pull request.  


---


## **📞 Contact**
For any questions, feel free to reach out! 🚀
