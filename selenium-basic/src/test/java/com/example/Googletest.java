package com.example;

import org.junit.jupiter.api.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.*;

class GoogleTest {
    WebDriver driver = new ChromeDriver();
    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));

    @BeforeEach
    public void setup() {
        driver.get("https://www.selenium.dev/selenium/web/web-form.html");
    }

    @AfterEach
    public void finish() {
        driver.close();
        driver.quit();
    }

    @Test
    void seleniumTest() {

        driver.findElement(By.id("my-text-id")).sendKeys("Maria");
        driver.findElement(By.name("my-password")).sendKeys("password");
        driver.findElement(By.name("my-textarea")).sendKeys("Hello World!");
        driver.findElement(By.cssSelector("button[type='submit']")).click();

        WebElement msg = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("message")));

        assertTrue(msg.getText().contains("Received!"));
    }

    @Test
    void selectDropdown_setValue() {
        Select select = new Select(driver.findElement(By.name("my-select")));
        //select.selectByValue("2");
        select.selectByVisibleText("Two");
        assertEquals("2", select.getFirstSelectedOption().getAttribute("value"));
    }

    @Test
    void radio_chooseOne() {
        WebElement r1 = driver.findElement(By.id("my-radio-1"));
        WebElement r2 = driver.findElement(By.id("my-radio-2"));
        r2.click();
        assertTrue(r2.isSelected());
        assertFalse(r1.isSelected());
    }

    @Test
    void range() {
        WebElement range = driver.findElement(By.name("my-range"));
        //range.sendKeys("3");
        range.sendKeys(Keys.ARROW_RIGHT, Keys.ARROW_RIGHT, Keys.ARROW_RIGHT);
        String value = range.getAttribute("value");
        assertNotNull(value);
        assertTrue(Integer.parseInt(value) > 0);
    }

    // ====== dwad =======
    

    /*@Test
    void titleTetest() {
        driver.get("https://www.google.com");
        String title = driver.getTitle();
        assertTrue(title.toLowerCase().contains("google"));
    }*/
}