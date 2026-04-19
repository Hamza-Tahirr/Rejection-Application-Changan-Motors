# Rejection Management System - Changan Motors

A modern Next.js application for managing quality rejection documents, integrated with SAP S/4HANA Public Cloud OData services.

## Features

- **Dashboard** with animated statistics cards and real-time data
- **CRUD Operations** - Create, Read, Edit, Copy, Delete rejection documents
- **Multi-level Approval Workflow** - Submit for approval with configurable workflow levels
- **Advanced Filtering** - Search and filter by rejection no, model, batch, department, status, etc.
- **Line Items Management** - Add/remove rejection items with part selection, quantities, categories, reasons
- **Full Validation** - Header and item-level validation with error feedback
- **Glass Morphism UI** - Dark theme with stunning animations powered by Framer Motion
- **SAP OData Integration** - Backend API routes proxying to SAP S/4HANA Public Cloud

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes (SAP OData proxy)
- **SAP Integration**: OData v2 services (YY1_REJECTION_DOC_CDS, YY1_ZPXP_WF_CONFIG_CDS)
- **Icons**: Lucide React

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/Hamza-Tahirr/Rejection-Application-Changan-Motors.git
   cd Rejection-Application-Changan-Motors
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your SAP credentials
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## SAP OData Services

| Service | Path |
|---------|------|
| Rejection Documents | `/sap/opu/odata/sap/YY1_REJECTION_DOC_CDS` |
| Workflow Configuration | `/sap/opu/odata/sap/YY1_ZPXP_WF_CONFIG_CDS` |

## Project Structure

```
src/
├── app/
│   ├── api/              # SAP OData proxy API routes
│   ├── globals.css       # Global styles + animations
│   ├── layout.js         # Root layout
│   └── page.js           # Main dashboard page
├── components/           # React components
│   ├── ConfirmDialog.jsx
│   ├── FilterBar.jsx
│   ├── Navbar.jsx
│   ├── PageLoader.jsx
│   ├── RejectionDialog.jsx
│   ├── RejectionTable.jsx
│   ├── StatsCards.jsx
│   ├── StatusBadge.jsx
│   └── Toast.jsx
└── lib/                  # Business logic
    ├── constants.js      # LOV data, reason codes, DPL batches
    ├── sap-client.js     # SAP OData HTTP client
    ├── utils.js          # Mapping, formatting, payload builders
    └── validation.js     # Form validation
```
