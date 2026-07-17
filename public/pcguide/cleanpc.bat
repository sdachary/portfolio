@echo off
setlocal enabledelayedexpansion
title PC Cleanup Tool
color 0B
cd /d "%~dp0"

:: Check PowerShell
where powershell >nul 2>nul || (echo Missing PowerShell&pause&exit /b)

:: Elevation check
net session >nul 2>nul
if errorlevel 1 (
    echo ============================================
    echo   PLEASE RUN AS ADMINISTRATOR
    echo ============================================
    echo Right-click this file -^> "Run as Administrator"
    pause
    exit /b
)

cls
echo ============================================
echo   PC CLEANUP TOOL
echo ============================================
echo.
echo  This will scan for suspicious processes,
echo  startup entries, and registry run keys.
echo.
choice /c SQ /n /m "  [S] Scan now   [Q] Quit "
if errorlevel 2 exit /b

cls
echo ============================================
echo   PC CLEANUP TOOL — Scanning...
echo ============================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command "
$log = [Environment]::GetFolderPath('Desktop') + '\cleanup_log.txt'

# ─── Scan suspicious processes ───
$items = @()
Get-Process | Where-Object { $_.Path -ne $null } | ForEach-Object {
    $p = $_; $path = $p.Path; $mem = [math]::Round($p.WorkingSet64 / 1MB, 0)
    $flag = 0
    if ($path -match '\\Temp\\' -or $path -match '\\AppData\\Roaming\\[^\\]+\\[^\\]+\.exe$' -or
        $path -match '\\Local\\Temp\\') { $flag = 1 }
    try { $s = (Get-AuthenticodeSignature $path -EA Stop).Status
        if ($s -eq 'NotSigned' -or $s -eq 'HashMismatch') { $flag = 1 } } catch { $flag = 1 }
    if ($flag) { $items += [PSCustomObject]@{Type='Process';Name=$p.ProcessName+'.exe';Path=$path;Mem=$mem;Pid=$p.Id} }
}

# ─── Scan startup entries ───
Get-CimInstance Win32_StartupCommand -EA SilentlyContinue | ForEach-Object {
    $items += [PSCustomObject]@{Type='Startup';Name=if($_.Caption){$_.Caption}else{$_.Name};Path=$_.Command;Mem=0;Pid=0}
}

# ─── Check common run keys ───
$runPaths = @(
    'HKLM:\Software\Microsoft\Windows\CurrentVersion\Run',
    'HKCU:\Software\Microsoft\Windows\CurrentVersion\Run'
)
foreach ($rp in $runPaths) {
    Get-ItemProperty -Path $rp -EA 0 | Select-Object -ExpandProperty PSPath -EA 0 | Out-Null
    $vals = Get-ItemProperty -Path $rp -EA 0
    if ($vals) { $vals.PSObject.Properties | Where-Object { $_.Name -notin @('PSPath','PSParentPath','PSChildName','PSDrive','PSProvider') } | ForEach-Object {
        $items += [PSCustomObject]@{Type='RunKey';Name=$_.Name;Path=$_.Value;Mem=0;Pid=0}
    }}
}

# ─── Display ───
$total = $items.Count
if ($total -eq 0) {
    Write-Host ''; Write-Host '  No suspicious items found.' -ForegroundColor Green
    Write-Host '  Your system looks clean.' -ForegroundColor Green; Start-Sleep 2; exit 0
}

