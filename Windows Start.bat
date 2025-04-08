@echo off
title Website Server - DO NOT CLOSE
color 0A
echo #################################################
echo #          WEBSITE SERVER IS RUNNING           #
echo #################################################
echo.
echo IMPORTANT: Keep this window open while using the website!
echo.
echo This window is serving your local website. Closing it will
echo stop the website from working. Minimize it if needed, but
echo don't close it until you're done browsing.
echo.
echo To exit properly:
echo 1. Close all browser tabs showing the website
echo 2. Press Ctrl+C in this window
echo 3. Then close this window
echo.
powershell.exe -ExecutionPolicy Bypass -File "%~dp0start_server.ps1"
pause