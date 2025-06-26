 
# Angular 19 ToDo App ✅  
🚀 Live Demo: [abubakkar-todo-app.netlify.app](https://abubakkar-todo-app.netlify.app/)  

This is a **standalone Angular 19** To-Do application with a **Node.js/TypeScript backend** and **PostgreSQL database**. Users can enter and manage their tasks efficiently with full authentication. The app is designed to work **offline**, includes **Angular Service Workers**, and also features a **Weather API** and a fun **Hangman game**. The UI is fully **responsive** for a smooth experience across devices.  

---

## 📂 Project Structure

The project is organized into three main components:

- **`/frontend`** - Angular 19 frontend application
- **`/backend`** - Node.js/TypeScript REST API with JWT authentication
- **`/database`** - PostgreSQL database configuration and Docker setup

---

## 📌 Features  
✅ Add, mark as completed, and delete tasks  
✅ Works offline using **Angular Service Workers**  
✅ Fetches real-time **Weather API** data  
✅ Includes a **Hangman Game** for fun  
✅ Fully **Responsive UI** for all screen sizes  

## 🏷️ Tags
![Angular](https://img.shields.io/badge/Angular-19-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![ToDo App](https://img.shields.io/badge/ToDo%20App-Task%20Manager-brightgreen?style=for-the-badge)
![JWT Auth](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
![Offline Support](https://img.shields.io/badge/Offline-Support-blue?style=for-the-badge)
![Weather API](https://img.shields.io/badge/Weather%20API-Integrated-yellow?style=for-the-badge)
![Responsive UI](https://img.shields.io/badge/Responsive-UI-ff69b4?style=for-the-badge)
![Standalone Components](https://img.shields.io/badge/Standalone-Components-9cf?style=for-the-badge)

---

## 🛠 Development

### Frontend Development

To start the Angular frontend development server:

```bash
cd frontend
ng serve
```

Once running, open your browser and navigate to `http://localhost:4200/`. The application will **auto-reload** whenever you modify any source files.

### Backend Development

To start the Node.js backend server:

```bash
cd backend
npm install
npm start
```

The backend API will be available at `http://localhost:3002/`.

### Running with Docker

To run the complete application stack (database and backend):

```bash
docker-compose up -d
```

This will start the PostgreSQL database and the backend API.

---

## 🚀 Building  

### Frontend Build

To build the frontend project:

```bash
cd frontend
ng build
```

This will compile the frontend and store the build artifacts in the `frontend/dist/` directory.

### Backend Build

To build the backend:

```bash
cd backend
npm run build
```

This will compile the TypeScript code to JavaScript in the `backend/dist/` directory.

---

## 🧪 Running Tests  

### Unit Tests  
Execute unit tests using the [Karma](https://karma-runner.github.io) test runner:  
```bash
ng test
```

### End-to-End (E2E) Tests  
For E2E testing, run:  
```bash
ng e2e
```
Angular CLI does not include an E2E testing framework by default, so you can choose one that suits your project.

---

## 📚 Additional Resources  
For more information on Angular CLI, visit the official [Angular CLI Documentation](https://angular.dev/tools/cli).
 
optimize above project description for search results and also add tags
