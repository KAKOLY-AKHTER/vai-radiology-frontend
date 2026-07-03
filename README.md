# VAI Radiology — Frontend

A modern, professional web application for medical task management and image annotation, built with React and TypeScript.

## Tech Stack

- **React 19** with **TypeScript**
- **React Router DOM** — client-side routing
- **@hello-pangea/dnd** — drag and drop
- **Axios** — API communication
- **React DatePicker** — date selection

## Features

### Task Board (`/tasks`)
- Kanban board with **To Do**, **In Progress**, and **Done** columns
- Filter tasks by date using a shared `<DateSelector/>` component
- Add, edit, and delete tasks via modal
- Drag and drop tasks between columns
- Each task has: title, priority, due date, and tags
- Stats overview (total, done, pending)

### Image Annotation (`/annotate`)
- Upload images to the backend
- Browse and switch between multiple uploaded images
- Draw polygons on images by clicking points
- Undo last point while drawing
- Save polygon annotations to the database
- Delete specific annotations
- Color-coded polygons for each annotation

### Authentication
- Token-based login with email and password
- Protected routes — redirects to login if not authenticated

## Project Structure

```
src/
├── api/
│   └── axios.ts          # Axios instance with auth token interceptor
├── context/
│   └── AuthContext.tsx   # Global auth state with login/logout
├── components/
│   ├── Board.tsx         # Drag-and-drop board wrapper
│   ├── Column.tsx        # Individual Kanban column
│   ├── TaskCard.tsx      # Single task card (draggable)
│   ├── TaskModal.tsx     # Add/edit task modal
│   └── DateSelector.tsx  # Reusable shared date picker
└── pages/
    ├── LoginPage.tsx     # Login screen
    ├── TasksPage.tsx     # Kanban task board
    └── AnnotatePage.tsx  # Image annotation tool
```

## Getting Started

### Prerequisites
- Node.js v18+
- npm

### Installation

```bash
# Clone the repository
git clone <your-frontend-repo-url>
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The app runs at `http://localhost:3000`

### Environment

Make sure the Django backend is running before starting the frontend. The API base URL is configured in `src/api/axios.ts`. For production, update the `baseURL` to your deployed backend URL on PythonAnywhere.

## Demo Credentials

```
Email:    demo@vai.com
Password: demo1234
```

## Challenges & Solutions

**Challenge:** `react-beautiful-dnd` does not support React 19.
**Solution:** Migrated to `@hello-pangea/dnd`, a maintained fork with full React 19 support.

**Challenge:** Drawing polygons on a canvas overlaying a responsive image required accurate coordinate scaling.
**Solution:** Calculated scale factors from the image's natural dimensions vs rendered dimensions and applied them on every click and redraw.

**Challenge:** Keeping the canvas in sync with the image after load.
**Solution:** Used `onLoad` on the image element to trigger `drawCanvas` which resets canvas dimensions and redraws all annotations.

## Node & npm Version

```bash
node --version   # v18+
npm --version    # v9+
```
