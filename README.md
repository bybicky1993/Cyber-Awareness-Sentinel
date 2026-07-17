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
        └── app.js             # Routes, exercises, local progress, and UI logic
```

## Notes

- The banking screen is an educational simulation only. No credentials are stored or transmitted.
- The certificate and summary use the browser's print dialog, allowing them to be printed or saved as PDF.
- The portal has no external dependencies, so it is suitable for offline demonstrations and awareness sessions.
