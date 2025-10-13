import { test, expect } from '@playwright/test';

const USER = "standard_user";
const PASSWORD = "secret_sauce";

test.beforeEach(
    async ({ page }) => {
        await page.goto('/');
        await page.getByPlaceholder('Username').fill(USER);
        await page.getByPlaceholder('Password').fill(PASSWORD);
        await page.getByText('Login').click();

        await expect(page).toHaveURL('/inventory.html');
    }
)

/*
test("sisselogimine", async ({page}) => {
    await page.goto('/');
    await page.getByPlaceholder('Username').fill(USER);
    await page.getByPlaceholder('Password').fill(PASSWORD);
    await page.getByText('Login').click();

    await expect(page).toHaveURL('/inventory.html');
});

test("login: vale parool", async ({page}) => {
    await page.goto('/');
    await page.getByPlaceholder('Username').fill(USER);
    await page.getByPlaceholder('Password').fill("wrong_password");
    await page.getByText('Login').click();

    await expect(page.getByText("Epic sadface: Username and password do not match any user in this service")).toBeVisible();
});
*/

test("Ostukorvi toidu lisamine", async ({ page }) => {
    let firstElement = page.locator("id=add-to-cart-sauce-labs-backpack") 
    await firstElement.click();
    let cartBadge = page.locator(".shopping_cart_badge");
    await expect(cartBadge).toHaveText("1");
});

// 2. Toodete leht
test("Toodete leht Name A to Z", async ({ page }) => {
    let sortSelect = page.locator(".product_sort_container");
    await sortSelect.selectOption({ label: "Name (A to Z)" });
    await expect(sortSelect).toHaveValue("az");
    
    // Kontrollime kaartide järjekorda
    let productNames = await page.locator('.inventory-item-name').allTextContents();
    let sortedNames = [...productNames].sort();
    expect(productNames).toEqual(sortedNames);
});

test("Toodete leht Name Z to A", async ({ page }) => {
    let sortSelect = page.locator(".product_sort_container");
    await sortSelect.selectOption({ label: "Name (Z to A)" });
    await expect(sortSelect).toHaveValue("za");
    
    // Kontrollime kaartide järjekorda
    let productNames = await page.locator('.inventory-item-name').allTextContents();
    let sortedNames = [...productNames].sort().reverse();
    expect(productNames).toEqual(sortedNames);
});

test("Toodete leht Price Low to High", async ({ page }) => {
    let sortSelect = page.locator(".product_sort_container");
    await sortSelect.selectOption({ label: "Price (low to high)" });
    await expect(sortSelect).toHaveValue("lohi");
    
    // Kontrollime hindade järjekorda
    let priceTexts = await page.locator('.inventory-item-price').allTextContents();
    let prices = priceTexts.map(price => parseFloat(price.replace('$', '')));
    let sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedPrices);
});

test("Toodete leht Price High to Low", async ({ page }) => {
    let sortSelect = page.locator(".product_sort_container");
    await sortSelect.selectOption({ label: "Price (high to low)" });
    await expect(sortSelect).toHaveValue("hilo");
    
    // Kontrollime hindade järjekorda
    let priceTexts = await page.locator('.inventory-item-price').allTextContents();
    let prices = priceTexts.map(price => parseFloat(price.replace('$', '')));
    let sortedPrices = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sortedPrices);
});


// 3. Ostukorv
test("Ostukorv 2 toodete lisamine, 1 eemaldamine", async ({ page }) => {
    // Lisame 2 toodet
    let firstElement = page.locator("id=add-to-cart-sauce-labs-backpack")
    await firstElement.click();
    let secondElement = page.locator("id=add-to-cart-sauce-labs-bolt-t-shirt")
    await secondElement.click();

    let cartBadge = page.locator(".shopping_cart_badge");
    await expect(cartBadge).toHaveText("2");
    
    await cartBadge.click();
    
    // Kontrollime, et oleme ostukorvi lehel
    await expect(page).toHaveURL('/cart.html');

    // Kontrollime, et ostukorvis on 2 toodet
    await expect(page.locator('.cart_item')).toHaveCount(2);

    // Kontrolli, et toote nimed on õiged
    await expect(page.locator('.inventory_item_name').first()).toContainText("Sauce Labs Backpack");
    await expect(page.locator('.inventory_item_name').nth(1)).toContainText("Sauce Labs Bolt T-Shirt");

    // Kontrollime hinnad
    await expect(page.locator('.inventory_item_price').first()).toContainText("$29.99");
    await expect(page.locator('.inventory_item_price').nth(1)).toContainText("$15.99");

    // Eemaldame esimese toote
    let removeButton = page.locator('id=remove-sauce-labs-backpack');
    await removeButton.click();
    
    // Kontrollime et badge näitab nüüd 1
    await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
    
    // Kontrollime et korvis on ainult üks toode
    await expect(page.locator('.cart_item')).toHaveCount(1);
     await expect(page.locator('.inventory_item_name')).toContainText("Sauce Labs Bolt T-Shirt");
    await expect(page.locator('.inventory_item_price')).toContainText("$15.99");
});

// 4. Checkout (kuni „Overview“)
test("Сheckout kuni Overview", async ({ page }) => {
    let firstElement = page.locator("id=add-to-cart-sauce-labs-backpack")
    await firstElement.click();
    let secondElement = page.locator("id=add-to-cart-sauce-labs-bolt-t-shirt")
    await secondElement.click();

    let cartBadge = page.locator(".shopping_cart_badge");
    await expect(cartBadge).toHaveText("2");
    await cartBadge.click();

    // Kontrollime, et oleme ostukorvi lehel
    await expect(page).toHaveURL('/cart.html');
    let checkoutButton = page.locator('id=checkout');
    await checkoutButton.click();

    // Kontrollime, et oleme "Overview" lehel
     await expect(page).toHaveURL('/checkout-step-one.html');

    // Täidame vormi
    await page.locator('id=first-name').fill("Test");
    await page.locator('id=last-name').fill("Test");
    await page.locator('id=postal-code').fill("12345");
    let continueButton = page.locator('id=continue');
    await continueButton.click();

    // Checkout step 2 - Overview
    await expect(page).toHaveURL('/checkout-step-two.html');

});

// 5. Seisundi nullimine
test("Seisundi nullimine", async ({ page }) => {
    let firstElement = page.locator("id=add-to-cart-sauce-labs-backpack")
    await firstElement.click();
    
    let cartBadge = page.locator(".shopping_cart_badge");
    await expect(cartBadge).toHaveText("1");
    
    // Avame burger menu
    let burgerMenuButton = page.locator("id=react-burger-menu-btn");
    await burgerMenuButton.click();
    
    // Klikime "Reset App State"
    let resetButton = page.locator("id=reset_sidebar_link");
    await resetButton.click();
    
    // Kontrollime et ostukorv on tühi
    await expect(page.locator(".shopping_cart_badge")).not.toBeVisible();
});