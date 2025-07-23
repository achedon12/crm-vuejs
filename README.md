# crm-vuejs


## Before you start

Make sure you have an env file

```dotenv
    PORT=3000
    MONGO_URI=mongodb://root:root@localhost:27017
    JWT_SECRET=secret
    MAILER_DSN=smtp://localhost:1030
    EMAIL_USER=no-reply@crm.com
    APP_URL=http://localhost:5173
```

## Installation

### Backend
```bash
  cd backend && docker compose up # to start the database and the mailer
```

```bash
  cd backend && npm run seed # to seed the database with some data
```

```bash
  cd backend && npm install && npm run dev # to start the backend server
```

### Frontend

```bash
  cd frontend && npm install && npm run dev # to start the frontend server
```

> Urls : 
> - Backend: http://localhost:3000
> - Frontend: http://localhost:5173
> - Mailer: http://localhost:1030

When project is running and you seed the database, you can access the application at [http://localhost:5173](http://localhost:5173).

> Super admin connection:
> - Email: admin
> - Password: admin
>
> Admin connection:
> - Email: (look at the database a user with role admin)
> - Password: password
> 
> user connection:
> - Email: (look at the database a user with role user)
> - Password: password

## Screenshots

### realm admin dashboard
![Dashboard](assets/dashboard.png)

### admin dashboard
![Dashboard](assets/adminDashboard.png)

## Features
- Authentication (JWT)
- Authorization (Roles)
- CRUD operations
- Email notifications
- Responsive design
- Multi-language support (French, English)
- Dark mode
- Search functionality
- Pagination
- File upload
- User management
- Dashboard with statistics
- Notifications
- Settings page
- Profile management
- Password reset
- Localization (i18n)
- Error handling
- Logging
- super admin grab

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Vue.js
- tailwindcss
- daisyUI
- docker

# Students :

- [Mathys Farineau](https://github.com/IPandragonI)
- [Léo Deroin](https://github.com/achedon12)
