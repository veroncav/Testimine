import { test, expect, Page } from '@playwright/test';

const USER = "standard_user";
const PROBLEM_USER = "problem_user";
const PERFORMANCE_GLITCH_USER = "performance_glitch_user";
const PASSWORD = "secret_sauce";

// === Funktsioonid sisselogimiseks ===
async function login_standard_user(page: Page) {
    await page.goto('/');
    await page.getByPlaceholder('Username').fill(USER);
    await page.getByPlaceholder('Password').fill(PASSWORD);
    await page.getByText('Login').click();
}

async function login_problem_user(page: Page) {
    await page.goto('/');
    await page.getByPlaceholder('Username').fill(PROBLEM_USER);
    await page.getByPlaceholder('Password').fill(PASSWORD);
    await page.getByText('Login').click();
}

async function performance_glitch_user(page: Page) {
    await page.goto('/');
    await page.getByPlaceholder('Username').fill(PERFORMANCE_GLITCH_USER);
    await page.getByPlaceholder('Password').fill(PASSWORD);
    await page.getByText('Login').click();
}


/* On vaja erinevad logimise funktsioonid erinevate kasutajate jaoks
test.beforeEach(
    async ({ page }) => {
        await page.goto('/');
        await page.getByPlaceholder('Username').fill(USER);
        await page.getByPlaceholder('Password').fill(PASSWORD);
        await page.getByText('Login').click();

        await expect(page).toHaveURL('/inventory.html');
    }
) */

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
    await login_standard_user(page);

    let firstElement = page.locator("id=add-to-cart-sauce-labs-backpack") 
    await firstElement.click();
    let cartBadge = page.locator(".shopping_cart_badge");
    await expect(cartBadge).toHaveText("1");
});

// 2. Toodete leht
test("Toodete leht Name A to Z", async ({ page }) => {
    await login_standard_user(page);

    let sortSelect = page.locator(".product_sort_container");
    await sortSelect.selectOption({ label: "Name (A to Z)" });
    await expect(sortSelect).toHaveValue("az");
    
    // Kontrollime kaartide järjekorda
    let productNames = await page.locator('.inventory-item-name').allTextContents();
    let sortedNames = [...productNames].sort();
    expect(productNames).toEqual(sortedNames);
});

test("Toodete leht Name Z to A", async ({ page }) => {
    await login_standard_user(page);

    let sortSelect = page.locator(".product_sort_container");
    await sortSelect.selectOption({ label: "Name (Z to A)" });
    await expect(sortSelect).toHaveValue("za");
    
    // Kontrollime kaartide järjekorda
    let productNames = await page.locator('.inventory-item-name').allTextContents();
    let sortedNames = [...productNames].sort().reverse();
    expect(productNames).toEqual(sortedNames);
});

