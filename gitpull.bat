@echo off
cd /d %~dp0
git pull
@REM wait 5 seocnds
ping -n 5
