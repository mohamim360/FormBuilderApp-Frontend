
# 📋 FormBuilder - Web Application

A full-featured customizable forms web app built with **React**, **TypeScript**, **Bootstrap**, and **Node.js + PostgreSQL (Prisma)**. Inspired by Google Forms, this app allows users to create, share, and analyze quizzes, tests, surveys.

![Home Page](images/q.jpeg)

![Home Page](images/q1.jpeg)

![Home Page](images/q2.jpeg)
---
## Live Demo
[Backend live link](https://formbuilderapp-backend-6.onrender.com)  
[Frontend live link](https://form-builder-app-frontend-eta.vercel.app/)

## GitHub Repositories
- Frontend: [https://github.com/mohamim360/FormBuilderApp-Frontend](https://github.com/mohamim360/FormBuilderApp-Frontend)
- Backend: [https://github.com/mohamim360/FormBuilderApp-Backend](https://github.com/mohamim360/FormBuilderApp-Backend)

---

## 📌 Features

### ✅ Core Functionality

* 🔐 User Registration and Authentication
* 🎨 Create customizable templates with:

  * Title, description
  * Optional image upload (cloud storage)
  * Tags 
  * Topic category (from DB)
  * Access control (public/private)
  * 📝 Add up to 4 questions per type:
  * Single-line text
  * Multi-line text
  * Positive integers
  * Checkboxes
* 🔄 Drag & drop to reorder questions
* 📥 Users can fill out forms based on templates
* 👍 Likes
* 💬 comments
* 🌍 Full-text search across templates (PostgreSQL)
* 📱  Design with Bootstrap

### 🛠 Admin Panel

* Manage all users: delete, promote/demote admin
* Edit any template

### 💡 User Dashboard

* Manage templates (create/edit/delete)
* Filled forms list

### 📚 Template View

* Tabs:

  * Settings (title, description, image, tags)
  * Questions
  * Responses list
  * Aggregated analysis
  * Comments 
  * Fillable by other users (if access allowed)
  * View other users’ responses (if owner or admin)

---
Here’s a structured `## Screenshots` section for your `README.md`, describing each UI page with bullet points and placeholder image tags (replace with actual image links or relative paths):

---

## 📸 Screenshots

### 🔐 **Login Page**
![Login Page](images/lo.PNG)

---

### 📝 **Register Page**

![Register Page](images/re1.PNG)

---

### 👤 **Profile Page**

![Profile Page](images/user.PNG)

---

### 🏠 **Home Page**

![Home Page](images/q2.jpeg)

---

### 📄 **Template Page**

![Template Page](images/t11.jpeg)

---

### 🧾 **Form Fill Page**

![Form Page](images/fo1.jpeg)

---

### 🔍 **Search Results Page**

![Search Page](images/se1.jpeg)

---

## 🧰 Tech Stack

### Frontend

* React 19 + TypeScript
* Vite
* React Bootstrap
* Bootstrap 5
* React Hook Form
* React Router
* @hello-pangea/dnd (drag & drop)

---

### Setup the **Frontend**

```bash
cd ../frontend
npm install
npm run dev              # Start frontend on http://localhost:5173
```

---

## 🔧 Build Commands

### Frontend

```bash
npm run build    # Builds Vite + TypeScript frontend
```
### 🛠 Environment Variables

The following are the necessary ENV variables. `.env`:

```env
VITE_BACKEND_URL=https://formbuilderapp-backend-6.onrender.com
```

---

