# 📅 Slot Booking & Offer Management System

A high-performance, robust, and beautifully designed **Slot Booking & Offer Management System** built for businesses to publish promotional offers and for customers to seamlessly book time slots. This project was developed as a complete solution featuring a decoupled **ASP.NET Core Web API Backend** and a modern **React + Vite + Tailwind CSS Frontend**.

---

## 🚀 Key Features

### 🏢 For Businesses & Admins
- **Business Profile Management**: Register and manage opening/closing hours, business types, and contact details.
- **Dynamic Offer Publishing**: Create time-sensitive promotional offers with original vs. discount prices, descriptions, and terms.
- **Intelligent Slot Management**: Generate customizable booking slots (`StartTime`, `EndTime`, `Capacity`) per offer.
- **Live Booking Tracker**: Monitor customer bookings in real-time, view special notes, and track slot utilization.
- **Data Export**: Export booking records to CSV for offline administration and analytical reporting.

### 👤 For Customers
- **Public Showcase**: Discover hot deals and search/filter by category, city, or business name.
- **Real-Time Slot Selector**: View real-time slot capacities, countdown timers, and choose preferred timeframes.
- **Instant Reference Generator**: Get a secure, auto-generated unique booking reference code upon booking.
- **Intuitive User Interfaces**: Fast-loading layouts, dynamic state changes, and responsive design for mobile, tablet, and desktop viewports.

---

## 🛠️ Tech Stack & Architecture

### **Backend**
*   **Framework:** `.NET 8.0 Web API` (C#)
*   **ORM:** `Entity Framework Core 8`
*   **Database:** `SQLite` (Default for seamless local setup, easily configurable to SQL Server)
*   **Security:** `BCrypt.Net` for secure password hashing & `JWT Bearer Authentication`
*   **API Documentation:** `Swagger (Swashbuckle)`

### **Frontend**
*   **Core:** `React 19` (TypeScript)
*   **Build Tool:** `Vite` (for ultra-fast Hot Module Replacement)
*   **Styling:** `Tailwind CSS v4` & custom micro-animations
*   **Routing:** `React Router Dom`
*   **Icons:** `Lucide React`
*   **HTTP Client:** `Axios`

---

## 🗄️ Database Architecture

Below is the structured schema mapped inside our database context:

| Table | Primary Key | Key Columns / Relations |
| :--- | :--- | :--- |
| **`Users`** | `Id (int)` | `Name`, `Email`, `PasswordHash`, `Role` (Admin/BusinessOwner/Customer), `CreatedAt` |
| **`Businesses`** | `Id (int)` | `Name`, `BusinessType`, `Phone`, `Email`, `Address`, `City`, `OpeningTime`, `ClosingTime` |
| **`Offers`** | `Id (int)` | `BusinessId` *(FK)*, `Title`, `DiscountPercentage`, `OfferPrice`, `StartDate`, `EndDate`, `Status` |
| **`OfferSlots`** | `Id (int)` | `OfferId` *(FK)*, `SlotDate`, `StartTime`, `EndTime`, `Capacity`, `BookedCount`, `Status` |
| **`Bookings`** | `Id (int)` | `BookingReference`, `OfferId` *(FK)*, `SlotId` *(FK)*, `CustomerName`, `PeopleCount`, `Status` |

---

## 💻 Local Setup & Installation

### **Prerequisites**
Make sure you have the following installed on your machine:
*   [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
*   [Node.js (v18 or higher)](https://nodejs.org/) & `npm`

---

### **1. Backend API Setup**

1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Restore NuGet dependencies:
   ```bash
   dotnet restore
   ```
3. Run the database migrations (Note: An initial SQLite DB is pre-seeded with mock businesses, active offers, and sample users for testing):
   ```bash
   dotnet ef database update
   ```
4. Start the backend server:
   ```bash
   dotnet run
   ```
5. **Verify Backend**:
   - The API will start running locally at: `http://localhost:5171`
   - Access the interactive API docs (Swagger UI) at: **[http://localhost:5171/swagger/index.html](http://localhost:5171/swagger/index.html)**

---

### **2. Frontend Setup**

1. Navigate to the frontend directory:
   ```bash
   cd ../Frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the Vite local development server:
   ```bash
   npm run dev
   ```
4. **Verify Frontend**:
   - The application will launch at: **[http://localhost:3000/](http://localhost:3000/)** (or `http://localhost:5173/` depending on local port occupancy).

---

## 🔑 Demo Access Credentials (Mock Seeding)

To test the application immediately, use the following seeded account credentials:

*   **Role:** `Admin / Business Owner`
    *   **Email:** `admin@slotbooking.com`
    *   **Password:** `Admin@123`
*   **Role:** `Customer`
    *   **Email:** `customer@slotbooking.com`
    *   **Password:** `Customer@123`

---

## 📂 Project Structure

```text
├── Backend/
│   ├── Controllers/          # API Endpoint Controllers (Auth, Bookings, Offers, etc.)
│   ├── Data/                 # DBContext and Database Mock Seeders
│   ├── DTOs/                 # Data Transfer Objects for API requests/responses
│   ├── Models/               # C# EF Core Models
│   ├── Program.cs            # App configuration, middleware pipeline & service registration
│   └── SlotBooking.db        # SQLite Local Database File
│
├── Frontend/
│   ├── src/
│   │   ├── components/       # Reusable components (Sidebar, filters, etc.)
│   │   ├── context/          # Global Authentication Provider
│   │   ├── hooks/            # Custom React hooks (Countdown timers, CSV exporting)
│   │   ├── pages/            # Admin Layout, booking screens, and public landing catalog
│   │   └── services/         # Axios API connection endpoints
│   ├── package.json          # Node configuration & scripts
│   └── vite.config.ts        # Vite custom server settings
└── README.md                 # Root instructions document
```

---

## 🏆 Hackathon Evaluator Checklist

- [x] **Decoupled Architecture**: Front-end state decoupled from database operations.
- [x] **Secure Authorization**: JWT and BCrypt secured middleware.
- [x] **Validation**: Strong model binding and entity relationship schemas.
- [x] **UX Aesthetics**: Responsive interface using custom premium Tailwind themes and interactive layouts.
- [x] **Export Ready**: Ability to export key booking stats to CSV.
