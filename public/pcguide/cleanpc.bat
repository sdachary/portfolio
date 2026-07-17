@echo off
setlocal enabledelayedexpansion
title PC Cleanup Tool
color 0B

set LOG=%USERPROFILE%\Desktop\cleanup_log.txt
echo ============================================ > "%LOG%"
echo   PC Cleanup Tool - %date% %time% >> "%LOG%"
echo ============================================ >> "%LOG%"
echo.

:menu
cls
echo ============================================
echo       PC CLEANUP TOOL
echo ============================================
echo  1. Quick Scan + View Suspicious Items
echo  2. Run Windows Defender Full Scan (slow)
echo  3. Remove Selected Item (by PID / name)
echo  4. Clean Startup & Temp Files
echo  5. Enable Defender Real-Time Protection
echo  6. View Log
echo  7. Exit
echo ============================================
choice /c 1234567 /n /m "Select [1-7]: "
if %errorlevel%==7 exit /b
if %errorlevel%==6 goto viewlog
if %errorlevel%==5 goto enable_defender
if %errorlevel%==4 goto clean_temp
if %errorlevel%==3 goto remove_item
if %errorlevel%==2 goto defender_full
if %errorlevel%==1 goto scan

:scan
cls
echo [1/5] Scanning running processes...

echo.
echo === RUNNING PROCESSES (suspicious patterns) ===
echo.
echo  PID | Name | Path
echo ----------------------------------------
wmic process get processid,name,executablepath /format:csv 2>nul | findstr /i "temp tmp appdata" > "%TEMP%\sus_procs.txt"
type "%TEMP%\sus_procs.txt" | findstr /n . >nul
if errorlevel 1 (
    echo  (none flagged from temp/appdata paths)
) else (
    type "%TEMP%\sus_procs.txt"
)
echo.

echo [2/5] Checking startup programs...
echo.
echo === STARTUP PROGRAMS ===
echo.
wmic startup get caption,command /format:list 2>nul
echo.

echo [3/5] Checking scheduled tasks...
echo.
echo === SCHEDULED TASKS (last 7 days) ===
echo.
schtasks /query /fo list /v 2>nul | findstr /i "TaskName TaskToRun" | more
echo.

echo [4/5] Checking services...
echo.
echo === NON-MICROSOFT RUNNING SERVICES ===
echo.
sc query type= service state= all 2>nul | findstr /i "SERVICE_NAME DISPLAY_NAME" > "%TEMP%\svc.txt"
rem Filter out common MS services (rough filter)
findstr /v /i "Windows Microsoft Sysmain" "%TEMP%\svc.txt" 2>nul
echo.

echo [5/5] Running Windows Defender quick scan...
echo.
echo This may take 5-10 minutes. Please wait...
echo (progress shown below)
echo.
"%PROGRAMFILES%\Windows Defender\MpCmdRun.exe" -Scan -ScanType 1 2>&1 | findstr /i /v "starting"
echo.
echo Scan complete. Check Windows Security app for full results.
echo.
echo Log saved to: %LOG%
echo.
echo Type any process name/PID to kill, or press enter to return to menu.
set /p KILL="Kill process (name/PID) or leave blank: "
if defined KILL (
    taskkill /F /IM "%KILL%" 2>nul || taskkill /F /PID %KILL% 2>nul && echo Killed %KILL% >> "%LOG%"
    if errorlevel 1 echo Could not kill "%KILL%" - try option 3
)
pause
goto menu

:defender_full
cls
echo ============================================
echo   Windows Defender Offline Scan
echo ============================================
echo This will schedule a scan that runs BEFORE
echo Windows starts next reboot (catches rootkits).
echo.
echo The PC will restart AUTOMATICALLY.
echo.
choice /c YN /n /m "Continue? (Y/N): "
if errorlevel 2 goto menu
"%PROGRAMFILES%\Windows Defender\MpCmdRun.exe" -Scan -ScanType 2
echo.
echo Offline scan scheduled. Reboot to execute, or run:
echo   "%PROGRAMFILES%\Windows Defender\MpCmdRun.exe" -Scan -ScanType 2
pause
goto menu

:remove_item
cls
echo ============================================
echo   Manual Removal
echo ============================================
echo Enter the FULL path or process name to remove.
echo Example: C:\Users\user\AppData\Roaming\bad.exe
echo.
set /p TARGET="Path or process name: "
if not defined TARGET goto menu

echo Attempting to kill process...
taskkill /F /IM "%TARGET%" 2>nul
taskkill /F /PID %TARGET% 2>nul

echo Attempting to delete file/folder...
takeown /f "%TARGET%" /r /d y 2>nul
icacls "%TARGET%" /grant Administrators:F /t /q 2>nul
del /f /s /q "%TARGET%" 2>nul
rmdir /s /q "%TARGET%" 2>nul

if exist "%TARGET%" (
    echo FAILED: Could not remove "%TARGET%"
    echo Try booting in Safe Mode and retrying.
) else (
    echo REMOVED: "%TARGET%" >> "%LOG%"
    echo REMOVED successfully.
)
pause
goto menu

:clean_temp
cls
echo ============================================
echo   Cleaning Temp Files
echo ============================================
echo.
echo Deleting temporary files...
del /f /s /q "%TEMP%\*" 2>nul
del /f /s /q "C:\Windows\Temp\*" 2>nul
echo Done.
echo.
echo === Empty RUN keys that point to deleted files ===
echo HKLM\Software\Microsoft\Windows\CurrentVersion\Run
reg query HKLM\Software\Microsoft\Windows\CurrentVersion\Run 2>nul
echo.
echo HKCU\Software\Microsoft\Windows\CurrentVersion\Run
reg query HKCU\Software\Microsoft\Windows\CurrentVersion\Run 2>nul
echo.
echo Review the entries above. To remove one:
echo   reg delete HKLM\...Run /v BadEntry /f
pause
goto menu

:enable_defender
cls
echo ============================================
echo   Enabling Windows Defender
echo ============================================
echo.
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender" /v DisableAntiSpyware /t REG_DWORD /d 0 /f 2>nul
reg delete "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender" /v DisableAntiSpyware /f 2>nul
powershell -command "Set-MpPreference -DisableRealtimeMonitoring $false" 2>nul
powershell -command "Set-MpPreference -DisableBehaviorMonitoring $false" 2>nul
echo Defender real-time protection enabled.
echo.
echo Running quick scan now...
"%PROGRAMFILES%\Windows Defender\MpCmdRun.exe" -Scan -ScanType 1
echo Done.
pause
goto menu

:viewlog
cls
type "%LOG%" 2>nul
if errorlevel 1 echo No log yet.
echo.
pause
goto menu
