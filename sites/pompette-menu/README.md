# Pompette. scan-and-order menu (design preview)

The page a customer opens after scanning a QR code at the counter or table. Same tokens, fonts and Higgsfield cone renders as the concept site.

## Run it
```
python3 -m http.server 5174 --directory "/Users/henrychua/Content Creation/pompette-menu"
```
Open http://localhost:5174/?table=4 (the `table` value shows in the header; leave it off for "Counter pickup"). Design for phones; on a desktop it sits in a 560px column.

## What it does
- Live open or closed status in Singapore time from the real hours.
- "On tap this week" rail, then the full list. Flavours not on tap show "Back soon".
- Tap a flavour: bottom sheet with cone or cup, toppings, quantity, live price.
- Order bar with count and total, order review with remove, pickup name (required), note.
- Confirmation with an order number and "pay at the counter".
- Keyboard and screen-reader friendly: native dialogs, labelled controls, live region for the cart.

## Edit each week
Top of `menu.js`: `ON_TAP` (the four flavours this week), `FLAVOURS` (price, note, colour), `TOPPINGS`.

## Not real yet
- **No backend.** "Place order" does not send anything; the order number is random. To go live, post the order to a small endpoint (a Google Sheet via Apps Script, Supabase, or a WhatsApp Business API sender) and show the number it returns.
- **Samples.** Topping names and prices, and cup vs cone pricing, are placeholders until Pompette confirms. Original $3 and flavours $5 come from a March 2026 review.
- Only Original has a cup render; other flavours show the cone in the sheet when "Cup" is chosen.
