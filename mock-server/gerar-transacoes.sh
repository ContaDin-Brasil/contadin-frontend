#!/bin/bash

echo ""
echo "========================================="
echo "   GERADOR DE TRANSACOES MOCKADAS"
echo "========================================="
echo ""

# Navega para o diretório do mock-server
cd "$(dirname "$0")"

if [ -z "$1" ]; then
    echo "Gerando 50 transacoes..."
    node utils/gerar-transacoes.js
elif [ "$1" == "limpar" ]; then
    echo "Limpando todas as transacoes..."
    node utils/gerar-transacoes.js limpar
elif [ "$1" == "stats" ]; then
    echo "Mostrando estatisticas..."
    node utils/gerar-transacoes.js stats
else
    node utils/gerar-transacoes.js "$@"
fi

echo ""
