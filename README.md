# DKO — Digitální kontrola objektů

[English version](#english)

Offline-first Android aplikace pro technické kontroly nemovitostí. DKO spojuje
kontrolní formulář, dokumentaci závad, podpis a výsledný protokol do jednoho
dohledatelného pracovního postupu.

[Otevřít webový náhled](https://maxmilianbaron.github.io/DKO/) ·
[Mobilní náhled 1:1](https://maxmilianbaron.github.io/DKO/?mobile=1)

## Aktuální verze V84

- 48 kontrolních položek v devíti odborných sekcích
- průběžné lokální ukládání rozpracované kontroly
- fotografie ze systémového fotoaparátu nebo galerie, náhled a označení závady
- třístupňové focení měřidla: OCR odečtu, OCR výrobního čísla a celkový snímek
- textové a hlasem diktované poznámky; zvukový záznam se neukládá
- samostatná video dokumentace s přehráním, stažením a sdílením
- automatická archivace po podpisu a okamžitý náhled kompletního PDF
- tisk, stažení a sdílení výsledného protokolu
- jednotná role Technik, trvalé přihlášení a předvídatelná navigace o jeden krok

Video dokumentace není součástí PDF. Je vedena samostatně s objektem, datem,
časem, technikem a poznámkou.

## Technologie

Produkční aplikace používá Kotlin, Jetpack Compose, Room, CameraX a OCR.
Veřejný náhled je samostatná statická prezentace bez produkčního zdrojového
kódu, APK a zákaznických dat.

## Lokální spuštění náhledu

```powershell
node scripts/serve-demo.mjs 4174
```

Poté otevřete `http://127.0.0.1:4174/`.

## Ověření

```powershell
node --check app.js
node --check scripts/verify-demo.mjs
node scripts/verify-demo.mjs
```

Repozitář obsahuje pouze demonstrační data a veřejně licencované podklady.
Neobsahuje produkční APK, podpisové klíče, databáze ani dokumentaci zákazníků.

## English

DKO is an offline-first Android application for structured property
inspections. It combines inspection checklists, defect evidence, meter OCR,
signatures, video documentation, and auditable PDF reports in one field
workflow.

The V84 public preview mirrors the current navigation and feature set using
demonstration data. Production source code, APK files, signing material,
customer databases, and customer documentation are not included.

[Open the web preview](https://maxmilianbaron.github.io/DKO/) ·
[Open the 1:1 mobile preview](https://maxmilianbaron.github.io/DKO/?mobile=1)
