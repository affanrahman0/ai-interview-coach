# Phase 1: Authentication & Database Setup (Current Phase)

Set up secure JWT-based user authentication, database connectivity, and the foundational routing/views on both the frontend and backend.

## Goal Description

This phase creates the foundational security and data layers for the entire AI Interview Coach platform:
1. **Database Connection**: Establishes connection to PostgreSQL using SQLAlchemy ORM, auto-generating the database tables on startup.
2. **User Authentication**: Implements robust password hashing (using bcrypt) and JWT-based session tokens on the backend.
3. **Frontend Routing & State**: Binds the React application with `react-router-dom`, context-based global session state, and redirects unauthenticated users to `/login`.
4. **Rich Aesthetics**: Provides a sleek, modern, glassmorphic dark mode design for the Login and Register pages.

---

## User Review Required

> [!IMPORTANT]
> The `.env` file has already been populated with the local PostgreSQL URL and a strong, randomly generated `SECRET_KEY`. No action is needed for environment configuration.

---

## Open Questions

None at this time. We will proceed with implementing a high-premium, modern dark mode glassmorphism user interface for the Authentication screens, ensuring visual excellence from day one.

---

## Proposed Changes

### Backend Components

#### [MODIFY] [settings.py](file:///c:/Users/rahma/AI-Interview-Coach/AI-Interview-Coach/backend/app/config/settings.py)
* Uncomment core configuration properties (`SECRET_KEY`, `ALGORITHM`, `DATABASE_URL`) to load them dynamically via Pydantic Settings.

#### [MODIFY] [session.py](file:///c:/Users/rahma/AI-Interview-Coach/AI-Interview-Coach/backend/app/database/session.py)
* Uncomment SQLAlchemy `create_engine`, `sessionmaker` session factory, and declarative `Base`.
* Provide the `get_db` generator function used for dependency injection.

#### [MODIFY] [user.py](file:///c:/Users/rahma/AI-Interview-Coach/AI-Interview-Coach/backend/app/models/user.py)
* Uncomment the SQLAlchemy model mapping for the `users` table, which includes fields for ID, full name, email, hashed password, and creation timestamp.

#### [MODIFY] [user_schema.py](file:///c:/Users/rahma/AI-Interview-Coach/AI-Interview-Coach/backend/app/schemas/user_schema.py)
* Uncomment Pydantic validation schemas: `UserCreate` (signup validation), `UserLogin` (login validation), `UserOut` (secure user response without password), and `Token` (JWT bearer response payload).

#### [MODIFY] [hashing.py](file:///c:/Users/rahma/AI-Interview-Coach/AI-Interview-Coach/backend/app/auth/hashing.py)
* Uncomment password hashing utilities utilizing passlib with bcrypt context.

#### [MODIFY] [jwt_handler.py](file:///c:/Users/rahma/AI-Interview-Coach/AI-Interview-Coach/backend/app/auth/jwt_handler.py)
* Uncomment JWT creation (`create_access_token`) and verification (`decode_access_token`) logic.

#### [MODIFY] [dependencies.py](file:///c:/Users/rahma/AI-Interview-Coach/AI-Interview-Coach/backend/app/auth/dependencies.py)
* Uncomment the `get_current_user` route dependency, which extracts and decodes the JWT bearer token to authenticate incoming requests.

#### [MODIFY] [user_repository.py](file:///c:/Users/rahma/AI-Interview-Coach/AI-Interview-Coach/backend/app/repositories/user_repository.py)
* Uncomment User query operations (`get_user_by_email`, `get_user_by_id`, `create_user`).

#### [MODIFY] [auth.py](file:///c:/Users/rahma/AI-Interview-Coach/AI-Interview-Coach/backend/app/api/auth.py)
* Uncomment registration and login endpoints. 
* Refactor the database operations inside `register` and `login` routes to use the `user_repository` function calls to maintain layered separation of concerns.

