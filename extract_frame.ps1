Add-Type -AssemblyName PresentationCore, WindowsBase, PresentationFramework

$videoPath = "C:\Users\rkmeh\Downloads\annotate_readme.mp4"
$outPath = "C:\Users\rkmeh\reloops\reloops-agent-studio\assets\reloops-video-review-actual.png"

$player = New-Object System.Windows.Media.MediaPlayer
$player.ScrubbingEnabled = $true
$uri = New-Object System.Uri($videoPath)
$player.Open($uri)

Start-Sleep -Milliseconds 2500
$player.Position = [System.TimeSpan]::FromSeconds(4)
Start-Sleep -Milliseconds 1500

$w = $player.NaturalVideoWidth
$h = $player.NaturalVideoHeight

Write-Host "Detected dimensions: $w x $h"

if ($w -gt 0 -and $h -gt 0) {
    $drawingVisual = New-Object System.Windows.Media.DrawingVisual
    $drawingContext = $drawingVisual.RenderOpen()
    $rect = New-Object System.Windows.Rect(0, 0, $w, $h)
    $drawingContext.DrawVideo($player, $rect)
    $drawingContext.Close()

    $renderTarget = New-Object System.Windows.Media.Imaging.RenderTargetBitmap($w, $h, 96, 96, [System.Windows.Media.PixelFormats]::Pbgra32)
    $renderTarget.Render($drawingVisual)

    $encoder = New-Object System.Windows.Media.Imaging.PngBitmapEncoder
    $frame = [System.Windows.Media.Imaging.BitmapFrame]::Create($renderTarget)
    $encoder.Frames.Add($frame)

    $fs = [System.IO.File]::OpenWrite($outPath)
    $encoder.Save($fs)
    $fs.Close()
    Write-Host "SUCCESS: Saved screenshot to $outPath"
} else {
    Write-Host "NaturalVideoWidth was 0"
}
$player.Close()
