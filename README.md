# DKO — Digitální kontrola objektů

Offline-first Android aplikace pro technické kontroly nemovitostí. DKO spojuje
kontrolní formulář, dokumentaci závad, podpis a výsledný protokol do jednoho
dohledatelného pracovního postupu.

[Otevřít mobilní náhled 1:1](https://maxmilianbaron.github.io/DKO/)

## Aktuální verze V84

- 48 kontrolních položek v devíti odborných sekcích
- průběžné lokální ukládání rozpracované kontroly
- fotografie ze systémového fotoaparátu nebo galerie, náhled a označení závady
- třístupňové focení měřidla: OCR odečtu, OCR výrobního čísla a celkový snímek
- textové a hlasem diktované poznámky; zvukový záznam se neukládá
- samostatná video dokumentace s přehráním, stažením a sdílením
- automatická archivace po podpisu a okamžitý náhled kompletního PDF
- tisk, stažení a sdílení výsledného protokolu
- jednotná role Technik, trvalé přihlášení a navigace vždy o jeden krok zpět

Video dokumentace není součástí PDF. Je vedena samostatně s objektem, datem,
časem, technikem a poznámkou.

## Technologie

Produkční aplikace používá Kotlin, Jetpack Compose, Room, CameraX a OCR.
Veřejný náhled představuje aktuální mobilní rozhraní V84 v měřítku 1:1.
