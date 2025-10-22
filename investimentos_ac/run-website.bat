@echo off
setlocal
REM Executa a partir da raiz do projeto onde o vite.config.ts está
cd /d "%~dp0"
echo Instalando dependencias necessarias (se houver atualizacoes)...
call npm install
echo.
echo Iniciando o website FirmeInvest a partir da raiz...
call npx vite
pause
endlocal