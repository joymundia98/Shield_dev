# Shield ERP – Multi-Tenant Church & Organization Management System

## Overview

Shield ERP is a **multi-tenant ERP platform** designed primarily for churches and faith-based organizations, but extensible to other organizational types. The system supports **multiple organizations**, each with isolated data, users, permissions, and operational modules.

The platform is built with a **Node.js + Express backend**, **PostgreSQL database**, and a **modern frontend deployed on Vercel**. The backend is hosted on **AWS**, uses a **custom domain**, and integrates **Resend** for transactional email delivery.

---

## Key Features

* Multi-organization (multi-tenant) architecture
* Organization-based authentication (Org Login)
* User-based authentication (Staff/Admin Login)
* Role-Based Access Control (RBAC)
* Fine-grained permissions (path + HTTP method)
* Organization-scoped data access across all modules
* Full audit trail (create/update/delete tracking)
* Financial modules (budgets, payroll, donations, expenses)
* Church-specific modules (attendance, services, members)
* Asset & inventory management
* Reporting & export-ready architecture
* Email notifications via Resend

---

## System Architecture

### High-Level Architecture

```
Frontend (Vercel)
   |
   | HTTPS (Custom Domain)
   v
Backend API (AWS EC2 / ECS)
   |
   | PostgreSQL
   v
Database (AWS RDS or Managed Postgres)
```

### Hosting & Infrastructure

* **Backend**: AWS (EC2 / ECS / Load Balanced)
* **Database**: PostgreSQL (AWS RDS or equivalent)
* **Frontend**: Vercel
* **Domain**: Custom purchased domain
* **Email Service**: Resend (transactional emails)

---

## Multi-Tenancy Design (Organization-Based)

Shield ERP is **organization-first**.

### Core Rule

> Every business record belongs to **exactly one organization**.

This is enforced using an `organization_id` foreign key across most tables.

### Organizations Table

```
organizations
- id (PK)
- name
- organization_account_id (unique, login ID)
- org_type_id (FK → organization_type)
- password (bcrypt hashed)
- status
- created_at
```

An organization can have:

* Multiple churches
* Multiple users
* Independent ERP data

---

## Authentication & Authorization

### 1. Organization Login

Organizations authenticate using:

* `organization_account_id`
* `password`

Successful login returns a **JWT**:

```
{
  sub: organization_id,
  account_id: organization_account_id,
  org_type_id: number,
  type: "organization"
}
```

Used for:

* Org-level setup
* Initial configuration
* Admin bootstrapping

---

### 2. User Login (Staff/Admin)

Users authenticate using:

* `email`
* `password`

JWT payload:

```
{
  sub: user_id,
  email,
  organization_id,
  role
}
```

---

## JWT Verification

Two verification paths:

### User JWT Middleware

* Validates token
* Fetches user
* Loads role & permissions
* Injects into `req.user`

### Organization JWT Middleware

* Validates token
* Fetches organization
* Injects into `req.organization`

---

## Role-Based Access Control (RBAC)

### Tables Involved

* users
* roles
* permissions
* user_roles
* role_permissions

### Permissions Design

```
permissions
- id
- name (unique)
- path
- method
- description
```

**Constraint**:

* `(path, method)` must be unique

Permissions are matched against:

* HTTP method
* API route

---

## Organization-Scoped Data Access

All queries **must include `organization_id`**.

### Example (Model Layer)

```
SELECT * FROM services
WHERE organization_id = $1
```

### Example (Controller)

```
const { organization_id } = req.params;
Service.getAll(organization_id);
```

This guarantees:

* Data isolation
* No cross-organization leaks

---

## Audit Trail

Every critical mutation is logged.

### audit_trail Table

```
audit_trail
- audit_id
- user_id
- organization_id
- action (CREATE | UPDATE | DELETE)
- module
- record_id
- old_values (JSONB)
- new_values (JSONB)
- ip_address
- user_agent
- created_at
```

### Logged Actions

* Payroll changes
* Financial transactions
* Member updates
* Configuration changes

---

## Database Organization Strategy

### Tables WITH organization_id

These tables store organization-specific data:

* users
* churches
* programs
* payroll
* donations
* members
* attendance_records
* assets
* complaints
* audit_trail
* compliance_submissions
* digital_giving
* organization_leaders
* membership_certificates

### Tables WITHOUT organization_id

These are **global or reference tables**:

* denominations
* categories
* finance_categories
* core_values
* extra_fields
* maintenance_categories

These are shared across organizations.

---

## Migrations

Knex is used for schema migrations.

### Rule

* All new business tables MUST include `organization_id`
* Always reference `organizations(id)`

Example:

```
t.integer('organization_id')
  .references('id')
  .inTable('organizations')
  .onDelete('CASCADE')
  .index();
```

---

## Email Integration (Resend)

Resend is used for:

* Account notifications
* Password workflows
* System alerts

### Benefits

* Reliable delivery
* Domain-authenticated emails
* Easy API integration

---

## Deployment

### Backend (AWS)

* Environment variables via `.env`
* JWT secrets stored securely
* PostgreSQL connection via SSL

### Frontend (Vercel)

* Environment variables configured per environment
* API base URL points to AWS backend

### Domain

* Custom domain connected to frontend
* Backend secured via HTTPS

---

## Development Rules (Important)

1. Every model query MUST be organization-scoped
2. Never expose `password` fields in responses
3. Always log CREATE / UPDATE / DELETE in audit_trail
4. Permissions must be enforced at route level
5. No cross-org joins without explicit intent

---

## Future Enhancements

* Refresh token support
* Organization-level feature flags
* Advanced reporting (PDF / Excel exports)
* Event-driven notifications
* Webhooks
* Super-admin cross-org dashboard

---

## Team Notes

This README is the **source of truth** for:

* Architecture decisions
* Security model
* Multi-tenancy rules

All contributors must follow these guidelines to ensure system integrity and security.



GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO chile;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO chile;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO chile;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO chile;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO chile;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO chile;

-- Ensure future tables/sequences are also accessible
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO chile;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO chile;
GRANT ALL PRIVILEGES ON DATABASE shield_db TO chile;


psql -U chile -d shield_db

//migrate using knex migration tool
npx knex migrate:latest

or

npx knex migrate:latest --knexfile knexfile.cjs

//rollback command
npx knex migrate:rollback

or 

npx knex migrate:rollback --knexfile knexfile.cjs


//seeding data to tables

npx knex migrate:make seed_core_tables

//creating a new migration file

npx knex --knexfile knexfile.cjs migrate:make add_org_extra_fields

npx knex migrate:make add_org_extra_fields


npx knex --knexfile knexfile.cjs migrate:make update_programs_add_fk


//check status of the version of the migrations

npx knex --knexfile knexfile.cjs migrate:status


