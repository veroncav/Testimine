package com.example;
import org.junit.jupiter.api.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.Duration;

import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.*;
import org.openqa.selenium.ElementClickInterceptedException;
import org.openqa.selenium.SearchContext;

public class PlaygroundTest {
    WebDriver driver;
    WebDriverWait wait;

    @BeforeEach
    public void setup() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--ignore-certificate-errors");
        options.addArguments("--ignore-ssl-errors");
        options.addArguments("--allow-running-insecure-content");
        options.addArguments("--disable-web-security");
        options.addArguments("--ignore-certificate-errors-spki-list");
        
        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        driver.get("https://uitestingplayground.com/");
    }

    @AfterEach
    public void finish() {
        driver.close();
        driver.quit();
    }

    // 1. Sample App -/sampleapp
    @Test
    void sampleAppLogin() {
        driver.findElement(By.linkText("Sample App")).click();
        
        driver.findElement(By.cssSelector("input[name='UserName']")).sendKeys("user");
        driver.findElement(By.cssSelector("input[name='Password']")).sendKeys("pwd");
        driver.findElement(By.cssSelector("button[id='login']")).click();
        
        WebElement welcomeMsg = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("loginstatus")));
        assertTrue(welcomeMsg.getText().contains("Welcome, user!"));
    }
   
    // 2. Sample App logout -/sampleapp
    @Test
    void sampleAppLogout() {
        driver.findElement(By.linkText("Sample App")).click();
        
        // Login first
        driver.findElement(By.cssSelector("input[name='UserName']")).sendKeys("user");
        driver.findElement(By.cssSelector("input[name='Password']")).sendKeys("pwd");
        driver.findElement(By.cssSelector("button[id='login']")).click();
        
        WebElement welcomeMsg = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("loginstatus")));
        assertTrue(welcomeMsg.getText().contains("Welcome, user!"));
        
        // Logout
        driver.findElement(By.cssSelector("button[id='login']")).click();

        Boolean logoutMsg = wait.until(ExpectedConditions.textToBePresentInElementLocated(By.id("loginstatus"), "User logged out."));
        assertTrue(logoutMsg);
    }

    // 3. Dynamic ID -/dynamicid
    @Test
    void dynamicId() {
        driver.findElement(By.linkText("Dynamic ID")).click();
        WebElement button = driver.findElement(By.cssSelector("button.btn-primary"));
        button.click();
        assertTrue(button.isDisplayed());
    }
    
    // 4. Class Attribute -/classattr
    @Test
    void classAttribute() {
        driver.findElement(By.linkText("Class Attribute")).click();
        WebElement greenButton = driver.findElement(By.cssSelector("button.btn-primary"));
        greenButton.click();
        
        Alert alert = wait.until(ExpectedConditions.alertIsPresent());
        assertTrue(alert.getText().contains("Primary"));
        alert.accept();
    }

    // 5. Hidden Layers -/hiddenlayers
    @Test
    void hiddenLayers() {
        driver.findElement(By.linkText("Hidden Layers")).click();
        WebElement greenButton = driver.findElement(By.cssSelector("button[id='greenButton']"));
        greenButton.click();
        assertThrows(ElementClickInterceptedException.class, () -> {
            greenButton.click();
        });
    }

    // 6. Load Delay -/loaddelay
    @Test
    void loadDelay() {
        driver.findElement(By.linkText("Load Delay")).click();
        WebElement button = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("button.btn-primary")));
        assertTrue(button.isDisplayed());
    }

    // 7. AJAX Data -/ajax
    @Test
    void ajaxData() {
        driver.findElement(By.linkText("AJAX Data")).click();

        // sest lehel kirjutab "Press the button below and wait for data to appear (15 seconds)"
        WebDriverWait waitAjax = new WebDriverWait(driver, Duration.ofSeconds(15));

        driver.findElement(By.id("ajaxButton")).click();

        WebElement msg = waitAjax.until(ExpectedConditions.visibilityOfElementLocated(
            By.cssSelector("#content p.bg-success")
        ));

        assertTrue(msg.getText().contains("Data loaded with AJAX get request."));
    }

    // 8. Text Input -/textinput
    @Test
    void textInput() {
        driver.findElement(By.linkText("Text Input")).click();
        WebElement input = driver.findElement(By.cssSelector("input[id='newButtonName']"));
        input.sendKeys("Hello");
        
        driver.findElement(By.cssSelector("button[id='updatingButton']")).click();
        
        WebElement button = driver.findElement(By.cssSelector("button[id='updatingButton']"));
        assertEquals("Hello", button.getText());
    }

    // 9. Scrollbars -/scrollbars
    @Test
    void scrollbars() {
        driver.findElement(By.linkText("Scrollbars")).click();
        WebElement hiddenButton = driver.findElement(By.id("hidingButton"));
        
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block: 'center'});", hiddenButton);
        wait.until(ExpectedConditions.elementToBeClickable(hiddenButton));
        hiddenButton.click();

        assertTrue(true);
    }

    // 10. Overlapped Element -/overlapped
    @Test
    void overlappedElement() {
        driver.findElement(By.linkText("Overlapped Element")).click();
        WebElement input = driver.findElement(By.id("id"));
        
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block: 'center'});", input);
        ((JavascriptExecutor) driver).executeScript("window.scrollBy(0, -100);");
        wait.until(ExpectedConditions.elementToBeClickable(input));
        input.clear();
        input.sendKeys("abc");

        assertEquals("abc", input.getAttribute("value"));
    }

    // 11. Visibility -/visibility
    @Test
    void visibility() {
        driver.findElement(By.linkText("Visibility")).click();

        driver.findElement(By.id("hideButton")).click();

        boolean removedExists = !driver.findElements(By.id("removedButton")).isEmpty();
        assertFalse(removedExists, "Removed button should not exist in DOM");

        WebElement zeroWidth = driver.findElement(By.id("zeroWidthButton"));
        assertFalse(zeroWidth.isDisplayed(), "Zero Width button is in DOM but not visible");

        WebElement invisible = driver.findElement(By.id("invisibleButton"));
        assertFalse(invisible.isDisplayed(), "Invisible button is in DOM but not visible");
    }


    // 12. Click -/click
    @Test
    void click() {
        driver.findElement(By.linkText("Click")).click();
        WebElement button = driver.findElement(By.cssSelector("button[id='badButton']"));
        button.click();
        
        wait.until(ExpectedConditions.attributeContains(button, "class", "btn-success"));
        assertTrue(button.getAttribute("class").contains("btn-success"));
    }

    // 13. Progress Bar -/progressbar
    @Test
    void progressBar() {
        driver.findElement(By.linkText("Progress Bar")).click();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));
        WebElement startButton = driver.findElement(By.id("startButton"));
        WebElement stopButton = driver.findElement(By.id("stopButton"));
        WebElement progressBar = driver.findElement(By.cssSelector("div[role='progressbar']"));

        startButton.click();
        wait.until(driver -> {
            int value = Integer.parseInt(progressBar.getAttribute("aria-valuenow"));
            return value >= 75;
        });

        stopButton.click();

        int finalValue = Integer.parseInt(progressBar.getAttribute("aria-valuenow"));
        assertTrue(finalValue >= 75);
    }

    // 14. Mouse Over -/mouseover
    @Test
    void mouseOver() {
        driver.findElement(By.linkText("Mouse Over")).click();
        WebElement link = driver.findElement(By.cssSelector("a[title='Click me']"));
        
        Actions actions = new Actions(driver);
        actions.moveToElement(link).click().click().perform();
        
        WebElement counter = driver.findElement(By.id("clickCount"));
        assertEquals("2", counter.getText());
    }

    // 15. Shadow DOM -/shadowdom
    @Test
    void shadowDOM() {
        driver.findElement(By.linkText("Shadow DOM")).click();
        
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement shadowHost = wait.until(ExpectedConditions.presenceOfElementLocated(By.tagName("guid-generator")));

        SearchContext shadow = shadowHost.getShadowRoot();

        WebElement generateBtn = shadow.findElement(By.id("buttonGenerate"));
        WebElement inputField = shadow.findElement(By.id("editField"));

        assertTrue(generateBtn.isDisplayed());
        assertTrue(inputField.isDisplayed());

        generateBtn.click();
        String generatedText = inputField.getAttribute("value");

        assertFalse(generatedText.isEmpty());
    }
}