# Contact Management System

Cohort 9 — JAVA Fullstack (JAVA + ReactJS) assignment for Mirab Jamshad

A full-stack web application for managing personal contacts, built with Spring Boot (backend) and React (frontend).

## Features

- **User Authentication**: Register and login using email or phone number, with JWT-based session management
- **Change Password**: Update account password securely
- **Contact Management**: Create, view, update, and delete contacts
- **Multiple Emails/Phones**: Each contact can have multiple labeled email addresses and phone numbers (work, personal, etc.)
- **Search & Filter**: Search contacts by first or last name
- **Pagination**: Contacts list is paginated for performance
- **Profile Page**: View account details and manage password

## Tech Stack

**Backend:**
- Java 21, Spring Boot
- Spring Data JPA / Hibernate
- Spring Security with JWT
- SQL Server
- JUnit & Mockito (unit testing)
- Slf4j (logging)

**Frontend:**
- React (Vite)
- React Router
- Axios

## Project Structure
├── backend/
│ └── contact-management-backend/ # Spring Boot API
├── frontend/
│ └── contact-management-frontend/ # React app
└── database/

## Getting Started

### Backend

1. Navigate to `backend/contact-management-backend`
2. Configure your SQL Server connection in `src/main/resources/application.properties`
3. Run the application:
mvn spring-boot:run
   The API will start on `http://localhost:8080`

### Frontend

1. Navigate to `frontend/contact-management-frontend`
2. Install dependencies:
npm install
3. Start the development server:
npm run dev
   The app will be available at `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/change-password` | Change password |
| GET | `/api/contacts` | Get paginated contacts |
| GET | `/api/contacts/{id}` | Get contact by ID |
| POST | `/api/contacts` | Create a contact |
| PUT | `/api/contacts/{id}` | Update a contact |
| DELETE | `/api/contacts/{id}` | Delete a contact |
| GET | `/api/contacts/search?keyword=` | Search contacts |

## Testing

Unit tests are located in `src/test/java` and can be run with:
mvn test
## Code Quality

This project is integrated with [SonarQube Cloud](https://sonarcloud.io) for continuous code quality analysis, covering both the Spring Boot backend and React frontend. Reliability, maintainability, and security issues are tracked and addressed as part of the development workflow.
