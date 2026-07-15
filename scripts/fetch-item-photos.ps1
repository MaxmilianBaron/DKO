param(
    [string]$OutputDirectory = (Join-Path $PSScriptRoot '..\assets\photos\items'),
    [string]$ManifestPath = (Join-Path $PSScriptRoot '..\docs\photo-sources.json')
)

$ErrorActionPreference = 'Stop'

$items = @(
    @{ Key='outside.house_number'; Label='Tabulka s č. p.'; Query='house number' },
    @{ Key='outside.orientation_number'; Label='Tabulka s č. o.'; Query='street number sign'; Fallback='house numbers' },
    @{ Key='outside.snp2_board'; Label='Informační tabulka SNP2'; Query='information board' },
    @{ Key='outside.cleaning_company_board'; Label='Informační tabulka úklidové firmy'; Query='notice board' },
    @{ Key='inside.sf_contacts'; Label='Kontakty SF'; Query='notice board' },
    @{ Key='inside.sf_notice'; Label='Oznámení SF v nástěnce'; Query='notice board' },
    @{ Key='inside.boiler_contact'; Label='Kontakt – kotelna'; Query='boiler room'; Fallback='boiler room equipment' },
    @{ Key='inside.cleaning_record'; Label='Záznam o úklidu'; Query='cleaning schedule'; Fallback='checklist clipboard' },
    @{ Key='exterior.street_facade'; Label='Fasáda uliční'; Query='apartment facade' },
    @{ Key='exterior.yard_facade'; Label='Fasáda dvorní'; Query='courtyard facade'; Fallback='courtyard building' },
    @{ Key='exterior.cultural_objects'; Label='Kulturní předměty (pamětní desky, busty...)'; Query='memorial plaque close up' },
    @{ Key='exterior.street_windows'; Label='Okna uliční'; Query='apartment windows' },
    @{ Key='exterior.yard_windows'; Label='Okna dvorní'; Query='courtyard windows' },
    @{ Key='exterior.entrance_doors'; Label='Vchodové dveře (zámek, zavírač, nátěr)'; Query='entrance door' },
    @{ Key='exterior.yard_doors'; Label='Dveře do dvora (zámek, zavírač, nátěr)'; Query='courtyard door' },
    @{ Key='exterior.common_doors'; Label='Dveře do společných prostor'; Query='hallway doors'; Skip=2 },
    @{ Key='exterior.intercom'; Label='Zvonky, domácí telefony'; Query='door intercom'; Fallback='doorbell' },
    @{ Key='exterior.roof'; Label='Střecha'; Query='roof shingles'; Skip=3 },
    @{ Key='exterior.bird_protection'; Label='Ochrana proti ptactvu'; Query='bird spikes'; Fallback='pigeon spikes' },
    @{ Key='exterior.drainage'; Label='Dešťové svody, gajgry, hromosvod'; Query='building downspout'; Fallback='rain gutter' },
    @{ Key='waste.location_condition'; Label='Umístění popelnic / stav'; Query='waste bins'; Fallback='garbage containers' },
    @{ Key='waste.flats'; Label='Počet popelnic – byty'; Query='garbage bins'; Fallback='trash bins' },
    @{ Key='waste.sorted'; Label='Počet nádob – tříděný odpad'; Query='recycling containers' },
    @{ Key='waste.non_residential'; Label='Počet popelnic – nebyty'; Query='commercial dumpster'; Skip=2 },
    @{ Key='waste.surroundings'; Label='Okolí popelnic'; Query='litter waste bins'; Fallback='garbage litter' },
    @{ Key='common.mat'; Label='Rohožka'; Query='entrance doormat'; Skip=2 },
    @{ Key='common.mailboxes'; Label='Poštovní schránky'; Query='mail boxes'; Skip=4 },
    @{ Key='common.paint'; Label='Malba'; Query='painted wall interior' },
    @{ Key='common.stairs'; Label='Schody'; Query='apartment stairs' },
    @{ Key='common.railings'; Label='Zábradlí'; Query='stair handrail' },
    @{ Key='common.attic'; Label='Půda'; Query='attic interior' },
    @{ Key='common.cellars'; Label='Sklepy'; Query='basement interior'; Fallback='cellar' },
    @{ Key='yard.condition'; Label='Stav dvora'; Query='apartment courtyard' },
    @{ Key='yard.technical'; Label='Technický stav (povrch, dlažba, vlhkost)'; Query='cracked paving'; Fallback='damaged pavement' },
    @{ Key='yard.greenery'; Label='Stav zeleně'; Query='garden greenery' },
    @{ Key='yard.buildings'; Label='Stavby na dvoře (garáže, NB)'; Query='garage courtyard'; Skip=1 },
    @{ Key='lighting.switches'; Label='Vypínače ve všech patrech'; Query='wall light switch' },
    @{ Key='lighting.lights'; Label='Světla ve všech patrech'; Query='corridor light'; Skip=1 },
    @{ Key='lighting.covers'; Label='Kryty na světlech ve všech patrech'; Query='ceiling light fixture'; Fallback='ceiling lamp' },
    @{ Key='lighting.cellar_a'; Label='Sklep – osvětlení I'; Query='basement light fixture' },
    @{ Key='lighting.cellar_b'; Label='Sklep – osvětlení II'; Query='cellar light'; Fallback='basement light bulb' },
    @{ Key='lighting.distribution_boards'; Label='Elektrické rozvaděče, zámky'; Query='electrical panel' },
    @{ Key='other.cleaning'; Label='Úklid (zábradlí, prach, okna, odložený odpad, podlahy)'; Query='mopping floor'; Fallback='cleaning floor' },
    @{ Key='other.notes'; Label='Poznámky'; Query='inspection clipboard'; Fallback='clipboard checklist' },
    @{ Key='meters.water_1'; Label='Vodoměr 1'; Query='water meter'; Skip=1 },
    @{ Key='meters.water_2'; Label='Vodoměr 2'; Query='water meter pipes' },
    @{ Key='meters.electricity_1'; Label='Elektroměr 1'; Query='electricity meter' },
    @{ Key='meters.electricity_2'; Label='Elektroměr 2'; Query='electric meter cabinet'; Fallback='electricity meter' }
)

