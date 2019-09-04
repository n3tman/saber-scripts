@echo off
setlocal EnableDelayedExpansion

title Batch UNconvert DAT Maps to JSON

if [%1] == [] (
    echo.
    echo ### Please drag the parent folder onto the batch file ###
    goto end
)

:: Set parent folder
set parentFolder=%~1
echo %parentFolder%

:: Create Backups folder
if not exist "%parentFolder%\_Backups" mkdir "%parentFolder%\_Backups"

:: Iterate over direct subfolders, skip _Backups and MM's TemporaryMapLoading
for /d %%d in ("%parentFolder%\*") do (
    set name=%%~nxd
    set source=%%d [BACKUP]
    set destin=%parentFolder%\_Backups\!name!

    :: Delete destination folder in _Backups if it exists
    if exist "!destin!" rmdir /s /q "!destin!"
    
    if not !name! == _Backups (
        if not !name! == TemporaryMapLoading (
            :: Call the tool and auto send [ENTER]
            echo | simple-converter "%%d"
            :: Move [BACKUP] folder to _Backups
            move /y "!source!" "!destin!"
        )
    )
)

echo.
echo ### Batch Conversion Finished ###

:end
echo.

pause