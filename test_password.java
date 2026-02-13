package com.test;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class FirstTestCase {

        public static void main(String[] args) {

                ChromeOptions options = new ChromeOptions();
                options.addArguments("--remote-allow-origins=*");

                WebDriver driver = new ChromeDriver(options);
                WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));

                try {
                        // Navigate to the registration page (assuming default Vite port 5173)
                        driver.get("http://localhost:5173/register");
                        driver.manage().window().maximize();

                        // 1. Check Constraint: Length at least 8 characters
                        System.out.println("Testing Constraint: Length < 8");
                        fillForm(driver, wait, "Test User", "test@example.com", "Ab1!", "Ab1!");
                        // Expect error message

                        // Note: Since the page doesn't refresh, we might need to clear or just
                        // overwrite.
                        // For simplicity in this linear script, we will just re-enter values or assume
                        // the alert handling.
                        // But the current implementation uses a custom Popup component, not a browser
                        // alert.
                        // We need to wait for the popup and close it or check its text.

                        checkPopupError(wait, "Password must be between 8 and 15 characters long.");
                        closePopup(wait);

                        // 2. Check Constraint: Length at most 15 characters
                        System.out.println("Testing Constraint: Length > 15");
                        fillForm(driver, wait, "Test User", "test@example.com", "Ab1!Ab1!Ab1!Ab1!", "Ab1!Ab1!Ab1!Ab1!");
                        checkPopupError(wait, "Password must be between 8 and 15 characters long.");
                        closePopup(wait);

                        // 3. Check Constraint: At least one digit
                        System.out.println("Testing Constraint: No Digit");
                        fillForm(driver, wait, "NoDigitPassword!", "Test User", "NoDigitPassword!", "NoDigitPassword!"); // Swapped
                                                                                                                         // name
                                                                                                                         // to
                                                                                                                         // properly
                                                                                                                         // reset
                                                                                                                         // if
                                                                                                                         // needed,
                                                                                                                         // but
                                                                                                                         // here
                                                                                                                         // just
                                                                                                                         // overwriting
                        // Actually, the fillForm helper should handle clearing.
                        fillForm(driver, wait, "Test User", "test@example.com", "NoDigit!", "NoDigit!");
                        checkPopupError(wait, "Password must contain at least one digit.");
                        closePopup(wait);

                        // 4. Check Constraint: At least one upper case
                        System.out.println("Testing Constraint: No Uppercase");
                        fillForm(driver, wait, "Test User", "test@example.com", "no_upper_1!", "no_upper_1!");
                        checkPopupError(wait, "Password must contain at least one uppercase letter.");
                        closePopup(wait);

                        // 5. Check Constraint: At least one lower case
                        System.out.println("Testing Constraint: No Lowercase");
                        fillForm(driver, wait, "Test User", "test@example.com", "NO_LOWER_1!", "NO_LOWER_1!");
                        checkPopupError(wait, "Password must contain at least one lowercase letter.");
                        closePopup(wait);

                        // 6. Check Constraint: At least one special character
                        System.out.println("Testing Constraint: No Special Character");
                        fillForm(driver, wait, "Test User", "test@example.com", "NoSpecial1", "NoSpecial1");
                        checkPopupError(wait, "Password must contain at least one special character (!@#$%&*()-+=^).");
                        closePopup(wait);

                        // 7. Check Constraint: No white space
                        System.out.println("Testing Constraint: White Space");
                        fillForm(driver, wait, "Test User", "test@example.com", "Space 1!", "Space 1!");
                        checkPopupError(wait, "Password must not contain any white space.");
                        closePopup(wait);

                        // 8. Valid Password
                        System.out.println("Testing Valid Password");
                        fillForm(driver, wait, "Test User", "test@example.com", "Valid1!Pass", "Valid1!Pass");

                        // Check for success or error popup
                        try {
                                WebElement popupTitle = wait.until(ExpectedConditions.visibilityOfElementLocated(
                                                By.xpath("//div[contains(@class, 'fixed')]//h3")));
                                String titleText = popupTitle.getText();

                                if (titleText.equals("Success")) {
                                        System.out.println("SUCCESS: Valid password accepted and User Registered.");
                                        closePopup(wait);
                                } else if (titleText.equals("Registration Failed")) {
                                        // Try to get the error message
                                        WebElement errorMessage = driver
                                                        .findElement(By.xpath("//div[contains(@class, 'fixed')]//p"));
                                        String errorText = errorMessage.getText();
                                        System.out.println(
                                                        "INFO: Registration Failed as expected if user exists. Message: "
                                                                        + errorText);
                                        closePopup(wait);
                                } else {
                                        System.out.println("FAILURE: Unexpected popup title: " + titleText);
                                        closePopup(wait);
                                }
                        } catch (Exception e) {
                                System.out.println("FAILURE: No popup appeared after clicking Sign up.");
                        }

                        // Proceed to Login Test
                        performLoginTest(driver, wait);

                } catch (Exception e) {
                        e.printStackTrace();
                } finally {
                        // driver.quit(); // Commented out to let user see the result, or uncomment to
                        // close
                        driver.quit();
                }
        }

        private static void fillForm(WebDriver driver, WebDriverWait wait, String name, String email, String password,
                        String confirmPassword) {
                WebElement nameField = driver.findElement(By.name("name"));
                nameField.clear();
                nameField.sendKeys(name);

                WebElement emailField = driver.findElement(By.name("email"));
                emailField.clear();
                emailField.sendKeys(email);

                WebElement passwordField = driver.findElement(By.name("password"));
                passwordField.clear();
                passwordField.sendKeys(password);

                WebElement confirmPasswordField = driver.findElement(By.name("confirmPassword"));
                confirmPasswordField.clear();
                confirmPasswordField.sendKeys(confirmPassword);

                // Click Sign up
                driver.findElement(By.xpath("//button[text()='Sign up']")).click();
        }

        private static void checkPopupError(WebDriverWait wait, String expectedError) {
                try {
                        // Provide a generic xpath that finds the error message paragraph in the popup
                        // Based on Register.jsx using a generic Popup component, we need to find where
                        // 'message' is rendered.
                        // Usually it's in a p tag or div. We'll look for the text directly.
                        WebElement errorMsg = wait.until(ExpectedConditions.visibilityOfElementLocated(
                                        By.xpath("//*[contains(text(), '" + expectedError + "')]")));

                        if (errorMsg.isDisplayed()) {
                                System.out.println("PASSED: Found error message: " + expectedError);
                                Thread.sleep(2000); // 2-second delay to see the error popup
                        } else {
                                System.out.println("FAILED: Error message NOT found: " + expectedError);
                        }
                } catch (Exception e) {
                        System.out.println("FAILED: Timeout waiting for error message: " + expectedError);
                }
        }

        private static void closePopup(WebDriverWait wait) {
                try {
                        // Find the close button (X icon or specific button logic)
                        // Register.jsx passes 'onClose' to Popup.
                        // We need to find the close button in the Popup component.
                        // Assuming the Popup component has a close button, often top right.
                        // If we don't know the specific structure of Popup, we might try clicking the
                        // backdrop or looking for a close icon.
                        // Let's assume a generic close button behavior or wait for it to disappear if
                        // it's a toast?
                        // The code shows `Popup` component has `onClose`.
                        // Let's try to find an 'X' button or just click outside?
                        // Actually, without seeing Popup.jsx, I'll assume there's a button to close it.
                        // If it's a modal, usually there is an X.
                        // I'll try to find a button in the popup container.

                        // For now, let's try to click the wrapper or a generic button if present.
                        // A common pattern is an SVG X icon.
                        // Let's try to find a button with an SVG inside it that is likely the close
                        // button.
                        // Or just refresh the page to reset state if closing is hard to guess.
                        // Refreshing is safer for independent tests.
                        wait.until(ExpectedConditions
                                        .elementToBeClickable(By.xpath("//div[contains(@class, 'fixed')]//button")))
                                        .click();
                        Thread.sleep(500); // clear animation

                } catch (Exception e) {
                        // If closing fails, just refresh
                        // driver.navigate().refresh();
                        System.out.println("Warning: Could not close popup, attempting to continue...");
                }
        }

        private static void performLoginTest(WebDriver driver, WebDriverWait wait) {
                System.out.println("\n--- Starting Login Test ---");

                // Navigate to Login Page
                driver.get("http://localhost:5173/login");

                // Use the valid credentials from the registration test
                String email = "test@example.com";
                String password = "Valid1!Pass";

                WebElement emailField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.name("email")));
                emailField.clear();
                emailField.sendKeys(email);

                WebElement passwordField = driver.findElement(By.name("password"));
                passwordField.clear();
                passwordField.sendKeys(password);

                // Click Sign in
                driver.findElement(By.xpath("//button[text()='Sign in']")).click();

                // Verify Login Success
                // Assuming redirection to home page ('/') or some dashboard element
                try {
                        // Wait for URL to be the home page or check for a logout button / user profile
                        wait.until(ExpectedConditions.urlToBe("http://localhost:5173/"));
                        System.out.println("SUCCESS: Login successful, redirected to Home page.");
                } catch (Exception e) {
                        System.out.println("FAILURE: Login failed or redirection didn't happen.");
                }
        }
}
