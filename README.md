# BDR Lead Qualification Form

This project is a BDR (Business Development Representative) Lead Qualification Form with dynamic validation, Toastify notifications, and HubSpot integration. It uses Node.js, Express, EJS, Alpine.js, and Tailwind CSS.

## Features

- Professional, responsive lead qualification form UI (Tailwind CSS)
- Dynamic field validation (client-side and server-side)
- Inline error messages and Toastify notifications
- Conditional fields (e.g., eCommerce-specific questions)
- HubSpot integration for contact and deal data
- Favicon and static asset support

## Getting Started

### 1. Install dependencies

```sh
npm install
```

### 2. Configure Environment Variables

Copy the sample environment file and fill in your HubSpot credentials:

```sh
cp .env.sample .env
```

Edit `.env` and set your `CLIENT_SECRET`, `HUBSPOT_API_KEY` or OAuth token, and any other required values.

### 3. Start the Server

```sh
npm run dev
```

or

```sh
node src/app.js
```

### 4. Access the Form

Open your browser and go to:

```
http://localhost:3000/bdr-form?data=YOUR_ENCODED_DATA
```

Replace `YOUR_ENCODED_DATA` with the encoded payload as required.

## Project Structure

```
src/
  controllers/
    portalController.js      # Handles form display, validation, and submission
  routes/
    portal.js               # Express routes for BDR form
  utils/
    hubspot_utils.js        # Helper functions for HubSpot API
  views/
    bdr-form.ejs            # Main BDR form UI
public/
  favicon.png               # Favicon and other static assets
.env.sample                 # Example environment config
```

## Static Files

- Place your `favicon.png` and other static assets in the `public/` directory.
- Express serves these at `/public/filename`.

## Validation

- Client-side: Inline error messages below each field and Toastify notification for general errors.
- Server-side: Returns JSON with error messages for each field and a general message for Toastify.

## Notes

- Make sure your HubSpot API key or OAuth token has the correct scopes for contacts and deals.
- For production, secure your endpoints and validate all user input.
- The form supports conditional required fields (e.g., eCommerce-specific questions).

---

**Need help?**  
Contact the project maintainer or open