$removed = 0
do {
    cls
    Write-Host ('='*45)
    Write-Host ('  PC CLEANUP TOOL — {0} item(s) found' -f $items.Count)
    Write-Host ('='*45)
    Write-Host ''
    Write-Host ('{0,3}  {1,-8} {2,-28} {3,6}  Path' -f '#','Type','Name','Mem')
    Write-Host ('-'*75)
    for ($i = 0; $i -lt $items.Count; $i++) {
        $it = $items[$i]
        $ms = if ($it.Mem -gt 0) { (' ' + $it.Mem.ToString() + 'MB') } else { '     -' }
        $n = $it.Name; if ($n.Length -gt 27) { $n = $n.Substring(0,24) + '...' }
        $p = $it.Path; if ($p.Length -gt 40) { $p = '...' + $p.Substring($p.Length-37) }
        Write-Host ('{0,3}  {1,-8} {2,-28} {3,6}  {4}' -f ($i+1), $it.Type, $n, $ms, $p)
    }
    Write-Host ''; Write-Host '  [0] Quit' -ForegroundColor Cyan; Write-Host ''
    $input = Read-Host '  Enter number (or 0 to quit)'
    if ($input -eq '0' -or $input -eq '' -or $input -eq 'q' -or $input -eq 'Q') { break }
    
    $n = 0
    if (![int]::TryParse($input, [ref]$n) -or $n -lt 1 -or $n -gt $items.Count) {
        Write-Host '  Invalid.' -ForegroundColor Yellow; Start-Sleep 1; continue
    }
    
    $it = $items[$n-1]
    Write-Host ('  Removing: {0}' -f $it.Name) -ForegroundColor Yellow
    
    switch ($it.Type) {
        'Process' {
            taskkill /F /PID $it.Pid 2>&1 | Out-Null; Start-Sleep -Milliseconds 300
            if (Test-Path $it.Path) {
                takeown /f $it.Path /A /r 2>&1 | Out-Null
                icacls $it.Path /grant Administrators:F /t /q 2>&1 | Out-Null
                Remove-Item -Path $it.Path -Force -Recurse -EA 0
            }
            if (Test-Path $it.Path) { Write-Host '  FAILED' -ForegroundColor Red }
            else { Write-Host '  Removed.' -ForegroundColor Green; $removed++; Add-Content $log ('Removed: ' + $it.Name + ' | ' + $it.Path) }
        }
        'Startup' {
            $exe = if ($it.Path -match '^\"(.+?)\"') { $matches[1] } elseif ($it.Path -match '^([^ ]+)') { $matches[1] } else { $it.Path }
            if (Test-Path $exe) { Remove-Item -Path $exe -Force -Recurse -EA 0 }
            $n2 = $it.Name -replace '\.lnk$',''
            reg delete 'HKCU\Software\Microsoft\Windows\CurrentVersion\Run' /v $n2 /f 2>&1 | Out-Null
            reg delete 'HKLM\Software\Microsoft\Windows\CurrentVersion\Run' /v $n2 /f 2>&1 | Out-Null
            Remove-Item -Path ([Environment]::GetFolderPath('Startup')+'\'+$it.Name) -Force -EA 0
            Write-Host '  Removed.' -ForegroundColor Green; $removed++; Add-Content $log ('Removed startup: '+$it.Name)
        }
        'RunKey' {
            reg delete 'HKCU\Software\Microsoft\Windows\CurrentVersion\Run' /v $it.Name /f 2>&1 | Out-Null
            reg delete 'HKLM\Software\Microsoft\Windows\CurrentVersion\Run' /v $it.Name /f 2>&1 | Out-Null
            $exe = if ($it.Path -match '^\"(.+?)\"') { $matches[1] } elseif ($it.Path -match '^([^ ]+)') { $matches[1] } else { $it.Path }
            if (Test-Path $exe) { Remove-Item -Path $exe -Force -Recurse -EA 0 }
            Write-Host '  Removed.' -ForegroundColor Green; $removed++; Add-Content $log ('Removed runkey: '+$it.Name)
        }
    }
    
    $items = @($items | Where-Object { $_ -ne $it })
    Start-Sleep 1
} while ($items.Count -gt 0)

if ($removed -gt 0) { Write-Host ''; Write-Host ('  Removed {0} item(s). Log: Desktop\cleanup_log.txt' -f $removed) -ForegroundColor Green }
Start-Sleep 2
"

:: Final message
cls
echo ============================================
echo   CLEANUP COMPLETE
echo ============================================
echo.
echo Log saved to Desktop\cleanup_log.txt
echo.
echo Still worried? Run Windows Defender Offline Scan:
echo   Windows Security -^> Virus & threat protection
echo   -^> Scan options -^> Microsoft Defender Offline Scan
echo.
pause
