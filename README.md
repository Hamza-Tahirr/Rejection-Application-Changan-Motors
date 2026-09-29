# Quality Rejection Management

A Next.js web app for creating and tracking quality rejection documents in a manufacturing plant. It works on custom business objects in SAP S/4HANA Public Cloud through OData v2 and offers a single dashboard as an alternative to a Fiori front end. This is a portfolio project based on SAP integration work.

## Features

- Dashboard that loads rejection documents (with their line items) from SAP, plus summary cards for drafts, pending, approved and rejected documents and the total rejected quantity
- Free-text search and filters by rejection no., exception no., model, batch, department, type and status
- Create, edit, display, copy and delete documents; delete is blocked for approved or in-approval documents and for documents that already have a claim
- Line items picked from the parts of the selected model and batch, with rejected quantity capped at the available quantity, category and reason codes, claimable flag and claim/robbing references
- Header and item validation before saving or submitting (required fields, duplicate parts, reason must match category)
- Submit for approval: active levels are read from a workflow configuration service and the document is assigned to the first level approver
- Dark and light theme, a cookie consent banner, and privacy and terms pages
- SAP credentials stay on the server; Next.js API routes proxy every call and handle Basic auth, CSRF tokens and session cookies

## Tech Stack

- Next.js 14 (App Router), React 18
- Tailwind CSS, Framer Motion, Lucide icons
- Next.js API routes as an OData v2 proxy
- SAP S/4HANA Public Cloud custom business objects

## How It Works

The browser only calls the local `/api/*` routes. Those routes use `src/lib/sap-client.js` to send requests to the SAP tenant configured in the environment.

| Route | SAP call |
|-------|----------|
| `GET /api/rejections` | Read all documents with `$expand=to_YY1_REJ_ITM` |
| `POST /api/rejections` | Create a document header |
| `GET`, `PATCH`, `DELETE /api/rejections/[uuid]` | Read, update or delete one document |
| `POST /api/rejection-items` | Replace all items of a document |
| `POST /api/submit` | Set the status to pending approval and assign the first approver |
| `GET /api/workflow` | Read the active approval levels for document type `02` |

Models, batches, parts, locators, departments and reason codes are sample master data kept in `src/lib/constants.js`. The current user is also a constant there (`CURRENT_USER`).

## Project Structure

```
src/
├── app/
│   ├── api/              # OData proxy routes
│   ├── privacy/          # Privacy policy page
│   ├── terms/            # Terms of service page
│   ├── globals.css       # Theme variables and component styles
│   ├── layout.js         # Root layout
│   └── page.js           # Dashboard
├── components/           # Navbar, table, filter bar, dialogs, toast, theme, cookie consent
└── lib/
    ├── constants.js      # Sample master data and reason codes
    ├── sap-client.js     # OData HTTP client (auth, CSRF, cookies)
    ├── utils.js          # SAP field mapping, date helpers, payload builders
    └── validation.js     # Document validation
```

## Getting Started

You need Node.js 18.17 or newer and access to an S/4HANA Public Cloud tenant that exposes the two custom business object services configured below. Without them the dashboard still opens but shows an error when it tries to load data.

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` from the example and fill in your tenant details:
   ```bash
   cp .env.example .env.local
   ```

   | Variable | Description |
   |----------|-------------|
   | `SAP_BASE_URL` | Tenant URL, e.g. `https://your-tenant.s4hana.cloud.sap` |
   | `SAP_USERNAME` | Communication user |
   | `SAP_PASSWORD` | Communication user password |
   | `SAP_REJECTION_SERVICE` | Path of the rejection document service |
   | `SAP_WORKFLOW_SERVICE` | Path of the workflow configuration service |

3. Start the dev server and open http://localhost:3000:
   ```bash
   npm run dev
   ```

For a production build run `npm run build` and then `npm start`.

## License

MIT, see [LICENSE](LICENSE).
