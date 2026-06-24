<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

- [x] Create project structure and scaffolding
- [x] Set up authentication and RBAC system
- [x] Create chat interface with MediBot
- [x] Set up API routes and data models
- [x] Install dependencies and compile

## Project Information

This is a Next.js chat interface demonstrating:
- Role-Based Access Control (RBAC) with multiple user roles
- Demo accounts: doctor, nurse, billing_executive, technician, admin
- MediBot responses with source citations (document name, section title)
- User role and accessible collections badge
- Retrieval type labels (Hybrid RAG or SQL RAG)

## Getting Started

1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Open http://localhost:3000
4. Login with demo accounts:
   - dr.mehta / doctor
   - nurse.priya / nurse
   - billing.ravi / billing_executive
   - tech.anand / technician
   - admin.sys / admin

## Key Features

- Authentication system with role-based access
- Chat interface with real-time messaging
- Source citation display with document metadata
- Role badge showing current user and accessible collections
- Retrieval type indicator (Hybrid RAG or SQL RAG)
- Dynamic access control based on user role
