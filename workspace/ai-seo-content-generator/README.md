# AI SEO Content Generator MVP

## Commercial Reference
- **Platform**: Malt (Commercial Freelance Offer)
- **Job Title**: Consultant SEO GenAI & Web Automation Developer
- **Estimated TJM (Daily Rate)**: 500€ - 700€ / jour
- **Market Context**: Content agencies and e-commerce stores requiring real-time keyword density optimization, automated meta tag creation, and structured outline generation.

## Architecture & Performance
- **Debounced Input Analysis**: 200ms input debouncing prevents UI lag during rapid keypresses in the content editor.
- **O(N) Token Frequency Map**: Single-pass string split and hash map count for instant keyword density computation.
