### SkillBridge


##URLs :

Frontend Url - skill-bridge-sigma-wine.vercel.app
Backend Url - https://skillbridge-stmn.onrender.com

##Test accounts :

->Log in using these demo accounts or create a new one

Student → student@gmail.com / skillbridge
Trainer → trainer@gmail.com / skillbridge
Institution → institution@gmail.com / skillbridge
Programme Manager → manager@gmail.com / skillbridge
Monitoring Officer → officer@gmail.com / skillbridge

## run on localhost :

=> git clone https://github.com/Akshay1769/SkillBridge.git

=> Backend :
- cd backend
- npm install

=> .env
SUPABASE_URL=supabase_url
SUPABASE_KEY=supabase_key
CLERK_SECRET_KEY=clerk_secret_key

=> Run

npm run dev

=> Frontend
- cd frontend
- npm install

=> .env

REACT_APP_API_URL= http://localhost:5000

=> Run 
npm start



## Database Schema :

-Users table : stores role and links Clerk user ID
-Batches : represent groups of students within an institution
-Sessions belong to batches and are created by trainers
-Attendance tracks student presence per session
-Many-to-many relationships handled using:
      -batch_students
      -batch_trainers

      

## Tech Stack :

=> Frontend:

React (Create React App)
Clerk (authentication)

=> Backend:

Node.js + Express

=> Database:

Supabase (PostgreSQL)

=> Deployment:

Frontend → Vercel
Backend → Render

!! 

Clerk simplifies secure authentication(used before)
Supabase provides easy relational database setup(used before)
Express allows flexible API design(used in previous projects)


## Fully Working

Authentication with Clerk
Role-based dashboards
Batch creation and invite system
Session creation
Attendance marking
Attendance viewing
Programme-level summary

## Not implemented
Separate /batches/:id/invite endpoint (handled in batch creation)
/institutions/:id/summary endpoint


## Improvements

improve UI with bootstrap or Tailwind

show detailed analytics in the dashboard



