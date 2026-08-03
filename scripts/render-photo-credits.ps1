param(
    [string]$ManifestPath = (Join-Path $PSScriptRoot '..\docs\photo-sources.json'),
    [string]$OutputPath = (Join-Path $PSScriptRoot '..\docs\demo-assets.md')
)

$photos = Get-Content $ManifestPath -Raw | ConvertFrom-Json
$lines = [System.Collections.Generic.List[string]]::new()
$lines.Add('# Zdroje reálných fotografií v demu')
$lines.Add('')
$lines.Add('Každá ze 48 aktivních kontrolních položek má vlastní skutečnou ilustrační fotografii. Snímky nepocházejí od zákazníka ani z reálné kontroly DKO; byly vyhledány přes [Openverse](https://openverse.org/) ve veřejné sbírce Flickr.')
$lines.Add('')
$lines.Add('Demo používá pouze fotografie dostupné pod licencí CC0, CC BY nebo CC BY-SA. Obrázky byly pro náhled oříznuty na poměr 4:3, zmenšeny na 960 × 720 px a převedeny do WebP. Autor, licence a původní stránka zůstávají uvedené níže.')
$lines.Add('')
$lines.Add('| # | Kontrolní položka | Původní fotografie | Autor | Licence |')
$lines.Add('| -: | --- | --- | --- | --- |')
foreach ($photo in $photos) {
    $label = ([string]$photo.label).Replace('|','\|')
    $title = ([string]$photo.title).Replace('|','\|')
    $creator = ([string]$photo.creator).Replace('|','\|')
    if (-not $creator) { $creator = 'neuveden' }
    $license = switch (([string]$photo.license).ToLowerInvariant()) {
        'by' { 'CC BY' }
        'by-sa' { 'CC BY-SA' }
        'cc0' { 'CC0' }
        default { ([string]$photo.license).ToUpperInvariant() }
    }
    $lines.Add("| $($photo.number) | $label | [$title]($($photo.landingUrl)) | $creator | $license |")
}
$lines.Add('')
$lines.Add('Strojově čitelný manifest včetně původních obrazových URL a vyhledávacích dotazů je v souboru [`photo-sources.json`](photo-sources.json).')

$lines | Set-Content -Path $OutputPath -Encoding utf8
