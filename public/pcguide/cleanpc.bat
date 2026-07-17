@echo off
setlocal enabledelayedexpansion
title PC Cleanup Tool
color 0B
cd /d "%~dp0"

where powershell >nul 2>nul || (echo Missing PowerShell.&pause&exit /b)
net session >nul 2>nul
if errorlevel 1 (
    echo ============================================
    echo   PLEASE RUN AS ADMINISTRATOR
    echo ============================================
    echo.
    echo Right-click this file -^> "Run as Administrator"
    pause
    exit /b
)

:menu
cls
echo ============================================
echo   PC CLEANUP TOOL
echo ============================================
echo.
echo  Scans for suspicious processes, scripts,
echo  startup entries, and registry run keys.
echo.
echo  [S] Scan now
echo  [Q] Quit
echo.
choice /c SQ /n /m "  Select: "
if errorlevel 2 exit /b

:: Write the PowerShell scanner to a temp file using a here-string
set PSFILE=%TEMP%\pc_cleaner.ps1
powershell -Command "@'
$log = [Environment]::GetFolderPath('Desktop') + '\cleanup_log.txt'
$items = @()

Write-Host ''; Write-Host '  [1/5] Scanning processes...' -ForegroundColor Cyan
Get-Process | Where-Object { $_.Path } | ForEach-Object {
    $p = $_; $path = $p.Path; $mem = [math]::Round($p.WorkingSet64 / 1MB, 0)
    $flag = 0
    if ($path -match '\\Temp\\' -or $path -match '\\AppData\\' -or $path -match '\\Local\\Temp\\') { $flag = 1 }
    try { $s = (Get-AuthenticodeSignature $path -EA Stop).Status; if ($s -ne 'Valid') { $flag = 1 } } catch { $flag = 1 }
    if ($flag) { $items += [PSCustomObject]@{Type='Process';Name=$p.ProcessName+'.exe';Path=$path;Mem=$mem;Pid=$p.Id} }
}

Write-Host '  [2/5] Scanning startup entries...' -ForegroundColor Cyan
Get-CimInstance Win32_StartupCommand -EA SilentlyContinue | ForEach-Object {
    $items += [PSCustomObject]@{Type='Startup';Name=if($_.Caption){$_.Caption}else{$_.Name};Path=$_.Command;Mem=0;Pid=0} }

Write-Host '  [3/5] Scanning script hosts...' -ForegroundColor Cyan
$scriptHosts = @('wscript.exe','cscript.exe','mshta.exe','powershell.exe','pwsh.exe','python.exe','python3.exe','node.exe')
Get-CimInstance Win32_Process -EA 0 | Where-Object { $_.Name -in $scriptHosts -and $_.CommandLine } | ForEach-Object {
    $cl = $_.CommandLine; $mem = [math]::Round($_.WorkingSetSize / 1MB, 0); $sp = ''
    if ($cl -match '\"([^\"]+\.(?:ps1|vbs|js|jse|hta|py|bat|cmd))\"') { $sp = $matches[1] }
    elseif ($cl -match '([^\s]+\.(?:ps1|vbs|js|jse|hta|py|bat|cmd))') { $sp = $matches[1] }
    if ($sp -and ($sp -match '\\Temp\\' -or $sp -match '\\AppData\\') -and (Test-Path $sp)) {
        $items += [PSCustomObject]@{Type='Script';Name=$_.Name;Path=$sp;Mem=$mem;Pid=$_.ProcessId} }
}

Write-Host '  [4/5] Scanning for script files...' -ForegroundColor Cyan
$scriptDirs = @($env:TEMP, ($env:LOCALAPPDATA+'\Temp'), $env:APPDATA)
$scriptExts = @('*.ps1','*.vbs','*.js','*.jse','*.hta','*.py')
foreach ($dir in $scriptDirs) {
    if (Test-Path $dir) {
        foreach ($ext in $scriptExts) {
            Get-ChildItem -Path $dir -Filter $ext -Depth 0 -EA 0 | Where-Object { $_.Length -gt 100 } | ForEach-Object {
                $size = if ($_.Length -gt 1MB) { [math]::Round($_.Length/1MB,1).ToString()+'MB' } else { [math]::Round($_.Length/1KB,0).ToString()+'KB' }
                $items += [PSCustomObject]@{Type='ScriptFile';Name=$_.Name;Path=$_.FullName;Mem=$size;Pid=0} }
}}}

Write-Host '  [5/5] Scanning registry run keys...' -ForegroundColor Cyan
foreach ($rp in @('HKLM:\Software\Microsoft\Windows\CurrentVersion\Run','HKCU:\Software\Microsoft\Windows\CurrentVersion\Run')) {
    $vals = Get-ItemProperty -Path $rp -EA 0
    if ($vals) { $vals.PSObject.Properties | Where-Object { $_.Name -notin @('PSPath','PSParentPath','PSChildName','PSDrive','PSProvider') } | ForEach-Object {
        $items += [PSCustomObject]@{Type='RunKey';Name=$_.Name;Path=$_.Value;Mem=0;Pid=0} }}
}

# Display results
if ($items.Count -eq 0) {
    Write-Host ''; Write-Host '  No suspicious items found. Your system looks clean.' -ForegroundColor Green
    cmd /c pause | out-null; exit 0
}