test("Toodete leht Price Low to High", async ({ page }) => {
    await login_standard_user(page);

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
    await login_standard_user(page);

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
    await login_standard_user(page);
    
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
    await login_standard_user(page);

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
    await login_standard_user(page);

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

// ===== Uued testcase`id =====

// 1. Inventory ilma sisselogimiseta → redirect
test("Inventory ilma sisselogimiseta → redirect", async ({ page }) => {
    await page.goto('/inventory.html');
    await expect(page).toHaveURL('/');

    // Kontrollime, et sisselogimise vorm on nähtav
    await expect(page.locator('id=user-name')).toBeVisible();
    await expect(page.locator('id=password')).toBeVisible();
    await expect(page.locator('id=login-button')).toBeVisible();
});

// 2. Cart ilma sisselogimiseta → redirect
test("Cart ilma sisselogimiseta → redirect", async ({ page }) => {
    await page.goto('/cart.html');
    await expect(page).toHaveURL('/');

    // Kontrollime, et sisselogimise vorm on nähtav
    await expect(page.locator('id=user-name')).toBeVisible();
    await expect(page.locator('id=password')).toBeVisible();
    await expect(page.locator('id=login-button')).toBeVisible();
});

// 3. Kasutaja problem_user: lisamine korvi töötab
test("Kasutaja problem_user: lisamine korvi töötab", async ({ page }) => {
    await login_problem_user(page);

    await page.goto('/inventory.html');
    await page.locator("id=add-to-cart-sauce-labs-backpack").click();
    await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
});

// 4. Kasutaja performance_glitch_user: kataloog renderdub
test("Kasutaja performance_glitch_user: kataloog renderdub", async ({ page }) => {
    await performance_glitch_user(page);

    await page.goto('/inventory.html');
    await expect(page.locator(".inventory_list")).toBeVisible();
    await expect(page.locator(".inventory_item")).toHaveCount(6);

    let items = page.locator("id=item_4_title_link")
    await items.click();
    await expect(page).toHaveURL("/inventory-item.html?id=4");

    let backButton = page.locator("id=back-to-products");
    await backButton.click();
    await expect(page).toHaveURL("/inventory.html");
});

// 5. Tagasi navigatsioon säilitab sorteerimise
test("Tagasi navigatsioon säilitab sorteerimise", async ({ page }) => {
    await login_standard_user(page);
    await page.goto('/inventory.html');

    let sortSelect = page.locator(".product_sort_container");
    await sortSelect.selectOption({ label: "Price (low to high)" });
    await expect(sortSelect).toHaveValue("lohi");

    let items = page.locator("id=item_4_title_link");
    await items.click();
    await expect(page).toHaveURL("/inventory-item.html?id=4");

    let backButton = page.locator("id=back-to-products");
    await backButton.click();
    await expect(page).toHaveURL("/inventory.html");

    // Kuna sorteerimine ei säili, siis kutsume uuesti
    await sortSelect.selectOption({ label: "Price (low to high)" });
    await expect(sortSelect).toHaveValue("lohi");

    let priceTexts = await page.locator('.inventory-item-price').allTextContents();
    let prices = priceTexts.map(price => parseFloat(price.replace('$', '')));
    let sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedPrices);
});

// 6. Nupu seisund kaardil
test("Nupu seisund kaardil", async ({ page }) => {
    await login_standard_user(page);
    await page.goto('/inventory.html');

    let cartBadge = page.locator(".shopping_cart_badge");
    await expect(cartBadge).not.toBeVisible();

    let firstElement = page.locator("id=add-to-cart-sauce-labs-backpack");
    await firstElement.click();
    await expect(cartBadge).toHaveText("1");

    let removeFromCardButton = page.locator("id=remove-sauce-labs-backpack");
    await removeFromCardButton.click();
    await expect(cartBadge).not.toBeVisible();
});

// 7. Eemaldus korvist taastab kaardi nupu
test("Eemaldus korvist taastab kaardi nupu", async ({ page }) => {
    await login_standard_user(page);
    let firstCard = page.locator('.inventory_item').first();
    let addButton = firstCard.locator('button');
    await addButton.click();
    let cartBadge = page.locator(".shopping_cart_badge");
    await expect(cartBadge).toHaveText("1");
    await cartBadge.click();
    await expect(page).toHaveURL('/cart.html');
    let removeButton = page.locator('id=remove-sauce-labs-backpack');
    await removeButton.click();
    await expect(page.locator(".shopping_cart_badge")).not.toBeVisible();
    await page.goto('/inventory.html');
    await expect(addButton).toHaveText("Add to cart");
});

// 8. Korvi ikoon kataloogist
test("Korvi ikoon kataloogist", async ({ page }) => {
    await login_standard_user(page);

    let cartIcon = page.locator('.shopping_cart_link');
    await expect(cartIcon).toBeVisible();
    await cartIcon.click();
    await expect(page).toHaveURL('/cart.html');
    await expect(page.locator('.cart_item')).toHaveCount(0);
    await page.goto('/inventory.html');
    let firstCard = page.locator('.inventory_item').first();
    let addButton = firstCard.locator('button');
    await addButton.click();
    let cartBadge = page.locator(".shopping_cart_badge");
    await expect(cartBadge).toHaveText("1");
    await cartIcon.click();
    await expect(page).toHaveURL('/cart.html');
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.locator('.inventory_item_name')).toContainText("Sauce Labs Backpack");
    await expect(page.locator('.inventory_item_price')).toContainText("$29.99");
});

