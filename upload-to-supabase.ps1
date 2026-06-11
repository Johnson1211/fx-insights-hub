# ============================================================
# Fx Insights Hub - Upload Media to Supabase Storage
# Run this script AFTER adding your SUPABASE_SERVICE_KEY below
# ============================================================

# ---- CONFIGURATION ----
$PROJECT_REF = "jvxmtsmslyokplooyfwz"
$SUPABASE_URL = "https://$PROJECT_REF.supabase.co"
$BUCKET_NAME  = "media"

# PASTE YOUR SERVICE ROLE KEY HERE (from Supabase Dashboard > Settings > API > service_role)
$SERVICE_KEY  = "PASTE_YOUR_SERVICE_ROLE_KEY_HERE"

# Folder containing your media files
$MEDIA_FOLDER = "c:\Users\BIG-BENZ GRAFIX\Desktop\fxelite-pro\public\Videos_images"

# ---- STEP 1: Create the public bucket ----
Write-Host "`n[1/3] Creating storage bucket '$BUCKET_NAME'..." -ForegroundColor Cyan

$bucketBody = @{ id = $BUCKET_NAME; name = $BUCKET_NAME; public = $true } | ConvertTo-Json
$headers = @{
    "Authorization" = "Bearer $SERVICE_KEY"
    "apikey"        = $SERVICE_KEY
    "Content-Type"  = "application/json"
}

try {
    $resp = Invoke-RestMethod -Uri "$SUPABASE_URL/storage/v1/bucket" `
        -Method POST -Headers $headers -Body $bucketBody -ErrorAction Stop
    Write-Host "  Bucket created: $($resp.name)" -ForegroundColor Green
} catch {
    Write-Host "  Bucket may already exist (OK): $($_.Exception.Message)" -ForegroundColor Yellow
}

# ---- STEP 2: Upload all files ----
Write-Host "`n[2/3] Uploading files..." -ForegroundColor Cyan

$files = Get-ChildItem -Path $MEDIA_FOLDER -File
$uploaded = @{}

foreach ($file in $files) {
    $fileName = $file.Name
    $mimeType = switch ($file.Extension.ToLower()) {
        ".mp4"  { "video/mp4" }
        ".jpeg" { "image/jpeg" }
        ".jpg"  { "image/jpeg" }
        ".png"  { "image/png" }
        default { "application/octet-stream" }
    }

    Write-Host "  Uploading: $fileName ($([math]::Round($file.Length/1MB, 2)) MB)..." -NoNewline

    $uploadHeaders = @{
        "Authorization" = "Bearer $SERVICE_KEY"
        "apikey"        = $SERVICE_KEY
        "Content-Type"  = $mimeType
        "x-upsert"      = "true"
    }

    try {
        $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
        $resp = Invoke-RestMethod `
            -Uri "$SUPABASE_URL/storage/v1/object/$BUCKET_NAME/$([Uri]::EscapeDataString($fileName))" `
            -Method POST `
            -Headers $uploadHeaders `
            -Body $bytes `
            -ErrorAction Stop
        
        $publicUrl = "$SUPABASE_URL/storage/v1/object/public/$BUCKET_NAME/$([Uri]::EscapeDataString($fileName))"
        $uploaded[$fileName] = $publicUrl
        Write-Host " DONE" -ForegroundColor Green
    } catch {
        Write-Host " FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# ---- STEP 3: Print public URLs ----
Write-Host "`n[3/3] Public URLs for your files:" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor DarkGray
foreach ($entry in $uploaded.GetEnumerator() | Sort-Object Name) {
    Write-Host "`n$($entry.Key):" -ForegroundColor Yellow
    Write-Host "  $($entry.Value)" -ForegroundColor White
}

Write-Host "`n✅ Upload complete! Copy the URLs above into your code." -ForegroundColor Green
Write-Host "   All files are publicly accessible from Supabase Storage." -ForegroundColor Gray
