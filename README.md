# 🩸 BloodLink: Community Blood Donor Registry and Emergency Request System

![License: MIT](https://img.shields.io/badge/License-MIT-red.svg)
![Node 18+](https://img.shields.io/badge/Node.js-18+-green.svg)
![React 18](https://img.shields.io/badge/React-18-blue.svg)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange.svg)

## 📖 Abstract
BloodLink is a full-stack web application designed to bridge the gap between blood donors and patients in critical need. By leveraging real-time geolocation (city/state level) and a robust blood compatibility matching engine, the platform ensures that requests are fulfilled rapidly. 

The system prioritizes privacy by revealing donor contact information *only* after the donor explicitly accepts a request via a secure, time-limited email token. The project aligns with **SDG-3 (Good Health & Well-being)** and **SDG-11 (Sustainable Cities and Communities)**.

## 👥 Team Members
*   **Thanushree H K** (4JD25CS232)
*   **Vinuta Mahanatappa Ankanal** (4JD25CS258)
*   **Yashaswini V** (4JD25CS252)
*   **Guide:** Usha K, Asst. Professor (Jain Institute of Technology, Davanagere)

## 🚀 Tech Stack
*   **Frontend:** React 18 (Vite), Bootstrap 5, Axios, React Router
*   **Backend:** Node.js, Express.js
*   **Database & Auth:** Firebase Cloud Firestore, JWT (JSON Web Tokens)
*   **Email:** Nodemailer (Mocked via console for development)

## ✨ Key Features
| Role | Features |
| :--- | :--- |
| **Donor** | Register, update profile, toggle availability, view donation history. |
| **Patient** | Create emergency requests, track request status, view donor contact upon acceptance. |
| **Hospital** | Manage blood inventory (8 blood groups), view dashboard. |
| **Admin** | View global stats, verify registered hospitals, manage users. |

## 🛡️ Core Rules (Business Logic)
1.  **Privacy First:** Donor contact info is hidden from patients until the donor clicks "Accept" via email.
2.  **Compatibility:** Strict adherence to the 8-group blood compatibility map (e.g., O- can donate to all).
3.  **Eligibility:** Donors are blocked from matching if they have donated within the last 90 days.
4.  **Statewide Fallback:** The engine searches the patient's city first. If no donors are found, it automatically expands the search to the entire state of Karnataka.

---

## ⚙️ Installation & Setup

### 1. Prerequisites
*   Node.js (v18+)
*   Firebase Project (Firestore enabled)

### 2. Backend Setup
```bash
cd backend
npm install