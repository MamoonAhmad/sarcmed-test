# Rules Management System

A React-based application for managing and organizing rules with a modern, intuitive interface. Built with TypeScript, Redux, and Tailwind CSS.

## Project Structure

```
├── src/
│   ├── components/         # Reusable UI components
│   │   └── ui/            # Base UI components (buttons, inputs, etc.)
│   │       └── index.tsx  # Main rules page component
│   ├── pages/             # Page components
│   │   └── rules/         # Rules management page and its components
│   │       ├── components/
│   │       │   ├── RuleEditRow.tsx      # Individual rule editing row
│   │       │   ├── RulesetEditMode.tsx  # Ruleset editing interface
│   │       │   ├── RulesetViewMode.tsx  # Ruleset viewing interface
│   │       │   └── SortableRuleRow.tsx  # Draggable rule row component
│   │       └── index.tsx  # Main rules page component
│   ├── store/             # Redux store configuration
│   │   └── rulesSlice.ts  # Rules state management
│   ├── types/             # TypeScript type definitions
│   ├── data/              # Mock data and constants
│   ├── lib/               # Utility functions and helpers
│   └── assets/            # Static assets
├── public/                # Public static files
└── [config files]         # Various configuration files
```

## Key Features

- **Ruleset Management**: Create, edit, and delete rulesets
- **Rule Organization**: Add, modify, and reorder rules within rulesets
- **Drag and Drop**: Intuitive rule reordering with drag-and-drop functionality
- **Validation**: Built-in validation for rule fields
- **Responsive Design**: Modern UI with Tailwind CSS

## Component Architecture

### Rules Page (`src/pages/rules/index.tsx`)
The main entry point for the rules management interface. Handles:
- Ruleset selection and creation
- Switching between view and edit modes
- State management through Redux

### Ruleset View Mode (`RulesetViewMode.tsx`)
Displays rulesets in a read-only format with features for:
- Ruleset selection
- Viewing rules in a table format
- Options to edit or copy rulesets

### Ruleset Edit Mode (`RulesetEditMode.tsx`)
Provides a full editing interface with:
- Ruleset name editing
- Rule addition and deletion
- Drag-and-drop rule reordering
- Save/cancel/delete functionality

### Rule Edit Row (`RuleEditRow.tsx`)
Handles individual rule editing with:
- Field validation
- Comparator selection
- Value and unit input
- Save/delete actions

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Technologies Used

- React 18
- TypeScript
- Redux Toolkit
- Tailwind CSS
- DND Kit (for drag-and-drop)
- Vite (build tool)

## Development Guidelines

1. **Component Structure**
   - Keep components focused and single-responsibility
   - Use TypeScript interfaces for props
   - Implement proper error handling and validation

2. **State Management**
   - Use Redux for global state
   - Keep component state local when possible
   - Follow Redux best practices for actions and reducers

3. **Styling**
   - Use Tailwind CSS for styling
   - Follow the existing design system
   - Maintain responsive design principles

4. **Code Quality**
   - Write unit tests for components
   - Follow TypeScript best practices
   - Maintain consistent code formatting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Your License Here]
