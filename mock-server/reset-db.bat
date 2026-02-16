@echo off
echo ========================================
echo  Resetar Banco de Dados Mock
echo ========================================
echo.
echo ATENCAO: Isso vai apagar todos os dados de teste!
echo.
pause
echo.
echo Restaurando backup...
cd mock-server
copy /Y db.backup.json db.json
echo.
echo ========================================
echo  Banco de dados resetado com sucesso!
echo ========================================
echo.
pause