// 9. “Continue Shopping” korvist
test("“Continue Shopping” korvist", async ({ page }) => {
    await login_standard_user(page);

    let addButton = page.locator("id=add-to-cart-sauce-labs-backpack");
    await addButton.click();

    let cartBadge = page.locator(".shopping_cart_badge");
    await cartBadge.click();
    await expect(page).toHaveURL('/cart.html');

    let continueShoppingButton = page.locator("id=continue-shopping");
    await continueShoppingButton.click();
    await expect(page).toHaveURL('/inventory.html');

    await expect(cartBadge).toHaveText("1");
});

// 10. Sorteerimise ääretingimused
test("Sorteerimise ääretingimused", async ({ page }) => {
    await login_standard_user(page);
    await page.goto('/inventory.html');

    // Name (A to Z) - esimene peaks olema alfabeedis esimene, viimane viimane
    let sortSelect = page.locator(".product_sort_container");
    await sortSelect.selectOption({ label: "Name (A to Z)" });
    
    let productNames = await page.locator('.inventory_item_name').allTextContents();
    let sortedNames = [...productNames].sort();
    expect(productNames[0]).toBe(sortedNames[0]); // Esimene
    expect(productNames[productNames.length - 1]).toBe(sortedNames[sortedNames.length - 1]); // Viimane

    // Name (Z to A) - vastupidi
    await sortSelect.selectOption({ label: "Name (Z to A)" });
    
    productNames = await page.locator('.inventory_item_name').allTextContents();
    let reverseSortedNames = [...productNames].sort().reverse();
    expect(productNames[0]).toBe(reverseSortedNames[0]); // Esimene (Z pool)
    expect(productNames[productNames.length - 1]).toBe(reverseSortedNames[reverseSortedNames.length - 1]); // Viimane (A pool)

    // Price (low to high) - madalaim hind esimene, kõrgeim viimane
    await sortSelect.selectOption({ label: "Price (low to high)" });
    
    let priceTexts = await page.locator('.inventory_item_price').allTextContents();
    let prices = priceTexts.map(price => parseFloat(price.replace('$', '')));
    let sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices[0]).toBe(sortedPrices[0]); // Madalaim hind
    expect(prices[prices.length - 1]).toBe(sortedPrices[sortedPrices.length - 1]); // Kõrgeim hind

    // Price (high to low) - kõrgeim hind esimene, madalaim viimane  
    await sortSelect.selectOption({ label: "Price (high to low)" });
    
    priceTexts = await page.locator('.inventory_item_price').allTextContents();
    prices = priceTexts.map(price => parseFloat(price.replace('$', '')));
    let reverseSortedPrices = [...prices].sort((a, b) => b - a);
    expect(prices[0]).toBe(reverseSortedPrices[0]); // Kõrgeim hind
    expect(prices[prices.length - 1]).toBe(reverseSortedPrices[reverseSortedPrices.length - 1]); // Madalaim hind
});

