# AI Application Rules and Guidelines

This document outlines the technical stack and best practices for developing this AI-powered e-book generator application.

## Tech Stack Overview

*   **Frontend Framework**: React with TypeScript for building dynamic user interfaces.
*   **Styling**: Tailwind CSS for utility-first styling, ensuring a consistent and responsive design across all components.
*   **Build Tool**: Vite for a fast development experience and optimized production builds.
*   **AI Integration**: Google Gemini API, accessed via the `@google/genai` library, is used for generating e-book content.
*   **PDF Generation**: The `jspdf` library (loaded via CDN) handles client-side PDF document creation and download.
*   **State Management**: React's built-in `useState` hook is used for managing component-level state.
*   **Icons**: Custom SVG icons are defined and used from `components/Icons.tsx`.
*   **Data Types**: TypeScript enums and interfaces, defined in `types.ts`, provide strong typing throughout the application.
*   **Backend (Simulated)**: Supabase (currently simulated in `supabaseService.ts`) is the intended platform for backend services, such as saving e-books.

## Library Usage Guidelines

To maintain consistency and efficiency, please adhere to the following library usage rules:

*   **UI Components & Styling**:
    *   **React**: All user interface components should be built using React functional components and hooks.
    *   **Tailwind CSS**: Use Tailwind CSS classes exclusively for all styling. Avoid inline styles or custom CSS files unless absolutely necessary for specific overrides not achievable with Tailwind.
    *   **Custom Components**: Leverage existing custom components in `src/components/` (e.g., `InputField`, `SelectField`, `ActionButton`, `Card`) and create new, small, focused components as needed. Do not introduce new UI libraries like `shadcn/ui` or `Radix UI` unless explicitly approved, as the current components are custom-built.
*   **AI Content Generation**:
    *   **Google Gemini API**: Interact with the Gemini API using the `@google/genai` package for all AI content generation tasks.
*   **PDF Handling**:
    *   **jsPDF**: Use the `jspdf` library (already included via CDN) for all PDF generation and download functionalities.
*   **State Management**:
    *   **React Hooks**: Utilize `useState` and other React hooks for managing component state. For more complex global state, consider `useContext` if necessary, but prioritize simplicity.
*   **Icons**:
    *   **Custom SVG Icons**: Continue to use the custom SVG icons defined in `components/Icons.tsx`. Do not introduce new icon libraries.
*   **Backend Interaction**:
    *   **Supabase**: For any future backend interactions (e.g., database operations, authentication), integrate with Supabase as per the `supabaseService.ts` file's intended purpose.