$removed = 0
do {
    cls
    Write-Host ('='*45)
    Write-Host ('  PC CLEANUP TOOL - {0} item(s) found' -f $items.Count)
    Write-Host ('='*45)
    Write-Host ('{0,3}  {1,-8} {2,-28} {3,6}  Path' -f '#','Type','Name','Mem')
    Write-Host ('-'*75)
    for ($i = 0; $i -lt $items.Count; $i++) {
        $it = $items[$i]
        $ms = if ($it.Mem -is [string]) { (' '+$it.Mem).PadRight(5) } elseif ($it.Mem -gt 0) { (' '+$it.Mem.ToString()+'MB').PadRight(5) } else { '     -' }
        $n = $it.Name; if ($n.Length -gt 27) { $n = $n.Substring(0,24)+'...' }
        $p = $it.Path; if ($p.Length -gt 38) { $p = '...'+$p.Substring($p.Length-35) }
        Write-Host ('{0,3}  {1,-8} {2,-28} {3,6}  {4}' -f ($i+1),$it.Type,$n,$ms,$p) }
    Write-Host ''; Write-Host '  [0] Quit' -ForegroundColor Cyan
    $input = Read-Host '  Enter number (or 0 to quit)'
    if ($input -eq '0' -or $input -eq '' -or $input -eq 'q' -or $input -eq 'Q') { break }
    $n = 0
    if (![int]::TryParse($input,[ref]$n) -or $n -lt 1 -or $n -gt $items.Count) {
        Write-Host '  Invalid.' -ForegroundColor Yellow; Start-Sleep 1; continue }
    $it = $items[$n-1]; Write-Host ('  Removing: {0}' -f $it.Name) -ForegroundColor Yellow
    switch ($it.Type) {
        'Process' {
            taskkill /F /PID $it.Pid 2>&1 | Out-Null; Start-Sleep -Milliseconds 300
            if (Test-Path $it.Path) { takeown /f $it.Path /A /r 2>&1 | Out-Null; icacls $it.Path /grant Administrators:F /t /q 2>&1 | Out-Null
                Remove-Item -Path $it.Path -Force -Recurse -EA 0 }
            if (Test-Path $it.Path) { Write-Host '  FAILED' -ForegroundColor Red } else { Write-Host '  Done.' -ForegroundColor Green; $removed++; Add-Content $log ('Removed: '+$it.Name+' | '+$it.Path) } }
        'Startup' {
            $exe = if ($it.Path -match '^\"(.+?)\"') { $matches[1] } elseif ($it.Path -match '^([^ ]+)') { $matches[1] } else { $it.Path }
            if (Test-Path $exe) { Remove-Item -Path $exe -Force -Recurse -EA 0 }
            reg delete 'HKCU\Software\Microsoft\Windows\CurrentVersion\Run' /v ($it.Name -replace '\.lnk$','') /f 2>&1 | Out-Null
            reg delete 'HKLM\Software\Microsoft\Windows\CurrentVersion\Run' /v ($it.Name -replace '\.lnk$','') /f 2>&1 | Out-Null
            Write-Host '  Done.' -ForegroundColor Green; $removed++; Add-Content $log ('Removed startup: '+$it.Name) }
        'RunKey' {
            reg delete 'HKCU\Software\Microsoft\Windows\CurrentVersion\Run' /v $it.Name /f 2>&1 | Out-Null
            reg delete 'HKLM\Software\Microsoft\Windows\CurrentVersion\Run' /v $it.Name /f 2>&1 | Out-Null
            $exe = if ($it.Path -match '^\"(.+?)\"') { $matches[1] } elseif ($it.Path -match '^([^ ]+)') { $matches[1] } else { $it.Path }
            if (Test-Path $exe) { Remove-Item -Path $exe -Force -Recurse -EA 0 }
            Write-Host '  Done.' -ForegroundColor Green; $removed++; Add-Content $log ('Removed runkey: '+$it.Name) }
        'Script' {
            taskkill /F /PID $it.Pid 2>&1 | Out-Null; Start-Sleep -Milliseconds 300
            if ($it.Path -and (Test-Path $it.Path)) {
                takeown /f $it.Path /A /r 2>&1 | Out-Null; icacls $it.Path /grant Administrators:F /t /q 2>&1 | Out-Null
                Remove-Item -Path $it.Path -Force -Recurse -EA 0 }
            if ($it.Path -and (Test-Path $it.Path)) { Write-Host '  FAILED' -ForegroundColor Red } else { Write-Host '  Done.' -ForegroundColor Green; $removed++; Add-Content $log ('Removed script: '+$it.Name) } }
        'ScriptFile' {
            if (Test-Path $it.Path) { takeown /f $it.Path /A /r 2>&1 | Out-Null; icacls $it.Path /grant Administrators:F /t /q 2>&1 | Out-Null
                Remove-Item -Path $it.Path -Force -Recurse -EA 0 }
            if (Test-Path $it.Path) { Write-Host '  FAILED' -ForegroundColor Red } else { Write-Host '  Done.' -ForegroundColor Green; $removed++; Add-Content $log ('Removed script: '+$it.Name+' | '+$it.Path) } }
    }
    $items = @($items | Where-Object { $_ -ne $it })
    Start-Sleep 1
} while ($items.Count -gt 0)

if ($removed -gt 0) { Write-Host ''; Write-Host ('  Removed {0} item(s). Log saved to Desktop\cleanup_log.txt' -f $removed) -ForegroundColor Green }
cmd /c pause | out-null
'@ | Out-File -FilePath "%PSFILE%" -Encoding ASCII
)

:: Run the scanner
cls
echo ============================================
echo   PC CLEANUP TOOL — Scanning...
echo ============================================
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%PSFILE%"
del "%PSFILE%" 2>nul
echo.
pause
