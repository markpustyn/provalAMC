# Blue Grid Valuations Platform Overview

## Overview

Blue Grid Valuations is a property condition reporting and valuation management platform designed to streamline the inspection workflow between clients, administrators, and field vendors. The platform allows lenders, asset managers, and valuation companies to manage Property Condition Reports (PCRs) from order creation to final report delivery.

The application includes three main dashboards:

* Admin Dashboard
* Client Dashboard
* Vendor Dashboard

Each dashboard is designed around a specific workflow and permission level.

---

# System Workflow

```text
Client Creates Order
        ↓
Admin Reviews and Assigns Vendor
        ↓
Vendor Completes PCR Inspection Form
        ↓
Admin Performs Quality Control Review
        ↓
Final Report Delivered to Client
```

---

# Authentication System

The platform contains secure role based authentication for:

* Administrators
* Clients
* Vendors

Each user type is redirected to its own dashboard after login.

## Login Screens

### Admin/Client/Vendor Login

<img width="2553" height="1258" alt="login" src="https://github.com/user-attachments/assets/2d52d351-8020-4d1d-9b73-43f06c450154" />


The administrator login allows internal staff to manage orders, review reports, assign vendors, and monitor workflow progress.

---

# Admin Dashboard

<img width="2553" height="1258" alt="adminDashboard" src="https://github.com/user-attachments/assets/a6a61099-92c4-43d3-9317-0ca8f7aa9bd8" />


## Purpose

The Admin Dashboard serves as the operational control center for Blue Grid Valuations.

## Features

* View all active orders
* Assign vendors to inspections
* Track inspection progress
* Monitor completed reports
* Manage users and permissions
* Review QC status
* Track turnaround times

## Use Case

Internal operations teams use this dashboard to coordinate inspection activity and ensure all reports are completed within service level timelines.

---

# Admin QC Review

<img width="2551" height="1260" alt="adminQualityControl" src="https://github.com/user-attachments/assets/7276a943-ac90-4d8e-bc9d-0e0ce05cd9dc" />


## Purpose

The QC dashboard is used by administrators to verify inspection quality before final delivery.

## Features

* Review submitted PCR forms
* Validate uploaded inspection photos
* Verify report accuracy
* Approve or reject reports
* Send revision requests back to vendors

## Use Case

This workflow helps maintain report consistency and ensures accurate property condition data before reports are delivered to lenders or clients.

---

# Client Order Dashboard

<img width="2546" height="1263" alt="clientOrderDahsboard" src="https://github.com/user-attachments/assets/6240e763-9e95-48dc-a7c0-dc73b5acf0ce" />

## Purpose

The client dashboard provides visibility into all submitted property inspection orders.

## Features

* Submit new PCR orders
* View active inspections
* Download completed reports
* Monitor order progress
* View order timelines and statuses

## Use Case

Lenders and asset managers use this dashboard to manage property condition orders across multiple locations and properties.

---

# Client Order In Progress

<img width="2557" height="1269" alt="clientOrderInProgress" src="https://github.com/user-attachments/assets/6b70fbec-c0cb-4f9b-8e5a-9dadd0953164" />

## Purpose

Displays active orders currently being processed by vendors and administrators.

## Features

* Live progress tracking
* Assigned vendor information
* Inspection scheduling status
* Timeline updates

## Use Case

Clients can monitor active inspections without needing to contact support or operations teams.

---

# Client Order Status

<img width="2559" height="1274" alt="clientOrderStatus" src="https://github.com/user-attachments/assets/3c564568-e5f1-4660-9712-8971cc30798e" />

## Purpose

Allows clients to monitor the full lifecycle of each inspection order.

## Features

* Pending status
* Assigned status
* Inspection completed
* QC review status
* Final delivery confirmation

## Use Case

Provides transparency throughout the valuation and inspection workflow.

---

# Vendor Dashboard

<img width="2559" height="1273" alt="vendorDashboard" src="https://github.com/user-attachments/assets/1099e5fa-e2d5-4639-9deb-1f4ab188ca72" />

## Purpose

The Vendor Dashboard allows inspectors and field vendors to manage assigned inspections.

