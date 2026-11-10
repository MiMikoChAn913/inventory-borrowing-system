# Part B - Feature Inventory

| Feature | Description | Requirements | Dependencies | Sprint |
|---|---|---|---|---|
| F-01 Authentication | Login, current user and logout with stored opaque sessions. | FR-01, NFR-01 | Seeded users | 1 |
| F-02 Inventory catalogue | List active items and their availability. | FR-02, NFR-02 | F-01 | 1 |
| F-03 Borrow request | Borrower submits and views a request. | FR-03, FR-04, BR-01, BR-05 | F-01, F-02 | 1 |
| F-04 Request review | Custodian approves/rejects pending requests and stock updates atomically. | FR-05, BR-02, BR-03, BR-04, BR-07 | F-03 | 1 |
| F-05 Return | Borrower returns their own approved item and stock is restored. | FR-06, BR-05, BR-06 | F-04 | 1 |
| F-06 Inventory administration | Custodian creates an item. | FR-07, BR-01, BR-04 | F-01 | 1 |
| F-07 Due dates and overdue view | Track intended and actual return dates. | Future requirement | F-05 | 2 |
| F-08 Custodian return confirmation | Separate borrower return request from custodian confirmation. | Future requirement | F-05 | 2 |
| F-09 Search and reporting | Search catalogue and export utilization summaries. | Future requirement | F-02 | 3 |
| F-10 Audit hardening | Immutable event history and operational hardening. | Future requirement | All core features | 3 |