// 11. Tootelehe andmete kooskõla
test("Tootelehe andmete kooskõla", async ({ page }) => {
    await login_standard_user(page);
    await page.goto('/inventory.html');

    // Võtame esimese toote kogu kaardi, mitte ainult linki
    let firstProductCard = page.locator('.inventory_item').first();
    let cardName = await firstProductCard.locator('.inventory_item_name').textContent();
    let cardDescription = await firstProductCard.locator('.inventory_item_desc').textContent();
    let cardPrice = await firstProductCard.locator('.inventory_item_price').textContent();

    await firstProductCard.locator('.inventory_item_name').click();
    await expect(page).toHaveURL(/.*inventory-item\.html.*/);
    
    // Võrdleme andmeid
    await expect(page.locator('.inventory_details_name')).toHaveText(cardName || "");
    await expect(page.locator('.inventory_details_desc')).toHaveText(cardDescription || "");
    await expect(page.locator('.inventory_details_price')).toHaveText(cardPrice || "");
    
    // Testme ka teist toodet
    await page.locator('id=back-to-products').click();
    await expect(page).toHaveURL('/inventory.html');
    
    // Võtame teise toote
    let secondProductCard = page.locator('.inventory_item').nth(1);
    cardName = await secondProductCard.locator('.inventory_item_name').textContent();
    cardDescription = await secondProductCard.locator('.inventory_item_desc').textContent();
    cardPrice = await secondProductCard.locator('.inventory_item_price').textContent();
    
    await secondProductCard.locator('.inventory_item_name').click();
    await expect(page).toHaveURL(/.*inventory-item\.html.*/);
    
    await expect(page.locator('.inventory_details_name')).toHaveText(cardName || "");
    await expect(page.locator('.inventory_details_desc')).toHaveText(cardDescription || "");
    await expect(page.locator('.inventory_details_price')).toHaveText(cardPrice || "");
});

// 12. Checkout matemaatika
test("Checkout matemaatika", async ({ page }) => {
    await login_standard_user(page);
    await page.goto('/inventory.html');

    let firstElementAddToCart = page.locator("id=add-to-cart-sauce-labs-backpack");
    await firstElementAddToCart.click();
    let secondElementAddToCart = page.locator("id=add-to-cart-sauce-labs-bike-light");
    await secondElementAddToCart.click();

    let cartBadge = page.locator(".shopping_cart_badge");
    await expect(cartBadge).toHaveText("2");
    await cartBadge.click();

    await expect(page).toHaveURL('/cart.html');
    let checkoutButton = page.locator('id=checkout');
    await checkoutButton.click();

    await expect(page).toHaveURL('/checkout-step-one.html');
    await page.locator('id=first-name').fill("Test");
    await page.locator('id=last-name').fill("Test");
    await page.locator('id=postal-code').fill("12345");
    let continueButton = page.locator('id=continue');
    await continueButton.click();
    await expect(page).toHaveURL('/checkout-step-two.html');

    await expect(page.locator('.summary_subtotal_label')).toBeVisible();
    await expect(page.locator('.summary_tax_label')).toBeVisible();
    await expect(page.locator('.summary_total_label')).toBeVisible();

    let itemTotalText = (await page.locator('.summary_subtotal_label').textContent()) || '';
    let taxText = (await page.locator('.summary_tax_label').textContent()) || '';
    let totalText = (await page.locator('.summary_total_label').textContent()) || '';

    itemTotalText = itemTotalText.trim();
    taxText = taxText.trim();
    totalText = totalText.trim();

    let itemTotal = parseFloat(itemTotalText.split('$')[1]);
    let tax = parseFloat(taxText.split('$')[1]);
    let total = parseFloat(totalText.split('$')[1]);

    expect(itemTotal + tax).toBe(total);
});

// 13. Checkout Step One: Cancel
test("Checkout Step One: Cancel", async ({ page }) => {
    await login_standard_user(page);
    await page.goto('/inventory.html');

    let firstElementAddToCart = page.locator("id=add-to-cart-sauce-labs-backpack");
    await firstElementAddToCart.click();

    let cartBadge = page.locator(".shopping_cart_badge");
    await expect(cartBadge).toHaveText("1");
    await cartBadge.click();

    await expect(page).toHaveURL('/cart.html');
    let checkoutButton = page.locator('id=checkout');
    await checkoutButton.click();

    await expect(page).toHaveURL('/checkout-step-one.html');
    let cancelButton = page.locator('id=cancel');
    await cancelButton.click();

    await expect(page).toHaveURL('/cart.html');
    await expect(page.locator('.cart_item')).toHaveCount(1);
});

