#!/bin/bash
echo "========================================"
echo " Resetar Banco de Dados Mock"
echo "========================================"
echo ""
echo "ATENÇÃO: Isso vai apagar todos os dados de teste!"
echo ""
read -p "Pressione Enter para continuar ou Ctrl+C para cancelar..."
echo ""
echo "Restaurando backup..."
cd mock-server
cp -f db.backup.json db.json
echo ""
echo "========================================"
echo " Banco de dados resetado com sucesso!"
echo "========================================"
echo ""
