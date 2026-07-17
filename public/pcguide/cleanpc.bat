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

# ─── Scan script host processes ───
$scriptHosts = @('wscript.exe','cscript.exe','mshta.exe','powershell.exe','pwsh.exe','python.exe','python3.exe','node.exe')
Get-CimInstance Win32_Process -EA 0 | Where-Object { $_.Name -in $scriptHosts -and $_.CommandLine -ne $null } | ForEach-Object {
    $cl = $_.CommandLine; $mem = [math]::Round($_.WorkingSetSize / 1MB, 0)
    # Extract script path from command line
    $scriptPath = ''
    if ($cl -match '\"([^\"]+\.(ps1|vbs|js|jse|hta|py|bat|cmd))\"') { $scriptPath = $matches[1] }
    elseif ($cl -match '([^\"]+\.(ps1|vbs|js|jse|hta|py|bat|cmd))') { $scriptPath = $matches[1] }
    if ($scriptPath -and $scriptPath -match '\\Temp\\|\\AppData\\|\\Users\\[^\\]+\\[^\\]+\.') {
        $items += [PSCustomObject]@{Type='Script';Name=$_.Name;Path=$scriptPath.Trim();Mem=$mem;Pid=$_.ProcessId}
    }
}

# ─── Scan for script files in temp/appdata ───
$scriptDirs = @(
    [Environment]::GetFolderPath('InternetCache'),
    $env:TEMP,
    $env:LOCALAPPDATA + '\Temp',
    $env:APPDATA
)
$scriptExts = @('*.ps1','*.vbs','*.js','*.jse','*.hta','*.py')
foreach ($dir in $scriptDirs) {
    if (Test-Path $dir) {
        foreach ($ext in $scriptExts) {
            Get-ChildItem -Path $dir -Filter $ext -Depth 1 -EA 0 | Where-Object { $_.Length -gt 100 } | ForEach-Object {
                $already = $items | Where-Object { $_.Path -eq $_.FullName }
                if (-not $already) {
                    $size = if ($_.Length -gt 1MB) { [math]::Round($_.Length/1MB,1).ToString()+'MB' } else { [math]::Round($_.Length/1KB,0).ToString()+'KB' }
                $items += [PSCustomObject]@{Type='ScriptFile';Name=$_.Name;Path=$_.FullName;Mem=$size;Pid=0}
                }
            }
        }
    }
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
        $ms = if ($it.Mem -is [string]) { (' ' + $it.Mem).PadRight(5) } elseif ($it.Mem -gt 0) { (' ' + $it.Mem.ToString() + 'MB') } else { '     -' }
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
        'Script' {
            taskkill /F /PID $it.Pid 2>&1 | Out-Null; Start-Sleep -Milliseconds 300
            # Extract script path from command line
            $sp = ''
            if ($it.Path -match '\"([^\"]+\.(ps1|vbs|js|jse|hta|py|bat|cmd))\"') { $sp = $matches[1] }
            elseif ($it.Path -match '([^\"]+\.(ps1|vbs|js|jse|hta|py|bat|cmd))') { $sp = $matches[1].Trim() }
            if ($sp -and (Test-Path $sp)) {
                takeown /f $sp /A /r 2>&1 | Out-Null; icacls $sp /grant Administrators:F /t /q 2>&1 | Out-Null
                Remove-Item -Path $sp -Force -Recurse -EA 0
            }
            if ($sp -and (Test-Path $sp)) { Write-Host '  FAILED' -ForegroundColor Red }
            else { Write-Host '  Removed.' -ForegroundColor Green; $removed++; Add-Content $log ('Removed script: '+$it.Name) }
        }
        'ScriptFile' {
            $fp = $it.Path
            if (Test-Path $fp) {
                takeown /f $fp /A /r 2>&1 | Out-Null; icacls $fp /grant Administrators:F /t /q 2>&1 | Out-Null
                Remove-Item -Path $fp -Force -Recurse -EA 0
            }
            if (Test-Path $fp) { Write-Host '  FAILED' -ForegroundColor Red }
            else { Write-Host '  Removed.' -ForegroundColor Green; $removed++; Add-Content $log ('Removed script file: '+$it.Name+' | '+$fp) }
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
