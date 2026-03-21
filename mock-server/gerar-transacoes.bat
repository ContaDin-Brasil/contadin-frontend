@echo off
echo.
echo =========================================
echo   GERADOR DE TRANSACOES MOCKADAS
echo =========================================
echo.

cd /d "%~dp0"
cd ..

if "%1"=="" (
    echo Gerando 50 transacoes...
    node utils/gerar-transacoes.js
) else if "%1"=="limpar" (
    echo Limpando todas as transacoes...
    node utils/gerar-transacoes.js limpar
) else if "%1"=="stats" (
    echo Mostrando estatisticas...
    node utils/gerar-transacoes.js stats
) else (
    node utils/gerar-transacoes.js %*
)

echo.
pause
