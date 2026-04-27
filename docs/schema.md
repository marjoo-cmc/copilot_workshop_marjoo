# Task Manager Technical Design

## 1. Data models

### Task
| Property | Type | Required | Validation rules |
|---|---|---|---|
| id | number | Yes | Integer, greater than or equal to 1, unique within store. |
| title | string | Yes | Trimmed, non-empty after trimming, recommended max length 200. |
| description | string | Yes | Defaults to empty string on create when omitted. |
| status | 'todo' \| 'in-progress' \| 'done' | Yes | Must be one of allowed status values. Defaults to 'todo' on create. |
| priority | 'low' \| 'medium' \| 'high' | Yes | Must be one of allowed priority values. Defaults to 'medium' on create. |
| createdAt | string | Yes | Must be a valid ISO 8601 datetime string. Set at create time only. |
| updatedAt | string | Yes | Must be a valid ISO 8601 datetime string. Set at create time and refreshed on update. |

### InMemoryStore
| Property | Type | Required | Validation rules |
|---|---|---|---|
| tasks | Task[] | Yes | Array of valid Task objects. |
| nextId | number | Yes | Integer, greater than or equal to 1; increments by 1 after each create. |

### FilterOptions
| Property | Type | Required | Validation rules |
|---|---|---|---|
| status | 'todo' \| 'in-progress' \| 'done' | No | If provided, must be one of allowed status values. |
| priority | 'low' \| 'medium' \| 'high' | No | If provided, must be one of allowed priority values. |

### SortOptions
| Property | Type | Required | Validation rules |
|---|---|---|---|
| by | 'priority' \| 'createdAt' | Yes | Must be one of allowed sort fields. |
| order | 'asc' \| 'desc' | Yes | Must be one of allowed sort directions. |

## 2. File structure

```text
src/
  index.js                    # CLI entrypoint, argument parsing, and command dispatch
  constants.js                # Allowed status/priority values and priority rank map
  models/
    task.js                   # Task factory and task-level validation functions
  store/
    memory-store.js           # In-memory state container and id allocation
  services/
    task-service.js           # CRUD, filtering, and sorting orchestration
  cli/
    commands.js               # Command handlers that map CLI input to service calls
    output.js                 # Console rendering for tasks, errors, and empty states
  utils/
    date.js                   # ISO timestamp helper(s)
    validate.js               # Shared input and option validation helpers
```

## 3. Module responsibilities

- src/constants.js
  - Exports: STATUS_VALUES, PRIORITY_VALUES, PRIORITY_RANK.
  - Dependencies: none.

- src/utils/date.js
  - Exports: getCurrentIsoTimestamp().
  - Dependencies: none.

- src/utils/validate.js
  - Exports: assertNonEmptyTitle(), assertStatus(), assertPriority(), assertFilterOptions(), assertSortOptions().
  - Dependencies: src/constants.js.

- src/models/task.js
  - Exports: createTask(input, id, nowIso), validateTaskShape(task).
  - Dependencies: src/constants.js, src/utils/validate.js.

- src/store/memory-store.js
  - Exports: createMemoryStore(), getAllTasks(store), getTaskById(store, id), insertTask(store, task), updateTaskById(store, id, patch), removeTaskById(store, id), allocateNextId(store).
  - Dependencies: none.

- src/services/task-service.js
  - Exports: createTaskService(store) with methods createTask, listTasks, updateTask, deleteTask.
  - Dependencies: src/models/task.js, src/store/memory-store.js, src/utils/date.js, src/utils/validate.js, src/constants.js.

- src/cli/output.js
  - Exports: printTaskTable(tasks), printSuccess(message), printError(message), printHelp().
  - Dependencies: none.

- src/cli/commands.js
  - Exports: runCommand(argv, taskService).
  - Dependencies: src/services/task-service.js (via passed instance), src/cli/output.js, src/utils/validate.js.

- src/index.js
  - Exports: none (application entrypoint).
  - Dependencies: src/store/memory-store.js, src/services/task-service.js, src/cli/commands.js.

## 4. Error handling strategy

- ValidationError (Error)
  - Thrown by: src/utils/validate.js and src/models/task.js.
  - Used for: invalid title, status, priority, filter options, sort options, malformed task shape.

- NotFoundError (Error)
  - Thrown by: src/services/task-service.js when update/delete target id does not exist.
  - Used for: create clear not-found messages for delete and update operations.

- CommandError (Error)
  - Thrown by: src/cli/commands.js for unsupported commands or invalid CLI argument combinations.
  - Used for: user-facing CLI usage guidance.

- Unexpected runtime errors
  - Handling location: src/index.js top-level try/catch around command execution.
  - Behavior: log with console.error and exit with non-zero status.
