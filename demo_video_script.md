# 📹 Hackathon Demo Video Script & Walkthrough Plan

Since the automated headless browser environment encountered a protocol crash due to system limitations, you can record a pristine, professional screen recording directly from your own computer. 

Below is a **step-by-step demo video script** designed to showcase all features flawlessly in **under 3 minutes** for the hackathon judges!

---

## 🎬 Recording Checklist & Setup
1. **Tool Recommendations**: Use **Loom**, **OBS Studio**, or the built-in Windows screen recorder (**Win + Alt + R**).
2. **Setup Tabs**: Have two tabs open in your browser:
   *   Tab 1: `http://localhost:3000` (Frontend landing page)
   *   Tab 2: `http://localhost:5171/swagger` (Backend API)
3. **Seeded Credentials** (Keep them handy to copy-paste):
   *   **Customer**: `customer@slotbooking.com` / `Customer@123`
   *   **Admin**: `admin@slotbooking.com` / `Admin@123`

---

## 🎙️ Video Script & Scene Flow (2.5 Minutes Total)

### **Scene 1: Introduction & Landing Catalog (0:00 - 0:30)**
*   **What to Show on Screen**: Navigate to `http://localhost:3000`. Scroll down to show the glowing active offer cards. Filter by a category (e.g., click "Dining") and see the filter apply instantly.
*   **What to Say (Script)**:
    > *"Hello judges! Welcome to our Slot Booking and Offer Management System—a highly responsive, modern application designed for businesses to publish time-sensitive deals and for customers to seamlessly book time slots. As you can see, our landing page features a premium, responsive catalog where users can filter active offers by category, city, or establishment type, all powered by real-time database queries."*

---

### **Scene 2: Customer Booking Flow (0:30 - 1:15)**
*   **What to Show on Screen**:
    1. Click **Login** in the top right.
    2. Enter `customer@slotbooking.com` / `Customer@123`.
    3. Click on one of the active offers (e.g., "50% Off Dining").
    4. Show the slots available on the card.
    5. Choose a slot, enter "2 people" and "Please sit near the window" in the special note, then click **Confirm Booking**.
    6. **Crucial Visual**: Show the generated unique booking reference (e.g., `BK-A9C3F2`).
*   **What to Say (Script)**:
    > *"Let’s log in as a customer using our pre-seeded credentials. Once authenticated, we can select an offer to view its real-time slot dates, capacities, and active time windows. When we select a slot and click 'Confirm Booking', our backend validates the remaining slot capacity in a secure transaction and generates an instant, unique booking reference code to secure the reservation."*

---

### **Scene 3: Admin & Business Owner Dashboard (1:15 - 2:00)**
*   **What to Show on Screen**:
    1. Log out as the customer.
    2. Log in as `admin@slotbooking.com` / `Admin@123`.
    3. Navigate to **Bookings** or **Admin Dashboard**.
    4. Highlight the booking you just created under the customer's name!
    5. Click the **Export to CSV** button and show the CSV file download.
    6. (Optional) Go to **Slot Management** to show how easy it is for an owner to add new capacity or create bulk time frames.
*   **What to Say (Script)**:
    > *"Now let's switch roles and log in as the System Admin. Here in the Administrative dashboard, we have a complete overview of active offers, slot availability, and guest lists. The booking we just created is instantly visible here. We can change the booking status or export our entire dataset to a clean CSV report in a single click for offline analytics."*

---

### **Scene 4: Backend Swagger API Docs (2:00 - 2:30)**
*   **What to Show on Screen**: Switch to Tab 2 (`http://localhost:5171/swagger`). Expand the `/api/Bookings` or `/api/Offers` tags to show clean REST endpoints.
*   **What to Say (Script)**:
    > *"Under the hood, our application is powered by a robust .NET 8 Web API mapped with Entity Framework Core and an SQLite database. It features secure JWT Bearer authorization, BCrypt password hashing, and clean RESTful endpoints documented interactively with Swagger. Thank you for viewing our submission, and we look forward to your feedback!"*

---

## 💡 Quick Tips for a High Score
*   **Keep it moving**: Don't linger on pages. Click cleanly and explain as you click.
*   **Voice Quality**: Speak clearly with enthusiasm.
*   **Highlight the UI**: Mention the smooth dark-mode integrations and responsive UI (glassmorphism/Tailwind) since judges highly value premium visuals!
