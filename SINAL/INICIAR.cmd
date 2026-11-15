@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Instale o Node.js 22.12 ou superior e abra este arquivo novamente.
 pause
 exit /b 1
)
if not exist node_modules (
 call npm ci
 if errorlevel 1 (
  pause
  exit /b 1
 )
)
echo Abra no navegador o endereco que aparecer abaixo.
call npm run dev
pause
