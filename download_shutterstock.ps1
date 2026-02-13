$targetDir = "public/exercises"
$ua = "Mozilla/5.0"

$clips = @(
    @{ name = "Mountain-Climber"; id = "1110593615" },
    @{ name = "Skull-Crusher"; id = "1109065405" },
    @{ name = "Leg-Press"; id = "1042908592" },
    @{ name = "Barbell-Preacher-Curl"; id = "1109800781" }
)

foreach ($clip in $clips) {
    $id = $clip.id
    $name = $clip.name
    $dest = Join-Path $targetDir "$name.mp4"
    
    # Try common Shutterstock preview patterns
    $testUrls = @(
        "https://ak.picdn.net/shutterstock/videos/$id/preview/stock-footage-preview.mp4",
        "https://ak.picdn.net/shutterstock/videos/$id/preview/stock-footage-$($name.ToLower()).mp4"
    )
    
    foreach ($url in $testUrls) {
        Write-Host "Trying $url..."
        try {
            $resp = Invoke-WebRequest -Uri $url -Method Head -UserAgent $ua -ErrorAction SilentlyContinue
            if ($resp.StatusCode -eq 200) {
                Write-Host "Found! Downloading to $dest..."
                Invoke-WebRequest -Uri $url -OutFile $dest -UserAgent $ua
                break
            }
        }
        catch {}
    }
}
