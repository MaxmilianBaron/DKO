# DKO — Digitální kontrola objektů · interaktivní demo

## ▶ Spustit interaktivní preview aplikace

[![Otevřít DKO v GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/MaxmilianBaron/DKO?quickstart=1)

**[Otevřít skutečné mobilní demo DKO](https://codespaces.new/MaxmilianBaron/DKO?quickstart=1)**

Protože je repozitář zatím privátní, preview se otevře přihlášeným uživatelům
s přístupem k DKO v privátním GitHub Codespace. Po vytvoření prostředí se
aplikace sama spustí a otevře v náhledu prohlížeče; není potřeba zadávat žádný
příkaz.

## Stav GitHub Pages

Demo je nyní součástí jediného repozitáře `MaxmilianBaron/DKO`, stejně jako u
WMS. Současný tarif nepovoluje GitHub Pages z privátního repozitáře. Po
budoucím zveřejnění bude veřejná adresa:

```text
https://maxmilianbaron.github.io/DKO/
```

Na telefonu se demo otevře přes celou obrazovku jako mobilní aplikace. Na
počítači zůstane skutečné mobilní rozhraní uvnitř rámečku telefonu.

**English version:** [jump to the English section](#english)

## Česky

Interaktivní ukázka DKO, offline Android aplikace pro terénní kontroly
budov, fotodokumentaci, auditovatelné revize a tvorbu tiskových PDF protokolů.

Jediný repozitář nyní obsahuje bezpečné statické demo, jeho dokumentaci i
připravený Pages workflow. Demo obsahuje výhradně smyšlená data a veřejně
licencované ilustrační fotografie, nikoli zákaznickou dokumentaci.

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
    <td><strong>První A4 protokolu – 28 položek</strong><br><img src="docs/screenshots/06-pdf-preview.png" alt="První strana PDF protokolu" width="420"></td>
  </tr>
  <tr>
    <td><strong>Druhá A4 protokolu – 20 položek</strong><br><img src="docs/screenshots/06b-pdf-preview-page-2.png" alt="Druhá strana PDF protokolu" width="420"></td>
    <td><strong>Fotodokumentace 4× A6</strong><br><img src="docs/screenshots/06c-photo-sheet-preview.png" alt="Fotolist se čtyřmi oblastmi A6" width="420"></td>
  </tr>
  <tr>
    <td><strong>Lokální Admin nastavení</strong><br><img src="docs/screenshots/07-admin.png" alt="Admin nastavení" width="420"></td>
    <td><strong>Mobilní fotografický editor</strong><br><img src="docs/screenshots/09-mobile-photo-markup.png" alt="Mobilní editor fotografie" width="220"></td>
  </tr>
  <tr>
    <td><strong>Mobilní zobrazení aplikace 1:1</strong><br><img src="docs/screenshots/08-mobile-login-1to1.png" alt="Mobilní přihlášení DKO přes celou obrazovku" width="220"></td>
    <td><strong>48 reálných ilustračních fotografií</strong><br><img src="docs/screenshots/10-mobile-real-photo-library.png" alt="Knihovna 48 reálných veřejně licencovaných fotografií" width="220"></td>
  </tr>
</table>

### Co lze v demu vyzkoušet

- přihlášení do role `Technik` nebo `Admin` s ukázkovým heslem `demo`
- pokračování rozpracované kontroly a výběr objektu podle termínu
- přehled devíti sekcí a všech 48 aktivních kontrolních položek podle skutečné šablony
- stavy v pořádku / závada, samostatné poznámky a fotografie
- hromadné označení dosud nevyplněných položek v sekci
- vlastní skutečná ilustrační fotografie u každé ze 48 kontrolních položek
- výběr libovolného z 48 snímků v editoru fotografie
- kreslení červeného označení do fotografie, krok zpět a vymazání
- uložení označené pracovní kopie a zachování výchozího snímku
- upozornění na nehotové položky, elektronický podpis a dokončení
- historii, vytvoření opravy jako nové revize a náhled dokumentů
- přesné dvě A4 protokolu na šířku se všemi 48 položkami (28 + 20)
- dvanáct A4 fotolistů na výšku, každý se čtyřmi samostatnými oblastmi A6
- samostatný Protokol, Fotodokumentaci a kompletní 14stránkový dokument
- Admin přehled účtů, domů, seznamu položek, zálohy, tisku a integrity
- světlý i tmavý vzhled odpovídající systémovému motivu Androidu
- mobilní zobrazení přes celou obrazovku a možnost instalace jako webové aplikace

### Vztah dema k produkční aplikaci

Vzhled, názvy obrazovek a hlavní pracovní tok vycházejí ze skutečné Android
aplikace DKO. Toto demo je však samostatná statická implementace v HTML, CSS a
JavaScriptu. Nejde o APK ani o zdrojový kód produkční aplikace.

Skutečná aplikace používá Kotlin, Jetpack Compose, Room/SQLite a CameraX. Data,
fotografie, PDF a šifrované zálohy zůstávají lokálně v telefonu. Produkční role,
hesla, integrita souborů a auditní pravidla jsou vynucované nativní aplikací.

### Demo data a fotografie

Veškeré osoby, adresy, čísla protokolů, odpovědi, podpisy a dokumenty jsou
smyšlené. Všech 48 skutečných ilustračních fotografií pochází z veřejných zdrojů
s licencí CC0, CC BY nebo CC BY-SA a nepochází z žádné zákaznické kontroly. Autoři, původní odkazy a
provedené úpravy jsou uvedené v [docs/demo-assets.md](docs/demo-assets.md).

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
podpis, přesné pokrytí 48 položek na dvou stranách PDF, všechny fotolisty,
Admin část, obrázky a horizontální přetečení stránky.

Všechna práva vyhrazena Aardvarkland Inc.

## English

### ▶ Launch the interactive application preview

[![Open DKO in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/MaxmilianBaron/DKO?quickstart=1)

The private preview is available to signed-in users who have access to DKO.
The Codespace starts the static application automatically and opens its browser
preview without requiring a command.

The demo now lives in the single private `MaxmilianBaron/DKO` repository, using
the same one-repository structure as the WMS showcase. GitHub Pages will become
available at `https://maxmilianbaron.github.io/DKO/` after the repository is
made public.

On a phone, the demo fills the screen like the mobile application. On desktop,
the same real mobile interface remains presented inside a phone frame.

Interactive showcase of DKO, an offline Android application for field building
inspections, photo documentation, auditable revisions, and printable PDF
reports.

The repository is currently private. The showcase contains fictional data and
openly licensed illustrative photographs, not customer evidence.

### Local preview

```powershell
py -m http.server 4174 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4174/`.

### What the demo supports

- presentation-only Technician and Admin role selection
- due buildings and a recoverable in-progress inspection
- nine inspection sections and all 48 active checklist items from the real template
- good/defect answers, item notes, and multiple photos
- one real, publicly licensed illustrative photo for every one of the 48 items
- real pointer or touch drawing with red defect markup
- undo, clear, rotate, description, and saving a marked working copy
- incomplete-item warning, electronic signature, and completion
- history, auditable revision creation, and document previews
- two landscape A4 protocol pages containing all 48 items (28 + 20)
- twelve portrait A4 photo sheets with four separate A6 cards each
- separate protocol, photo-documentation, and complete 14-page previews
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
are fictional. The 48 real illustrative photos come from public CC0, CC BY, or CC BY-SA sources,
not customer work. Full credits and transformations are documented in
[docs/demo-assets.md](docs/demo-assets.md).

This repository intentionally excludes production code, APKs, credentials,
signing material, databases, backups, customer data, customer photos, and
private deployment evidence.

All rights reserved by Aardvarkland Inc.
