# 08_guide — upload these two to Google Drive (view-only)

1. `kie-connect-guide.pdf` — 8 pages. Dark cover, why-I-wrote-this, six steps with annotated screenshots, who it is for, dated caveat, signature.
2. `higgsfield-vs-kie-comparison.pdf` — 4 pages. Cover, three-door cards + linked price table, how-you-pay table + "a month like mine", fine print.

Before uploading (optional): steps 2 and 3 show Kie's sign-in modal because those pages are login-gated. To show the logged-in view, screenshot Billing → Add credits and API Keys → Create New Key on your account (blur key and balance), save as `screens/03-kie-billing.png` and `screens/02-kie-api-key.png`, then run `./make-pdf.sh`.

Edit wording in the `.html` files; the look lives in `style.css`. The same format is saved as the `/henry-guide-pdf` skill for future guides.
