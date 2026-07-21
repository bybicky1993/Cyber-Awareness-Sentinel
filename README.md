# CyberSentinel Offline Training Portal

CyberSentinel is a self-contained cyber-security awareness training application that runs entirely offline in a web browser. It combines the supplied CyberSentinel modules and awareness demos into one responsive learning experience.

## Run the application

Open `index.html` in any modern desktop or mobile browser. No web server, installation, login, or internet connection is required.

## Included training

The portal includes interactive exercises for:

- Getting started and learner profile
- Phishing email awareness
- Website safety and look-alike sites
- SMS / smishing detection
- Phone / vishing scams
- Unknown USB devices
- QR code safety
- Fake browser security alerts
- Password strength and multi-factor authentication
- Training summary and printable certificate
- Look-alike banking awareness and extra quick scenarios

## Navigation

Use the header links to jump to the dashboard, training, summary, or certificate. Every module also has **Back** and **Next module** buttons. The first module returns back to the dashboard; the last extra-scenarios page returns to the dashboard.

## Saved progress

Your name, organization, and completed modules are stored in the browser's local storage on the device. This lets progress remain available after closing and reopening the page.

To start fresh, open **Training summary** and select **Reset saved progress**. This only clears CyberSentinel data stored in that browser; it does not transmit or delete any files.

## Learner data and feedback

The **Review & feedback** tab shows the current learner’s name, organization, completed modules, and average mark. It also provides a feedback form with a 1–5 rating and written comments.

Both learner data and feedback are stored locally in the browser. Use the export buttons on that tab to download Excel-compatible CSV files. A formatted `data/CyberSentinel_Data_Register.xlsx` workbook is included as a register for importing and reviewing those exports.

Module progress is retained locally during an active training session. Completed trainee records and feedback are saved to Supabase for central review.

## Supabase connection

The portal is connected to the configured Supabase project and saves a completion record to the `Result` table after all nine core modules are complete. Each record contains the trainee name, Force No, rank, unit, score, total, percentage, feedback, completion time, and `created_at`.

Before publishing, run [`supabase-setup.sql`](supabase-setup.sql) in the project’s Supabase SQL Editor if the `Result` table does not already have these columns and browser access policies. The Review & Feedback page loads records from Supabase and saves feedback there automatically.

The supplied publishable key is appropriate for a browser application, but anyone who can access the public Review page can read the records while the included public read policy is enabled. For a production deployment containing personal data, protect the review page with Supabase Auth and replace the public read/update policies with authenticated reviewer policies.

## Project structure

```
CyberSentinel/
├── index.html                 # Application entry point
├── README.md                  # This guide
└── assets/
    ├── css/
    │   ├── app.css            # Shared responsive styling
    │   └── navigation.css     # Back/Next module navigation styling
    └── js/
        ├── app.js             # Routes, exercises, local progress, and UI logic
        └── data.js            # Feedback capture and Excel-compatible exports
└── data/
    └── CyberSentinel_Data_Register.xlsx  # Learner and feedback register template
```

## Notes

- The banking screen is an educational simulation only. No credentials are stored or transmitted.
- The certificate and summary use the browser's print dialog, allowing them to be printed or saved as PDF.
- The portal has no external dependencies, so it is suitable for offline demonstrations and awareness sessions.