// 14. Checkout lõpuni
test("Checkout lõpuni", async ({ page }) => {
    await login_standard_user(page);
    await page.goto('/inventory.html');

    let firstElementAddToCart = page.locator("id=add-to-cart-sauce-labs-backpack");
    await firstElementAddToCart.click();

    let cartBadge = page.locator(".shopping_cart_badge");
    await expect(cartBadge).toHaveText("1");
    await cartBadge.click();

    await expect(page).toHaveURL('/cart.html');
    let checkoutButton = page.locator('id=checkout');
    await checkoutButton.click();

    await expect(page).toHaveURL('/checkout-step-one.html');
    await page.locator('id=first-name').fill("Test");
    await page.locator('id=last-name').fill("Test");
    await page.locator('id=postal-code').fill("12345");
    let continueButton = page.locator('id=continue');
    await continueButton.click();
    await expect(page).toHaveURL('/checkout-step-two.html');

    let finishButton = page.locator('id=finish');
    await finishButton.click();
    await expect(page).toHaveURL('/checkout-complete.html');
    await expect(page.locator('.complete-header')).toHaveText("Thank you for your order!");
});

// 15. Burger-menüü: All Items, About, Reset App State
test("Burger-menüü: All Items, About, Reset App State", async ({ page }) => {
    await login_standard_user(page);
    await expect(page).toHaveURL('/inventory.html');

    let burgerMenuButton = page.locator("id=react-burger-menu-btn");
    await expect(burgerMenuButton).toBeVisible();
    await burgerMenuButton.click();

    let burgerItems = page.locator('.bm-item-list .bm-item.menu-item');
    await expect(burgerItems).toHaveCount(4);
    await expect(burgerItems).toContainText([
        'All Items',
        'About',
        'Logout',
        'Reset App State',
    ]);

    // All Items link
    await page.locator("id=add-to-cart-sauce-labs-backpack").click();
    let cartBadge = page.locator(".shopping_cart_badge");
    await cartBadge.click();
    await expect(page).toHaveURL('/cart.html');
    await burgerMenuButton.click();
    let allItemsLink = page.locator("id=inventory_sidebar_link");
    await allItemsLink.click();
    await expect(page).toHaveURL('/inventory.html');

    // About
    var removeButton = page.locator('id=remove-sauce-labs-backpack');
    await removeButton.click();
    await expect(page.locator(".shopping_cart_badge")).not.toBeVisible();
    await burgerMenuButton.click();
    let aboutLink = page.locator("id=about_sidebar_link");
    await aboutLink.click();
    await expect(page).toHaveURL('https://saucelabs.com/');
    await page.goBack();

    // Logout
    await expect(page).toHaveURL('/inventory.html');
    await burgerMenuButton.click();
    let logoutLink = page.locator("id=logout_sidebar_link");
    await logoutLink.click();
    await expect(page).toHaveURL('/');
    await login_standard_user(page);
    await expect(page).toHaveURL('/inventory.html');

    // Reset App State
    let firstElementAddToCart = page.locator("id=add-to-cart-sauce-labs-backpack");
    await firstElementAddToCart.click();
    await expect(cartBadge).toHaveText("1");
    await burgerMenuButton.click();
    let resetButton = page.locator("id=reset_sidebar_link");
    await resetButton.click();
    await expect(page.locator(".shopping_cart_badge")).not.toBeVisible();
    // Ostukovi badge kaob, aga Remove nupp mitte, sellepärast on vaja lehe värskendama
    await page.reload();
    let allButtons = page.locator('button');
    let removeButtonsCount = await allButtons.filter({ hasText: 'Remove' }).count();
    expect(removeButtonsCount).toBe(0);
});