@echo off
echo ========================================
echo  Mock Server - Finance App
echo ========================================
echo.
echo Instalando dependencias...
cd mock-server
call npm install
echo.
echo ========================================
echo  Iniciando servidor...
echo ========================================
echo.
echo Servidor disponivel em: http://localhost:3001
echo.
echo Para parar o servidor, pressione Ctrl+C
echo.
call npm start