#### [MODIFY] [main.py](file:///c:/Users/rahma/AI-Interview-Coach/AI-Interview-Coach/backend/main.py)
* Uncomment FastAPI CORS Middleware (enabling React dev server to communicate with backend).
* Uncomment the DB auto-table-creation hook on app startup.
* Register the Authentication router at `/api/auth`.

---

### Frontend Components

#### [MODIFY] [api.js](file:///c:/Users/rahma/AI-Interview-Coach/AI-Interview-Coach/frontend/src/services/api.js)
* Uncomment the global Axios client configuration. It will automatically attach any stored JWT token to the `Authorization` header of outgoing HTTP requests.

#### [MODIFY] [authService.js](file:///c:/Users/rahma/AI-Interview-Coach/AI-Interview-Coach/frontend/src/services/authService.js)
* Uncomment API helpers (`registerUser`, `loginUser`, `logoutUser`).

#### [MODIFY] [AuthContext.jsx](file:///c:/Users/rahma/AI-Interview-Coach/AI-Interview-Coach/frontend/src/context/AuthContext.jsx)
* Uncomment global React Context for Auth state tracking (`user`, `loading`, `login`, `logout` handlers).

#### [MODIFY] [useAuth.js](file:///c:/Users/rahma/AI-Interview-Coach/AI-Interview-Coach/frontend/src/hooks/useAuth.js)
* Uncomment hook to retrieve session state in visual components.

#### [MODIFY] [ProtectedRoute.jsx](file:///c:/Users/rahma/AI-Interview-Coach/AI-Interview-Coach/frontend/src/components/ProtectedRoute.jsx)
* Uncomment route guard to intercept and redirect unauthenticated routes.

#### [MODIFY] [Navbar.jsx](file:///c:/Users/rahma/AI-Interview-Coach/AI-Interview-Coach/frontend/src/components/Navbar.jsx)
* Uncomment global Navigation bar component with conditional login/logout rendering.

#### [MODIFY] [MainLayout.jsx](file:///c:/Users/rahma/AI-Interview-Coach/AI-Interview-Coach/frontend/src/layouts/MainLayout.jsx)
* Uncomment the primary layout shell for logged-in pages.

#### [MODIFY] [Login.jsx](file:///c:/Users/rahma/AI-Interview-Coach/AI-Interview-Coach/frontend/src/pages/Login.jsx)
* Uncomment and upgrade the login layout with premium aesthetics. 
* Feature: Sleek background gradient, glassmorphic card interface, glowing shadows, floating labels, input focus micro-animations, and validation indicators.

#### [MODIFY] [Register.jsx](file:///c:/Users/rahma/AI-Interview-Coach/AI-Interview-Coach/frontend/src/pages/Register.jsx)
* Uncomment and upgrade the signup screen layout with premium styling matching the login screen.

#### [MODIFY] [AppRoutes.jsx](file:///c:/Users/rahma/AI-Interview-Coach/AI-Interview-Coach/frontend/src/routes/AppRoutes.jsx)
* Uncomment React routes for `/login`, `/register`, `/`, `/resume`, etc.
* Temporary mitigation: Redirect `/` dashboard queries or provide temporary mock dashboard responses so that accessing the root route during Phase 1 does not crash before the dashboard API is implemented in Phase 5.

#### [MODIFY] [App.jsx](file:///c:/Users/rahma/AI-Interview-Coach/AI-Interview-Coach/frontend/src/App.jsx)
* Swap placeholder UI to render the routing and state providers.

---

## Verification Plan

### Automated Tests
* Run `pytest` if any exist, or verify imports directly.

### Manual Verification
1. **Database Migration check**: Start the backend and verify in Postgres (via pgAdmin or SQL Shell) that the `users` table is created.
2. **API Interaction via Swagger**: Navigate to `http://localhost:8000/docs`. Register a test user and login. Verify a valid JWT is returned.
3. **Frontend E2E Flow**: Run `npm run dev` on Vite. Visit `http://localhost:5173`. Attempt to access the dashboard (should redirect to `/login`). Register a user, login, and verify redirection to the root page.
