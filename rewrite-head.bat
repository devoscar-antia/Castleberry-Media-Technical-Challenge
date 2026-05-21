@echo off
setlocal
cd /d "d:\candidate-challenge"
set GIT=C:\Program Files\Git\cmd\git.exe

"%GIT%" add -A
if errorlevel 1 exit /b 1

for /f %%t in ('"%GIT%" write-tree') do set TREE=%%t
if "%TREE%"=="" exit /b 1

for /f %%c in ('"%GIT%" commit-tree %TREE% -p d9f8c435812b8b180620e703f794fa57aa1015bd -F commit-msg-clean.txt') do set COMMIT=%%c
if "%COMMIT%"=="" exit /b 1

"%GIT%" reset --hard %COMMIT%
if errorlevel 1 exit /b 1

"%GIT%" log -1 --format=%%B
