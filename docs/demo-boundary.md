# Demo safety boundary

## Allowed content

- manually recreated user interface based on approved product behavior
- fictional Technician and Admin identities
- fictional Prague-style addresses and protocol identifiers
- synthetic answers, notes, signatures, PDF content, and building photos
- high-level public product architecture
- presentation-only shortcuts and simulated document actions

## Excluded content

- production Android source code and build configuration
- release, debug, TEST, or service APK packages
- signing keys, certificates, hashes, credentials, PINs, or reset paths
- Room databases, WAL/SHM files, backups, vault files, logs, or MCP evidence
- real customer names, addresses, contacts, photos, signatures, or reports
- customer branding, original customer forms, and private deployment material
- claims that browser simulation provides native persistence or security

## Publication gate

Before changing the repository from private to public:

1. Review every visible string and screenshot.
2. Confirm that the DKO product icon is approved for public presentation.
3. Confirm that all photos are the generated demo assets in `assets/photos/`.
4. Search the repository for customer names, package files, databases, secrets,
   device identifiers, and absolute local paths.
5. Run `node scripts/verify-demo.mjs` against a local server.
6. Recapture screenshots and visually review every README image.
7. Enable GitHub Pages only after the repository visibility decision is final.
