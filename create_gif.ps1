Add-Type -AssemblyName PresentationCore, WindowsBase, PresentationFramework, System.Drawing

$videoPath = "C:\Users\rkmeh\Downloads\annotate_readme.mp4"
$outGifPath = "C:\Users\rkmeh\reloops\reloops-agent-studio\assets\reloops-video-annotation-demo.gif"

$player = New-Object System.Windows.Media.MediaPlayer
$player.ScrubbingEnabled = $true
$uri = New-Object System.Uri($videoPath)
$player.Open($uri)

Start-Sleep -Milliseconds 2000

$w = 800
$h = [int]($w * ($player.NaturalVideoHeight / $player.NaturalVideoWidth))
if ($h -eq 0) { $h = 450 }

Write-Host "Target GIF resolution: $w x $h"

# Sample 40 frames across the video duration
$durationSec = 15
$frameCount = 30
$frames = New-Object System.Collections.Generic.List[System.Drawing.Bitmap]

for ($i = 0; $i -lt $frameCount; $i++) {
    $sec = ($i / $frameCount) * $durationSec
    $player.Position = [System.TimeSpan]::FromSeconds($sec)
    Start-Sleep -Milliseconds 150

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

    $ms = New-Object System.IO.MemoryStream
    $encoder.Save($ms)
    $ms.Position = 0
    $bmp = New-Object System.Drawing.Bitmap($ms)
    $frames.Add($bmp)
}
$player.Close()

Write-Host "Extracted $($frames.Count) frames. Encoding GIF..."

# Create animated GIF using .NET Drawing
# Standard GIF encoding
$gifEnc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.FormatDescription -eq "GIF" }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::SaveFlag, [long][System.Drawing.Imaging.EncoderValue]::MultiFrame)

# Save first frame
$firstFrame = $frames[0]
$firstFrame.Save($outGifPath, $gifEnc, $encParams)

$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::SaveFlag, [long][System.Drawing.Imaging.EncoderValue]::FrameDimensionTime)
for ($i = 1; $i -lt $frames.Count; $i++) {
    $firstFrame.SaveAdd($frames[$i], $encParams)
}

$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::SaveFlag, [long][System.Drawing.Imaging.EncoderValue]::Flush)
$firstFrame.SaveAdd($encParams)

Write-Host "SUCCESS: Animated GIF saved to $outGifPath"
