# Project Plan: Task Manager CLI

## 1. Project overview
Task Manager CLI is a small Node.js 20+ command-line application for managing personal tasks in a single terminal session. Users can create, list, update, and delete tasks, then organize work by status and priority with filtering and sorting options. Data is stored in memory only, which keeps the implementation simple and ideal for a workshop exercise focused on clean structure, validation, and command handling without external dependencies.

## 2. User stories
1. As a user, I want to create a task so I can track work I need to do.
   - Acceptance criteria: User can run a create command with required title.
   - Acceptance criteria: New task includes title, description, status, priority, createdAt, and updatedAt.
   - Acceptance criteria: Default values are applied when optional fields are omitted.

2. As a user, I want to list all tasks so I can see my current workload.
   - Acceptance criteria: User can run a list command to display all tasks.
   - Acceptance criteria: Output includes all task fields in a readable table-like format.

3. As a user, I want to update a task so task details stay accurate.
   - Acceptance criteria: User can update title, description, status, and priority by task id.
   - Acceptance criteria: updatedAt changes whenever any task field is modified.
   - Acceptance criteria: Invalid status or priority values are rejected with clear errors.

4. As a user, I want to delete a task so I can remove tasks I no longer need.
   - Acceptance criteria: User can delete by task id.
   - Acceptance criteria: Deleting a non-existent id returns a clear not-found message.

5. As a user, I want to filter tasks by status or priority so I can focus on relevant tasks.
   - Acceptance criteria: User can filter by status only.
   - Acceptance criteria: User can filter by priority only.
   - Acceptance criteria: User can combine status and priority filters.

6. As a user, I want to sort tasks by priority or creation date so I can review tasks in meaningful order.
   - Acceptance criteria: User can sort by priority using a defined rank (high, medium, low).
   - Acceptance criteria: User can sort by creation date ascending or descending.
   - Acceptance criteria: Sorting can be applied to both full lists and filtered results.

## 3. Data model
- Task
  - id: number
  - title: string
  - description: string
  - status: 'todo' | 'in-progress' | 'done'
  - priority: 'low' | 'medium' | 'high'
  - createdAt: string (ISO 8601 datetime)
  - updatedAt: string (ISO 8601 datetime)

- InMemoryStore
  - tasks: Task[]
  - nextId: number

- FilterOptions
  - status?: 'todo' | 'in-progress' | 'done'
  - priority?: 'low' | 'medium' | 'high'

- SortOptions
  - by: 'priority' | 'createdAt'
  - order: 'asc' | 'desc'

## 4. File structure
```text
src/
  index.js              # CLI entrypoint and argument parsing
  constants.js          # Allowed status/priority values and priority ranking
  models/
    task.js             # Task factory and validation helpers
  store/
    memory-store.js     # In-memory task storage and id generation
  services/
    task-service.js     # CRUD, filtering, and sorting logic
  cli/
    commands.js         # Command handlers (create/list/update/delete)
    output.js           # Console formatting for task lists and messages
  utils/
    date.js             # Timestamp helper(s)
    validate.js         # Shared input validation helpers
```

## 5. Implementation phases
1. Phase 1: Project scaffold and constants
   - Create file structure and module boundaries.
   - Define status/priority enums and priority ranking.
   - Add lightweight CLI usage/help output.

2. Phase 2: Data model and in-memory store
   - Implement Task shape validation and task factory.
   - Implement in-memory store with add/get/update/delete by id.
   - Implement deterministic id generation and timestamp updates.

3. Phase 3: Core CRUD commands
   - Implement create command with defaults and validation.
   - Implement list command for all tasks.
   - Implement update and delete commands with not-found handling.

4. Phase 4: Filtering and sorting
   - Add list filtering by status and priority.
   - Add sorting by priority and createdAt.
   - Ensure filters and sorting can be combined.

5. Phase 5: Output polish and verification
   - Improve output readability for success, error, and empty states.
   - Add simple Node.js assert-based checks for service functions.
   - Validate expected behavior manually via CLI examples.
