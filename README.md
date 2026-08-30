# Contact Management System

Cohort 9 — JAVA Fullstack (JAVA + ReactJS) assignment for Mirab Jamshad

A full-stack web application for managing personal contacts, built with Spring Boot (backend) and React (frontend). Users can register, log in, and manage a paginated, searchable list of contacts through a modal-based interface.

## Features

### Authentication
- Register using email or phone number
- Login with email/phone + password
- JWT-based session management
- Change password from the profile screen

### Contact Management
- Create, view, update, and delete contacts via modals
- Each contact supports first name, last name, title, email (labeled), and phone number (labeled)
- Search/filter contacts by first or last name
- Paginated contact list with Previous/Next navigation
- Delete confirmation modal to prevent accidental deletion

### User Experience
- Colored avatar initials for each contact
- Toast notifications for create/update/delete actions
- Loading skeletons while data fetches
- Empty state with a call-to-action when no contacts exist
- User profile screen with account details and logout

### Engineering
- Global exception handling with meaningful error responses
- Application logging with Slf4j
- Unit tests (JUnit + Mockito) covering controllers
- Continuous code quality analysis via SonarQube Cloud (Quality Gate: Passed)
- CodeRabbit automated PR reviews

## Tech Stack

**Backend:**
- Java 21, Spring Boot 4
- Spring Data JPA / Hibernate
- Spring Security with JWT
- SQL Server
- JUnit & Mockito
- Slf4j (Logback)

**Frontend:**
- React (Vite)
- React Router
- Axios
- Custom modal components (no external UI library)

## Project Structure
├── backend/
│ └── contact-management-backend/
│ ├── src/main/java/.../controller/ # REST controllers
│ ├── src/main/java/.../service/ # JWT, security services
│ ├── src/main/java/.../Repository/ # Spring Data JPA repositories
│ ├── src/main/java/.../entity/ # User, Contact, ContactEmail, ContactPhone
│ ├── src/main/java/.../dto/ # Request/response DTOs
│ ├── src/main/java/.../exception/ # Global exception handling
│ └── src/test/java/ # Unit tests
├── frontend/
│ └── contact-management-frontend/
│ ├── src/pages/ # Login, Register, Contacts, Profile
│ ├── src/components/ # Modals, Toast, ErrorBoundary
│ ├── src/context/ # Auth context
│ └── src/services/ # API layer (Axios)
└── database/

## Getting Started

### Backend

1. Navigate to `backend/contact-management-backend`
2. Configure your SQL Server connection in `src/main/resources/application.properties`
3. Run the application:
mvn spring-boot:run
   The API starts on `http://localhost:8080`

### Frontend

1. Navigate to `frontend/contact-management-frontend`
2. Install dependencies:
npm install
3. Start the development server:
npm run dev
   The app runs on `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in |
| POST | `/api/auth/change-password` | Change password |
| GET | `/api/contacts` | Get paginated contacts |
| GET | `/api/contacts/{id}` | Get a contact by ID |
| POST | `/api/contacts` | Create a contact |
| PUT | `/api/contacts/{id}` | Update a contact |
| DELETE | `/api/contacts/{id}` | Delete a contact |
| GET | `/api/contacts/search?keyword=` | Search contacts by name |

## Application Screens

- **Login / Register** — authenticate or self-register, then redirect to the contacts dashboard
- **Contacts Dashboard** — paginated list, search bar, avatars, and modal-driven create/edit/delete
- **Profile** — view account details, change password via modal, log out

## Testing

Unit tests live in `src/test/java` and run with:
mvn test

## Code Quality

This project is integrated with [SonarQube Cloud](https://sonarcloud.io) for continuous code quality analysis across both the backend and frontend, with the Quality Gate currently passing. Pull requests are also reviewed automatically by CodeRabbit.