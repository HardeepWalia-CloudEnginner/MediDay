Add-Type -AssemblyName System.Drawing

$width = 1700
$height = 1080
$bmp = New-Object System.Drawing.Bitmap $width, $height
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

$brushBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(8, 16, 31))
$g.FillRectangle($brushBg, 0, 0, $width, $height)
$brushBg.Dispose()

for ($i = 0; $i -lt $height; $i++) {
    $t = $i / $height
    $r = [math]::Round(8 + (23 - 8) * $t)
    $gr = [math]::Round(16 + (36 - 16) * $t)
    $b = [math]::Round(31 + (57 - 31) * $t)
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb($r, $gr, $b))
    $g.DrawLine($pen, 0, $i, $width, $i)
    $pen.Dispose()
}

$fontTitle = New-Object System.Drawing.Font('Arial', 34, [System.Drawing.FontStyle]::Bold)
$fontHeader = New-Object System.Drawing.Font('Arial', 18, [System.Drawing.FontStyle]::Bold)
$fontText = New-Object System.Drawing.Font('Arial', 14)
$brushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(248, 250, 252))
$brushLight = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(219, 234, 254))

$rects = @(
    @{x=100; y=100; w=320; h=220; c=[System.Drawing.Color]::FromArgb(14, 165, 233); title='User + Frontend'; lines=@('Browser / Medibot UI', 'Login, Role selection, Chat', 'LocalStorage session state')},
    @{x=700; y=100; w=360; h=220; c=[System.Drawing.Color]::FromArgb(34, 197, 94); title='FastAPI Backend'; lines=@('main.py initializes services', 'AppStateContainer holds singletons', 'CORS + ingestrequest router', 'Document ingestion + query orchestration', 'SQL-RAG and semantic RAG switch')},
    @{x=1280; y=100; w=320; h=220; c=[System.Drawing.Color]::FromArgb(14, 165, 233); title='Medibot Frontend'; lines=@('Next.js + React', 'Chat UI components', 'Login page + chat page', 'Role-based response filtering')},
    @{x=100; y=400; w=320; h=200; c=[System.Drawing.Color]::FromArgb(139, 92, 246); title='Ingestion Pipeline'; lines=@('/ingest endpoint', 'Docling PDF parser', 'Hybrid chunking + headings', 'access_roles metadata')},
    @{x=700; y=400; w=360; h=200; c=[System.Drawing.Color]::FromArgb(249, 115, 22); title='Qdrant Store'; lines=@('Dense + sparse embeddings', 'Collection per document type', 'Role-based filter metadata')},
    @{x=1280; y=400; w=320; h=200; c=[System.Drawing.Color]::FromArgb(239, 68, 68); title='Semantic Router'; lines=@('LLM collection selector', 'identify_target_collection()', 'Directs query to:', '- Qdrant hybrid search', '- SQL billing query')},
    @{x=450; y=820; w=360; h=200; c=[System.Drawing.Color]::FromArgb(34, 211, 238); title='Hybrid RAG Engine'; lines=@('check_role_retriever()', 'Cross-encoder reranking', 'ChatGroq answer generation', 'Response + citations')},
    @{x=1070; y=820; w=360; h=200; c=[System.Drawing.Color]::FromArgb(15, 23, 42); title='SQL RAG Pipeline'; lines=@('SQL intent detection', 'mediassistservice.sql_rag_chain()', 'SQLite billing DB lookup', 'Answer formatting via LLM')}
)

foreach ($rect in $rects) {
    $brush = New-Object System.Drawing.SolidBrush($rect.c)
    $g.FillRectangle($brush, $rect.x, $rect.y, $rect.w, $rect.h)
    $brush.Dispose()

    $stringFormat = New-Object System.Drawing.StringFormat
    $stringFormat.Alignment = [System.Drawing.StringAlignment]::Center
    $stringFormat.LineAlignment = [System.Drawing.StringAlignment]::Center

    $g.DrawString($rect.title, $fontHeader, $brushWhite, [System.Drawing.RectangleF]::new($rect.x, $rect.y + 20, $rect.w, 40), $stringFormat)
    $y = $rect.y + 80
    foreach ($line in $rect.lines) {
        $g.DrawString($line, $fontText, $brushLight, [System.Drawing.PointF]::new($rect.x + 20, $y))
        $y += 22
    }
}

$stringFormat = New-Object System.Drawing.StringFormat
$stringFormat.Alignment = [System.Drawing.StringAlignment]::Center
$stringFormat.LineAlignment = [System.Drawing.StringAlignment]::Center
$g.DrawString('MediDay Architecture & Flow', $fontTitle, $brushWhite, [System.Drawing.RectangleF]::new(0, 20, $width, 60), $stringFormat)

$penArrow = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(248, 250, 252), 5)
$penArrow.EndCap = [System.Drawing.Drawing2D.LineCap]::ArrowAnchor
$g.DrawLine($penArrow, 420, 210, 700, 210)
$g.DrawLine($penArrow, 1060, 210, 1280, 210)
$g.DrawLine($penArrow, 240, 320, 240, 380)
$g.DrawLine($penArrow, 240, 475, 700, 475)
$g.DrawLine($penArrow, 980, 460, 1280, 460)
$g.DrawLine($penArrow, 880, 570, 880, 760)
$g.DrawLine($penArrow, 880, 760, 680, 760)
$g.DrawLine($penArrow, 680, 760, 680, 780)
$g.DrawLine($penArrow, 1280, 570, 1280, 760)
$g.DrawLine($penArrow, 1280, 760, 1280, 780)


$output = Join-Path (Get-Location) 'architecture-diagram.png'
$bmp.Save($output, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Saved $output"

$g.Dispose()
$bmp.Dispose()
