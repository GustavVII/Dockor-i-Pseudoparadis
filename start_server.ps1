Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Language configuration
$languages = @(
    @{Name="Deutsch (De)"; Code="de"},
    @{Name="English (En)"; Code="en"},
    @{Name="Espa"+[char]0x00F1+"ol (Es)"; Code="es"},
    @{Name=[char]0x65E5+[char]0x672C+[char]0x8A9E+" (Ja)"; Code="ja"}
    @{Name="Norsk (No)"; Code="no"},
    @{Name="Polski (Pl)"; Code="pl"},
    @{Name="Portugu"+[char]0x00EA+"s (Pt)"; Code="pt"},
    @{Name="Rom"+[char]0x00E2+"n"+[char]0x0103+" (Ro)"; Code="ro"},
    @{Name=[char]0x0420+[char]0x0443+[char]0x0441+[char]0x0441+[char]0x043A+[char]0x0438+[char]0x0439+" (Ru)"; Code="ru"},
    @{Name="Svenska (Sv)"; Code="sv"}
)

# Calculate layout
$radioHeight = 25
$buttonHeight = 40
$columnWidth = 200
$padding = 20

# Create form
$form = New-Object System.Windows.Forms.Form
$form.Text = "Select Language"
$form.StartPosition = "CenterScreen"
$form.FormBorderStyle = "FixedDialog"
$form.MaximizeBox = $false
$form.MinimizeBox = $false
$form.Font = New-Object System.Drawing.Font("Microsoft YaHei", 9)
$form.Padding = New-Object System.Windows.Forms.Padding($padding)

# Create radio buttons
$radioButtons = @()
$yPos = $padding
foreach ($lang in $languages) {
    $radio = New-Object System.Windows.Forms.RadioButton
    $radio.Location = New-Object System.Drawing.Point($padding, $yPos)
    $radio.Size = New-Object System.Drawing.Size($columnWidth, $radioHeight)
    $radio.Text = $lang.Name
    $radio.Tag = $lang.Code
    $form.Controls.Add($radio)
    $radioButtons += $radio
    $yPos += $radioHeight
}

# Set form size and add OK button
$form.ClientSize = New-Object System.Drawing.Size(($columnWidth + $padding * 2), ($yPos + $buttonHeight))

$button = New-Object System.Windows.Forms.Button
$button.Size = New-Object System.Drawing.Size(75, 30)
$button.Text = "OK"
$button.Anchor = "Bottom,Right"
$button.Location = New-Object System.Drawing.Point(($form.ClientSize.Width - 85), ($form.ClientSize.Height - 35))
$button.DialogResult = [System.Windows.Forms.DialogResult]::OK
$form.AcceptButton = $button
$form.Controls.Add($button)

# Select first language by default
if ($radioButtons.Count -gt 0) { $radioButtons[0].Checked = $true }

# Show dialog and handle selection
$result = $form.ShowDialog()

if ($result -eq [System.Windows.Forms.DialogResult]::OK) {
    $selectedLanguage = ($radioButtons | Where-Object { $_.Checked }).Tag
    
    # Update HTML lang attribute
    $htmlContent = [System.IO.File]::ReadAllText("index.html", [System.Text.Encoding]::UTF8)
    $htmlContent = $htmlContent -replace '<html\s+lang="\w+"', "<html lang=`"$selectedLanguage`""
    [System.IO.File]::WriteAllText("index.html", $htmlContent, [System.Text.Encoding]::UTF8)
    
    # Start server
    $url = "http://localhost:8000/index.html"
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:8000/")
    $listener.Start()

    Start-Process $url | Out-Null

    Write-Host "Server started successfully! Press Ctrl+C to stop."
    Write-Host "Serving from: $($PWD.Path)"
    Write-Host ""

    try {
        while ($listener.IsListening) {
            $context = $listener.GetContext()
            $requestUrl = $context.Request.Url.LocalPath.TrimStart('/')
            
            if ([string]::IsNullOrEmpty($requestUrl)) {
                $requestUrl = "index.html"
            }
            
            $filePath = [System.IO.Path]::Combine($PWD.Path, $requestUrl)
            
            if (Test-Path $filePath -PathType Leaf) {
                $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
                $contentType = switch ($extension) {
                    ".html" { "text/html; charset=utf-8" }
                    ".css"  { "text/css" }
                    ".js"   { "application/javascript" }
                    ".json" { "application/json" }
                    ".png"  { "image/png" }
                    ".jpg"  { "image/jpeg" }
                    ".jpeg" { "image/jpeg" }
                    ".gif"  { "image/gif" }
                    ".svg"  { "image/svg+xml" }
                    default { "application/octet-stream" }
                }
                
                $context.Response.ContentType = $contentType
                
                # Add CORS headers for JSON files
                $context.Response.AppendHeader("Access-Control-Allow-Origin", "*")
                $context.Response.AppendHeader("Access-Control-Allow-Methods", "GET")
                
                $fileStream = [System.IO.File]::OpenRead($filePath)
                $context.Response.ContentLength64 = $fileStream.Length
                $fileStream.CopyTo($context.Response.OutputStream)
                $fileStream.Close()
            } else {
                $context.Response.StatusCode = 404
                $bytes = [System.Text.Encoding]::UTF8.GetBytes("File not found")
                $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
            $context.Response.Close()
        }
    }
    finally {
        if ($listener.IsListening) {
            $listener.Stop()
        }
    }
}