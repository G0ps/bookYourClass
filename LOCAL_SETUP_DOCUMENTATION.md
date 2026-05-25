# MERN Stack Project Deployment Guide

A step-by-step setup guide to run this full-stack application locally on Windows 11.

---

### 💻 My System Specifications

This project has been verified and optimized for the following local environment:

* **OS**: Windows 11
* **CPU**: Intel Core i5 (13th Gen)
* **RAM**: 16 GB

---

## 🚀 Getting Started

Follow these steps sequentially to set up and launch both the backend and frontend services.

### 1. Clone the Repository

Open your terminal (Command Prompt, PowerShell, or Git Bash) and run the following commands to pull the repository and navigate into the project directory:

```bash
git clone <YOUR_REPOSITORY_URL>
cd <REPOSITORY_FOLDER_NAME>

```

### 2. Install Dependencies

Install all required Node modules for the project:

```bash
npm install

```

---

## ⚙️ Environment Configuration

Before launching the servers, you must configure the environment variables for both the backend and the frontend using the provided template files (`.EXENV`).

### A. Backend Configuration (`base/backend/`)

1. Navigate to the `base/backend/` directory.
2. Locate the sample file named `.EXENV`. It contains the following template variables:
```env
APPLICATION_PORT=4000
MONGO_URI=
JWT_SECRET=SECRET123

```


3. Create a new file named `.env` in the `base/backend/` folder.
4. Copy the contents of `.EXENV` into your new `.env` file and supply your MongoDB Connection String.

#### 🌐 Guide to Get a MongoDB URL (MongoDB Atlas):

1. Sign in or create an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new **Shared Cluster** (Free tier).
3. Go to **Network Access** under the Security menu and click **Add IP Address**. Choose **Allow Access from Anywhere** (`0.0.0.0/0`) for development.
4. Go to **Database Access** and create a new database user with a username and password (remember these credentials).
5. Navigate to your **Database Deployment Dashboard**, click **Connect**, and select **Drivers**.
6. Copy the provided connection string. It will look similar to this:
```text
mongodb+srv://<username>:<password>@cluster0.yfkw4mn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

```


7. Replace `<username>` and `<password>` with your database user credentials and paste this string into your `MONGO_URI` field inside `base/backend/.env`.

---

### B. Frontend Configuration (`base/frontend/`)

1. Navigate to the `base/frontend/` directory.
2. Locate its `.EXENV` file, which looks like this:
```env
VITE_BACKEND_URL=http://localhost:4000
VITE_API_TIMEOUT=10000

```


3. Create a new file named `.env` in the `base/frontend/` folder.
4. Copy the contents of `.EXENV` into this newly created `.env` file. You can leave the defaults as they are for local execution.

---

## 🏃‍♂️ Running the Application

To run the application, you need to execute the development server for both the frontend and backend simultaneously. Open **two separate Command Prompt instances**:

### Terminal 1: Backend Server

Navigate to the `base/backend` folder and run the development command:

```cmd
cd base/backend
npm run dev

```

**Expected Terminal Output:**

```text
◇ injected env (3) from backend\.env // tip: ⌘ multiple files { path: ['.env.local', '.env'] }
application running on : http://localhost:4000
MongoDB Connected: ac-yeutfnx-shard-00-00.yfkw4mn.mongodb.net

```

### Terminal 2: Frontend Server

Navigate to the `base/frontend` folder and run the development command:

```cmd
cd base/frontend
npm run dev

```

**Expected Terminal Output:**

```text
  VITE v8.0.13  ready in 402 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help

```

---

## 🎯 Accessing the App

Once both terminals show successful startup outputs:

1. Open your web browser.
2. Navigate to: **[http://localhost:5173/](https://www.google.com/search?q=http://localhost:5173/)**

Your local development instance is now up and fully functional!