## Features

* View assigned orders
* Accept or reject assignments
* Track upcoming inspections
* Upload property photos
* Submit PCR forms
* Manage profile settings

## Use Case

Field inspectors use this dashboard to efficiently complete inspections and submit reports directly into the platform.

---

# Vendor PCR Form

<img width="2549" height="1277" alt="vendorPCRForm" src="https://github.com/user-attachments/assets/4be7a156-c0a5-453b-be27-690017b7c058" />


## Purpose

The PCR form allows vendors to complete standardized property condition reports.

## Features

* Exterior property condition inputs
* Roof and siding condition fields
* Occupancy status
* Damage reporting
* Image uploads
* Notes and comments

## Use Case

Ensures all inspections follow a consistent reporting format for lenders and institutional clients.

---

# Vendor Profile Page


<img width="2549" height="1278" alt="vendorProfile" src="https://github.com/user-attachments/assets/52e49b97-2124-46ab-b971-69e58332eae1" />


## Purpose

Allows vendors to manage account details and business information.

## Features

* Contact information
* Inspection experience
* Service details
* Availability management
* Profile updates

## Use Case

Helps administrators maintain an updated vendor network across multiple markets.

---

# Vendor Service Area Management

<img width="2551" height="1267" alt="vendorServiceArea" src="https://github.com/user-attachments/assets/14742130-dd5d-4472-b801-60562f62e26f" />


## Purpose

Allows vendors to define and manage geographic inspection coverage areas.

## Features

* State and county selection
* Coverage radius management
* Service region updates
* Market expansion controls

## Use Case



Administrators can automatically assign orders to vendors based on service area coverage.

---

# Sample Report

## Example

<img width="2480" height="3509" alt="sampleReport-1" src="https://github.com/user-attachments/assets/7f889c81-49ea-4477-822f-59ed1378ef3a" />
<img width="2480" height="3509" alt="sampleReport-2" src="https://github.com/user-attachments/assets/3f6e745e-a265-473b-afc0-d8c1371c6df1" />
<img width="2480" height="3509" alt="sampleReport-3" src="https://github.com/user-attachments/assets/c683eec7-9d53-4d00-8928-f7901fa756cd" />
<img width="2480" height="3509" alt="sampleReport-4" src="https://github.com/user-attachments/assets/6e142aff-1dfb-473e-a0a4-9d10a85d67b6" />
<img width="2480" height="3509" alt="sampleReport-5" src="https://github.com/user-attachments/assets/4e4003c9-fbc7-477b-92fa-42ffc28750b7" />
<img width="2480" height="3509" alt="sampleReport-6" src="https://github.com/user-attachments/assets/c40df15c-a0ed-47f4-8867-b4de06071cba" />



## Purpose

The final PCR report delivered to clients after vendor completion and QC approval.

## Report Contents

* Property information
* Exterior condition summary
* Damage observations
* Occupancy indicators
* Inspection photos
* Quality control approval

## Use Case

Lenders and financial institutions use these reports for:

* Portfolio monitoring
* Home equity reviews
* Risk analysis
* Disaster assessments
* Property condition verification

---

# Technical Architecture

## Frontend

* Next.js
* Tailwind CSS
* TypeScript
* Shadcn UI

## Backend

* NEXT API Services
* AWS S3 Bucket
* PostgreSQL Database
* Drizzle ORM
* AUTH JS Authentication
* Resend
* React-pdf
* NEON
* Stripe API

## Features

* Role based authentication
* Secure document uploads
* Real time status updates
* Centralized inspection management
* Vendor assignment system
* PDF report generation

---

# Business Use Cases

## Lenders

* Home equity verification
* Portfolio reviews
* Property monitoring

## Asset Managers

* Vacancy monitoring
* Condition tracking
* Risk oversight

## Valuation Companies

* Vendor management
* Inspection operations
* Quality control workflows

---

# Conclusion

Blue Grid Valuations centralizes the entire property condition reporting process into a single platform. The application improves operational efficiency, vendor coordination, report quality control, and client visibility while reducing turnaround times for property inspection workflows.
