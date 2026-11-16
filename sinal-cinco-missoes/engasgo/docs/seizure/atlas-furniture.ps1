Add-Type -AssemblyName System.Drawing
$bitmap=[System.Drawing.Bitmap]::new((Join-Path (Get-Location) 'public/assets/seizure/furniture.png'))
$rows=@(0,280,540,790,1024);$frames=@{}
for($row=0;$row -lt 4;$row++){for($col=0;$col -lt 4;$col++){$minX=1536;$minY=1024;$maxX=0;$maxY=0;for($y=$rows[$row];$y -lt $rows[$row+1];$y++){for($x=$col*384;$x -lt ($col+1)*384;$x++){if($bitmap.GetPixel($x,$y).A -gt 20){$minX=[Math]::Min($minX,$x);$minY=[Math]::Min($minY,$y);$maxX=[Math]::Max($maxX,$x);$maxY=[Math]::Max($maxY,$y)}}};$w=$maxX-$minX+1;$h=$maxY-$minY+1;$frames["$row-$col"]=@{frame=@{x=$minX;y=$minY;w=$w;h=$h};rotated=$false;trimmed=$false;spriteSourceSize=@{x=0;y=0;w=$w;h=$h};sourceSize=@{w=$w;h=$h}}}}
@{frames=$frames;meta=@{image='furniture.png';size=@{w=1536;h=1024};scale='1'}}|ConvertTo-Json -Depth 8|Set-Content public/assets/seizure/furniture.json
$bitmap.Dispose()
