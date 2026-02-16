#!/bin/bash
echo "========================================"
echo " Mock Server - Finance App"
echo "========================================"
echo ""
echo "Instalando dependências..."
cd mock-server
npm install
echo ""
echo "========================================"
echo " Iniciando servidor..."
echo "========================================"
echo ""
echo "Servidor disponível em: http://localhost:3001"
echo ""
echo "Para parar o servidor, pressione Ctrl+C"
echo ""
npm start
