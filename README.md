# DKO — Digitální kontrola objektů · interaktivní demo

**English version:** [jump to the English section](#english)

## Česky

Interaktivní veřejná ukázka DKO, offline Android aplikace pro terénní kontroly
budov, fotodokumentaci, auditovatelné revize a tvorbu tiskových PDF protokolů.

Repozitář je během přípravy privátní. GitHub Pages se zapne až po obsahovém a
vizuálním schválení dema.

### Lokální náhled

```powershell
py -m http.server 4174 --bind 127.0.0.1
```

Potom otevřít:

```text
http://127.0.0.1:4174/
```

### Náhledy

<table>
  <tr>
    <td><strong>Přihlášení technika nebo Admina</strong><br><img src="docs/screenshots/01-login.png" alt="Přihlášení do DKO" width="420"></td>
    <td><strong>Objekty a rozpracovaná kontrola</strong><br><img src="docs/screenshots/02-technician-work.png" alt="Práce technika" width="420"></td>
  </tr>
  <tr>
    <td><strong>Přehled kontrolních sekcí</strong><br><img src="docs/screenshots/03-inspection-sections.png" alt="Přehled sekcí kontroly" width="420"></td>
    <td><strong>Fotografie a červené označení závady</strong><br><img src="docs/screenshots/04-photo-markup.png" alt="Označení závady do fotografie" width="420"></td>
  </tr>
  <tr>
    <td><strong>Historie a auditovatelné dokumenty</strong><br><img src="docs/screenshots/05-history.png" alt="Historie protokolů" width="420"></td>
    <td><strong>Náhled výsledného PDF</strong><br><img src="docs/screenshots/06-pdf-preview.png" alt="Náhled PDF protokolu" width="420"></td>
  </tr>
  <tr>
    <td><strong>Lokální Admin nastavení</strong><br><img src="docs/screenshots/07-admin.png" alt="Admin nastavení" width="420"></td>
    <td><strong>Mobilní fotografický editor</strong><br><img src="docs/screenshots/08-mobile-photo-markup.png" alt="Mobilní editor fotografie" width="220"></td>
  </tr>
</table>

### Co lze v demu vyzkoušet

- přihlášení do role `Technik` nebo `Admin` bez skutečného hesla
- pokračování rozpracované kontroly a výběr objektu podle termínu
- přehled devíti sekcí a přechod na jednotlivé kontrolní položky
- stavy v pořádku / závada, samostatné poznámky a fotografie
- hromadné označení dosud nevyplněných položek v sekci
- výběr jedné ze čtyř syntetických fotografií objektu
- kreslení červeného označení do fotografie, krok zpět a vymazání
- uložení označené pracovní kopie a zachování výchozího snímku
- upozornění na nehotové položky, elektronický podpis a dokončení
- historii, vytvoření opravy jako nové revize a náhled dokumentů
- dvoustránkový protokol A4 na šířku a fotolist 4× A6
- Admin přehled účtů, domů, seznamu položek, zálohy, tisku a integrity
- světlý i tmavý vzhled odpovídající systémovému motivu Androidu

### Vztah dema k produkční aplikaci

Vzhled, názvy obrazovek a hlavní pracovní tok vycházejí ze skutečné Android
aplikace DKO. Toto demo je však samostatná statická implementace v HTML, CSS a
JavaScriptu. Nejde o APK ani o zdrojový kód produkční aplikace.

Skutečná aplikace používá Kotlin, Jetpack Compose, Room/SQLite a CameraX. Data,
fotografie, PDF a šifrované zálohy zůstávají lokálně v telefonu. Produkční role,
hesla, integrita souborů a auditní pravidla jsou vynucované nativní aplikací.

### Demo data a fotografie

Veškeré osoby, adresy, čísla protokolů, odpovědi, podpisy a dokumenty jsou
smyšlené. Čtyři ukázkové fotografie byly nově vytvořené výhradně pro toto demo
a nepocházejí z žádné zákaznické kontroly.

Rychlá navigace v levém panelu slouží pouze pro prezentaci. Při běžném průchodu
lze stejnými obrazovkami projít přímo uvnitř telefonu.

### Hranice repozitáře

Toto demo záměrně neobsahuje:

- produkční Android zdrojový kód nebo APK
- signing klíče, certifikáty, hesla, PINy nebo servisní reset
- databáze, zálohy, logy, MCP nebo interní testovací artefakty
- skutečné zákaznické adresy, kontakty, fotografie, podpisy nebo PDF
- původní zákaznické formuláře a neveřejné nasazovací materiály

Podrobná hranice je v [docs/demo-boundary.md](docs/demo-boundary.md).

### Ověření

Při spuštěném lokálním serveru:

```powershell
node --check app.js
node scripts/verify-demo.mjs
node scripts/capture-screenshots.mjs
```

Automatizovaný scénář ověřuje technický průchod, kreslení do fotografie,
podpis, PDF, Admin část, obrázky a horizontální přetečení stránky.

Všechna práva vyhrazena Aardvarkland Inc.

## English

Interactive showcase of DKO, an offline Android application for field building
inspections, photo documentation, auditable revisions, and printable PDF
reports.

The repository remains private while the showcase is being reviewed. GitHub
Pages will be enabled only after content and visual approval.

### Local preview

```powershell
py -m http.server 4174 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4174/`.

### What the demo supports

- presentation-only Technician and Admin role selection
- due buildings and a recoverable in-progress inspection
- nine inspection sections and individual checklist items
- good/defect answers, item notes, and multiple photos
- synthetic inspection photo selection
- real pointer or touch drawing with red defect markup
- undo, clear, rotate, description, and saving a marked working copy
- incomplete-item warning, electronic signature, and completion
- history, auditable revision creation, and document previews
- two landscape A4 protocol pages and a 4× A6 photo sheet
- local Admin areas for accounts, buildings, forms, backup, print, and integrity
- light and dark presentation matching Android system themes

### Production relationship

The visual language, screen names, and main journey are based on the real DKO
Android application. This repository contains a separate static HTML/CSS/JS
showcase, not the production APK or production source tree.

The native product uses Kotlin, Jetpack Compose, Room/SQLite, and CameraX. Its
data, photos, PDFs, and encrypted backups remain local to the Android device.

### Safe demo boundary

All people, addresses, protocol identifiers, answers, signatures, and documents
are fictional. The four building inspection photos were created specifically
for this showcase and do not come from customer work.

This repository intentionally excludes production code, APKs, credentials,
signing material, databases, backups, customer data, customer photos, and
private deployment evidence.

All rights reserved by Aardvarkland Inc.
