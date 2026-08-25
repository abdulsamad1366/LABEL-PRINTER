# 🏷️ LabelStudio — A4 Adhesive Label Designer & Print Engine / ERP

[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**LabelStudio** is a browser-based, CAD-precision **A4 Adhesive Label Designer, Batch Mail-Merge Engine, and Industrial ERP System**. Built for manufacturers, warehouses, hardware distributors, and retail businesses to design, calibrate, and mass-print barcode product labels on standard adhesive sheet formats (e.g., A4 24-up, 14-up, 12-up) with millimeter-exact accuracy.

---

## 🌟 Key Features

### 🎨 1. Precision Label Canvas Designer
- **Drag-and-Drop Editor**: Real-time interactive canvas with millimeter ($mm$) rulers (`ruler-x`, `ruler-y`) and safety printable margin indicators.
- **Rich Elements Support**:
  - 🔤 **Dynamic Text**: Customizable fonts (*Inter*, *JetBrains Mono*, *Arial*), font sizes, weights, colors, and alignments.
  - 📊 **Barcodes**: Built-in 1D Barcode generator supporting `CODE128`, `CODE39`, and `EAN13` with human-readable text toggles.
  - 📱 **QR Codes**: Native vector QR Code generator for URL, product link, or batch tracking metadata.
  - 🖼️ **Logos & Images**: Import company logos, certification badges, or product images with aspect-ratio locking.
- **Dynamic Field Tags**: Insert variable placeholders like `{{sku}}`, `{{price}}`, `{{gst}}`, `{{batch}}` that automatically populate during mail merge.

### 📊 2. Batch Mail-Merge & CSV Integration
- **Mass Processing**: Upload CSV / Excel files containing thousands of product rows.
- **Automatic Data Binding**: Automatically map dataset columns into label design elements.
- **Selective Printing**: Filter and selectively toggle specific records before generating the print batch.

### 📄 3. Standard A4 Preset Layouts & Custom Specs
- **Pre-configured Presets**:
  - `A4 - 24 Labels` ($70 \times 37\text{mm}$ • $3 \times 8$ grid)
  - `A4 - 14 Labels` ($105 \times 42\text{mm}$ • $2 \times 7$ grid)
  - `A4 - 12 Labels` ($105 \times 48\text{mm}$ • $2 \times 6$ grid)
  - `A4 - 6 Labels` ($105 \times 99\text{mm}$ • $2 \times 3$ grid)
  - `Shipping Labels 2x4` ($100 \times 50\text{mm}$)
- **Template Spec Administrator**: Create custom die-cut sheet specifications with custom top/left sheet margins, horizontal/vertical gaps, and label corner radiuses.

### 🎯 4. Printer Offset Calibration
- **Zero-Misalignment Printing**: Fine-tune Top Offset ($\pm\text{mm}$) and Left Offset ($\pm\text{mm}$) to calibrate for mechanical paper feed variations across laser, inkjet, or thermal printers.

### 👁️ 5. Dual View Modes
- **Single Label Canvas Mode**: High-zoom CAD editing environment for micro-adjustments.
- **Full A4 Sheet Preview Mode**: Live 1:1 scale rendering of how all 24 labels look on physical paper, complete with grid overlay toggles and multi-page navigation.

### 🏭 6. Industrial ERP Dashboard & Inventory Control
- **Inventory Stock Management**: Track SKU stock levels, minimum reorder alerts, bin locations, and unit pricing.
- **Print Job Telemetry & Audit Logs**: Track total labels printed, batch timestamps, operator profiles, and export logs.
- **Role-based User Access**: Permissions for *Production Managers*, *Label Designers*, and *Operators*.

### ⚡ 7. Supabase Cloud Sync & Real-Time Persistence
- **Cloud Persistence**: Seamless persistence for user profiles, templates, projects, inventory items, and print logs via Supabase PostgreSQL with Row Level Security (RLS).
- **Offline Local Storage Fallback**: Automatic fallback to `localStorage` when offline or unauthenticated.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Core** | React 18, TypeScript, Vite |
| **Styling & Design System** | Tailwind CSS, Google Stitch AI Design Tokens, Inter & JetBrains Mono Fonts |
| **Icons** | Lucide React, Google Material Symbols Outlined |
| **Barcode & QR Engines** | `jsbarcode`, `qrcode` |
| **PDF & Canvas Export** | `jspdf`, `html2canvas`, Custom Print DOM Portal |
| **Backend & Database** | Supabase (PostgreSQL, Auth, RLS Policies, Real-Time Subscriptions) |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or higher)
- `npm` or `pnpm`

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/abdulsamad1366/LABEL-PRINTER.git
   cd LABEL-PRINTER
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Supabase URL and Anon Key (Optional for cloud features):
   ```env
   VITE_SUPABASE_URL=https://your-supabase-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 🗄️ Database Setup (Supabase SQL Schema)

If connecting to Supabase, run the provided migration file [`supabase_schema.sql`](file:///Users/apple/Documents/CODING-STUFF/PROJECT/label%20printer/supabase_schema.sql) in your Supabase SQL Editor to create:
- `public.profiles`
- `public.projects`
- `public.inventory`
- `public.print_logs`

---

## 📜 Available NPM Scripts

- `npm run dev` — Starts local Vite development server with HMR.
- `npm run build` — Runs TypeScript type-checking (`tsc`) and builds production bundle in `dist/`.
- `npm run preview` — Locally previews the built production application.

---

## 🖨️ Printing Best Practices

For best physical alignment when printing to A4 adhesive sheet stock:
1. Set browser Print Dialog scale to **100% (Actual Size / Do Not Scale)**.
2. Set Paper Size to **A4 ($210 \times 297\text{mm}$)**.
3. Set Margins to **None / Minimum**.
4. Use **Printer Calibration** in LabelStudio to adjust for hardware feeder drift.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

Designed & Built with ❤️ for High-Precision Label Manufacturing.
