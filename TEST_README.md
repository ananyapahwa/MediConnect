# MediConnect - Selenium Test Documentation

## Overview

`FirstTestCase.java` is a **Selenium WebDriver end-to-end (E2E) test suite** for the MediConnect web application. It automates a Chrome browser to simulate real user interactions against a locally running app at `http://localhost:5173`, covering the **full lifecycle of an appointment** — from user registration to booking and verification.

## Test Configuration

- **Framework**: Selenium WebDriver with ChromeDriver
- **Wait Strategy**: Explicit waits (`WebDriverWait`) with a 15-second timeout
- **Data**: Unique test data generated at runtime using `System.currentTimeMillis()` timestamps
- **Target URL**: `http://localhost:5173`

## Test Scenarios

### Test 0: Password Validation Tests (7 Sub-Cases)

Validates that the registration form correctly rejects invalid passwords by testing the following constraints:

| # | Constraint Tested     | Example Password    | Expected Error Message                                              |
|---|-----------------------|---------------------|---------------------------------------------------------------------|
| 1 | Length < 8            | `Ab1!`              | Password must be between 8 and 15 characters long.                  |
| 2 | Length > 15           | `Ab1!Ab1!Ab1!Ab1!`  | Password must be between 8 and 15 characters long.                  |
| 3 | No digit              | `NoDigit!`          | Password must contain at least one digit.                           |
| 4 | No uppercase letter   | `no_upper_1!`       | Password must contain at least one uppercase letter.                |
| 5 | No lowercase letter   | `NO_LOWER_1!`       | Password must contain at least one lowercase letter.                |
| 6 | No special character  | `NoSpecial1`        | Password must contain at least one special character (!@#$%&*()-+=^). |
| 7 | Contains whitespace   | `Space 1!`          | Password must not contain any white space.                          |

### Test 1: Register Doctor (Happy Path)

- Navigates to the registration page
- Fills in doctor name, email, and password with unique timestamped values
- Selects the **"doctor"** role via radio button
- Submits the form and verifies a **Success** popup

### Test 2: Doctor Profile Setup

- Logs out, then logs back in as the registered doctor
- Navigates to the **Doctor Dashboard → Settings & Schedule** tab
- Fills in profile details:
  - Specialization: General Practitioner
  - Experience: 15 years
  - Fees: $120
  - Phone: 5551234567
  - Address: 123 Health St, Wellness City
- Adds availability slots for **Monday–Friday** (8:00 AM – 5:00 PM)
- Saves changes and verifies the success popup

### Test 3: Register Patient

- Registers a new patient account with unique credentials
- Selects the **"patient"** role
- Verifies successful registration

### Test 4: Book Appointment (as Patient)

- Logs in as the patient
- Navigates to the `/doctors` page
- Searches through **paginated results** to find the registered doctor
- Clicks **"Book Appointment"**, selects the first available time slot
- Enters a reason: _"E2E Test Appointment"_
- Confirms the booking and verifies the success popup

### Test 5: Verify Booking (as Doctor)

- Logs in as the doctor
- Checks the **total appointment count** on the dashboard
- Navigates to the **Appointments** tab
- Locates the booked time slot marked as `(Booked)`
- Clicks it to open the appointment details modal
- **Verifies the patient name** matches the registered patient
- Closes the modal

## Total Test Case Count

| Category                  | Count |
|---------------------------|-------|
| Password Validation Tests | 7     |
| Doctor Registration       | 1     |
| Doctor Profile Setup      | 1     |
| Patient Registration      | 1     |
| Appointment Booking       | 1     |
| Booking Verification      | 1     |
| **Total**                 | **12** |

## Helper Methods

| Method                | Purpose                                                        |
|-----------------------|----------------------------------------------------------------|
| `fillForm()`          | Fills the registration form fields and clicks Sign Up          |
| `checkErrorPopup()`   | Waits for an error popup with a specific message, then closes it |
| `registerUser()`      | Full registration flow with role selection and popup handling  |
| `loginUser()`         | Logs in and waits for redirect to the appropriate dashboard    |
| `logout()`            | Clicks the Logout button and waits for redirect to `/login`   |
| `setupDoctorProfile()`| Fills doctor profile settings and schedule slots               |
| `bookAppointment()`   | Searches for doctor, selects a slot, and confirms booking      |
| `verifyBooking()`     | Verifies the appointment from the doctor's dashboard           |
| `checkPopup()`        | General-purpose popup detection and optional close             |

## How to Run

1. Ensure the MediConnect app is running locally at `http://localhost:5173`
2. Ensure the backend server is running
3. Ensure ChromeDriver is installed and available in your PATH
4. Compile and run:
   ```bash
   javac -cp ".:selenium-server-standalone.jar" FirstTestCase.java
   java -cp ".:selenium-server-standalone.jar" com.test.FirstTestCase
   ```
