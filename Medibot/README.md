# MediBot - RBAC Chat Interface

A Next.js chat interface demonstrating comprehensive Role-Based Access Control (RBAC) enforcement with MediBot, a medical information retrieval system.

## Features

### 🔐 Role-Based Access Control (RBAC)
The system implements strict role-based access to medical information with the following roles:

- **Doctor**: Access to medical records, diagnoses, treatment plans, and lab results
- **Nurse**: Access to patient care, medications, vital signs, and care plans
- **Billing Executive**: Access to billing records, insurance, invoices, and payment history
- **Technician**: Access to equipment, maintenance, service records, and specifications
- **Admin**: Full access to all information across all departments

### 💬 MediBot Chat Interface
- Real-time chat with MediBot
- Role-based response filtering
- Interactive conversation history
- User-friendly interface with role badges

### 📚 Source Citations
Every MediBot response includes:
- **Document Name**: The source document
- **Section Title**: The specific section within the document
- **Content Preview**: A snippet of the cited content
- **Retrieval Type**: Indicates whether Hybrid RAG or SQL RAG was used

### 🏷️ Retrieval Type Labels
- **Hybrid RAG**: Combines semantic search with keyword matching
- **SQL RAG**: SQL-based retrieval from structured data
- Each response randomly selects a retrieval type for demonstration

### 👤 User Dashboard
- User role and name badge in sidebar
- List of accessible collections based on role
- Logout functionality
- System information display

## Demo Accounts

Test the system with these credentials:

| Role | Username | Password |
|------|----------|----------|
| Doctor | `dr.mehta` | `doctor` |
| Nurse | `nurse.priya` | `nurse` |
| Billing Executive | `billing.ravi` | `billing_executive` |
| Technician | `tech.anand` | `technician` |
| Admin | `admin.sys` | `admin` |

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository or navigate to the project directory

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

5. Login with one of the demo accounts

## Project Structure

```
medibot-chat/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── globals.css             # Global styles
│   ├── page.tsx                # Login page
│   └── chat/
│       └── page.tsx            # Chat interface page
├── components/
│   ├── ChatArea.tsx            # Main chat display area
│   ├── ChatInput.tsx           # Message input component
│   ├── MessageBubble.tsx       # Individual message display
│   └── Sidebar.tsx             # User info and collections sidebar
├── lib/
│   ├── auth.ts                 # Authentication utilities
│   ├── medibot.ts              # MediBot response generation
│   └── types.ts                # TypeScript type definitions
├── package.json                # Project dependencies
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── next.config.js              # Next.js configuration
└── .eslintrc.json              # ESLint configuration
```

## How It Works

### Authentication Flow
1. User enters credentials on the login page
2. Credentials are validated against demo accounts
3. User data is stored in localStorage
4. User is redirected to the chat page
5. Chat page verifies authentication; if not logged in, redirects to login

### RBAC Implementation
1. Each document section has role restrictions
2. When a user sends a message, MediBot retrieves documents accessible to their role
3. Response is generated based on available documents
4. Citations only include documents the user has access to

### Message Retrieval and Response
1. User sends a query
2. System searches documents matching user's role and query keywords
3. Matching documents are returned as citations
4. MediBot generates a role-specific response
5. Retrieval type (Hybrid RAG or SQL RAG) is randomly assigned
6. Full message with citations and retrieval type is displayed

### Collections
Collections are pre-configured based on user roles and represent datasets the user can access. They appear in the sidebar for quick reference.

## Built With

- **Next.js 14**: React framework for production
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **React 18**: UI library

## Features Demonstrated

✅ User authentication with role-based credentials
✅ Role-based access control to medical information
✅ Chat interface with real-time messaging
✅ Source citations for every response
✅ Document and section-level access control
✅ User role badges and collection display
✅ Retrieval type indication (Hybrid RAG vs SQL RAG)
✅ Responsive design with Tailwind CSS
✅ LocalStorage-based session management

## Development

### Build for Production
```bash
npm run build
npm start
```

### Run Linting
```bash
npm run lint
```

## Future Enhancements

- Integration with actual medical databases
- Real NLP processing for better query understanding
- WebSocket support for real-time multi-user chat
- Advanced authentication (OAuth, JWT)
- Audit logging for HIPAA compliance
- Vector database integration for semantic search
- Multi-language support

## License

MIT License - Feel free to use this project for educational and commercial purposes.

## Support

For issues or questions, please refer to the system information in the MediBot sidebar or contact your administrator.