New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
$temporaryDirectory = Join-Path ([System.IO.Path]::GetTempPath()) ('dko-photo-import-' + [guid]::NewGuid())
New-Item -ItemType Directory -Force -Path $temporaryDirectory | Out-Null
$usedUrls = [System.Collections.Generic.HashSet[string]]::new()
$manifest = [System.Collections.Generic.List[object]]::new()

try {
    for ($index = 0; $index -lt $items.Count; $index++) {
        $item = $items[$index]
        $number = $index + 1
        Write-Host ("[{0:D2}/48] {1}" -f $number, $item.Label)
        $selected = $null
        $queries = @($item.Query)
        if ($item.Fallback) { $queries += $item.Fallback }
        foreach ($queryText in $queries) {
            $query = [uri]::EscapeDataString($queryText)
            $apiUrl = "https://api.openverse.org/v1/images/?q=$query&license=cc0,by,by-sa&source=flickr&page_size=20"
            $response = Invoke-RestMethod -Uri $apiUrl -Headers @{ 'User-Agent'='DKO-Demo/1.0 (public preview asset audit)' }
            $candidates = $response.results | Where-Object {
                $_.url -match '^https://live\.staticflickr\.com/' -and
                $_.url -match '\.(jpe?g|png)(\?|$)' -and
                [int]$_.width -ge 600 -and [int]$_.height -ge 400 -and
                -not $usedUrls.Contains([string]$_.url)
            }
            if ($item.Skip) { $candidates = @($candidates) | Select-Object -Skip ([int]$item.Skip) }
            foreach ($candidate in $candidates) {
                $sourcePath = Join-Path $temporaryDirectory ("source-{0:D2}" -f $number)
                try {
                    Invoke-WebRequest -Uri $candidate.url -OutFile $sourcePath -Headers @{ 'User-Agent'='DKO-Demo/1.0 (public preview asset audit)' } -TimeoutSec 40
                    $outputPath = Join-Path $OutputDirectory ("item-{0:D2}.webp" -f $number)
                    & ffmpeg -hide_banner -loglevel error -y -i $sourcePath -vf "scale=960:720:force_original_aspect_ratio=increase,crop=960:720" -frames:v 1 -c:v libwebp -quality 82 $outputPath
                    if ($LASTEXITCODE -eq 0 -and (Test-Path $outputPath) -and (Get-Item $outputPath).Length -gt 10000) {
                        $selected = $candidate
                        [void]$usedUrls.Add([string]$candidate.url)
                        break
                    }
                } catch {
                    Write-Warning ("Candidate failed: {0} ({1})" -f $candidate.url, $_.Exception.Message)
                } finally {
                    Remove-Item -LiteralPath $sourcePath -Force -ErrorAction SilentlyContinue
                }
            }
            if ($selected) { break }
        }

        if (-not $selected) { throw "No usable CC0/PDM photograph found for $($item.Key)." }
        $manifest.Add([pscustomobject]@{
            number = $number
            key = $item.Key
            label = $item.Label
            query = $item.Query
            file = "assets/photos/items/item-{0:D2}.webp" -f $number
            title = $selected.title
            creator = $selected.creator
            license = [string]$selected.license
            source = $selected.source
            landingUrl = $selected.foreign_landing_url
            originalUrl = $selected.url
        })
    }

    $manifest | ConvertTo-Json -Depth 4 | Set-Content -Path $ManifestPath -Encoding utf8
} finally {
    if (Test-Path $temporaryDirectory) { Remove-Item -LiteralPath $temporaryDirectory -Recurse -Force }
}

Write-Host "Downloaded $($manifest.Count) real photographs. Manifest: $ManifestPath"
