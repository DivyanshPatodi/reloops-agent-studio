Add-Type -AssemblyName PresentationCore, WindowsBase, PresentationFramework

$videoPath = "C:\Users\rkmeh\Downloads\annotate_readme.mp4"

$player = New-Object System.Windows.Media.MediaPlayer
$player.ScrubbingEnabled = $true
$uri = New-Object System.Uri($videoPath)
$player.Open($uri)

Start-Sleep -Milliseconds 2000

$timestamps = @(2, 5, 8, 12, 16, 20)

foreach ($sec in $timestamps) {
    $player.Position = [System.TimeSpan]::FromSeconds($sec)
    Start-Sleep -Milliseconds 1000

    $w = $player.NaturalVideoWidth
    $h = $player.NaturalVideoHeight

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

        $outPath = "C:\Users\rkmeh\reloops\reloops-agent-studio\assets\frame_${sec}s.png"
        $fs = [System.IO.File]::OpenWrite($outPath)
        $encoder.Save($fs)
        $fs.Close()
        Write-Host "Saved frame at ${sec}s to $outPath"
    }
}
$player.Close()
