# BPxS Mini CRM - Manual Testing Report

## Test environment

- Date: 15 August 2026
- Operating system: Windows 11
- Browser: Opera
- Frontend: HTML, CSS and JavaScript
- Backend: Node.js and Express
- Database: PostgreSQL

## Test summary

- Main test cases: 10
- Passed: 10
- Failed: 0
- Additional persistence test: Passed
- Bugs found: 2
- Bugs fixed: 2
- Retests passed: 2

## Test cases

| ID | Test case | Expected result | Status |
|---|---|---|---|
| TC-001 | Load clients after restarting the application | Previously saved clients are displayed with correct data | PASS |
| TC-002 | Add a client with valid data | Client is saved and displayed at the top of the list | PASS |
| TC-003 | Submit an empty form | Browser blocks submission and highlights the required field | PASS |
| TC-004 | Submit an invalid email address | Browser blocks submission and displays email validation | PASS |
| TC-005 | Edit an existing client | Updated data is saved and displayed on the client card | PASS |
| TC-006 | Cancel client editing | Changes are discarded and the form returns to add mode | PASS |
| TC-007A | Cancel client deletion | Client remains in the database and on the list | PASS |
| TC-007B | Confirm client deletion | Client is removed from the database and the list | PASS |
| TC-008 | Load the frontend while the backend is unavailable | Application remains usable and displays an error message | PASS |
| TC-009 | Add a client while the backend is unavailable | Client is not added and an error message is displayed | PASS |

## Additional test

### Data persistence

The backend was stopped and started again. Previously saved clients were still available after reconnecting to PostgreSQL.

**Result: PASS**

## Bugs found

### BUG-001: Stale operation message

**Description:**  
A success or cancellation message remained visible when the user started another operation.

**Fix:**  
The application now clears the previous message when the user changes any form field or starts another operation.

**Retest result: PASS**

### BUG-002: Technical connection error

**Description:**  
When the backend was unavailable, the application displayed the technical message `Failed to fetch`.

**Fix:**  
The message was replaced with a clear Polish message: `Nie udało się połączyć z backendem.`

**Retest result: PASS**

## Final result

All core CRUD operations work correctly:

- Create client
- Read clients
- Update client
- Delete client

Form validation, error handling, confirmation dialogs and PostgreSQL data persistence were also verified successfully.