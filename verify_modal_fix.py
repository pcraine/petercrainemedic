import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        # Larger viewport
        context = await browser.new_context(viewport={'width': 1280, 'height': 1200})
        page = await context.new_page()

        page.on("console", lambda msg: print(f"CONSOLE: [{msg.type}] {msg.text}"))
        page.on("pageerror", lambda exc: print(f"PAGE ERROR: {exc}"))

        print("Navigating to site...")
        await page.goto('http://localhost:8080')
        await asyncio.sleep(2)

        print("Attempting to open Medic modal...")
        # They are buttons, not anchors
        medic_btn = page.locator("button#nav-medic")
        await medic_btn.click()
        await asyncio.sleep(1)

        print("Checking if modal is open...")
        overlay = page.locator("#access-overlay")
        is_visible = await overlay.is_visible()
        print(f"Modal visible: {is_visible}")

        await page.screenshot(path="verification/modal_full_v3.png")

        # Try to click the close button
        print("Attempting to close modal...")
        try:
            close_btn = page.locator(".access-close")
            # Using dispatch_event or click with force=True if it's "outside viewport" according to Playwright
            # but usually scroll_into_view_if_needed + click works if it's actually there.
            await close_btn.scroll_into_view_if_needed()
            await close_btn.click(timeout=5000)
            print("Modal closed successfully")
        except Exception as e:
            print(f"Failed to close modal: {e}")
            await page.screenshot(path="verification/modal_error_v3.png")

        # Now test Journal filters
        print("Navigating to Journal...")
        await page.locator("button#nav-journal").click()
        await asyncio.sleep(1)

        print("Checking Journal Filter Counts...")
        # Check if filter counts are updated (not 0)
        filter_count = await page.locator(".filter-btn .count").first.text_content()
        print(f"First filter count: {filter_count}")

        # Click a filter
        print("Clicking 'Clinical' filter...")
        clinical_filter = page.locator("button.filter-btn:has-text('Clinical')")
        await clinical_filter.click()
        await asyncio.sleep(1)

        await page.screenshot(path="verification/journal_filtered.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
