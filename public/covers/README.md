# Project covers

Local optimized WebP assets, referenced by `cover` in
`src/content/projects.ts`. Each has a localized `coverAlt` description.
The shared cover component preserves the complete image in every layout.

| Asset | Content |
| --- | --- |
| `ti-hub-redacted.webp` | Issue reporting form, based on `TI-HUB.png`; company branding concealed |
| `attendance-redacted.webp` | Personal time clock, based on `Attendance.png`; identity, attendance and session data concealed |
| `maintenance-redacted.webp` | Work order form, based on `Portal_Mantenimiento.png`; company and personal data concealed |
| `marketplace.webp` | Storefront at https://pimsa-marketplace.vercel.app/ |
| `meetscribe.webp` | Real application preview with its scripted demo meeting |
| `password-vault.webp` | Editorial illustration of a vault and key |
| `woodland-setup.webp` | Public homepage at https://woodland-setup.vercel.app/ |
| `dnd-companion.webp` | Local application with its included example character |

Screenshots captured on 18 September 2026. The three internal application
covers use opaque redactions baked into the image. Local application previews
use bundled example data. WebP exports omit source metadata.

Unedited source captures and previous covers are kept under
`.local/project-captures/`, outside `public` and excluded from Git.
Place future internal source captures there; only reviewed, redacted exports
belong in this directory.
