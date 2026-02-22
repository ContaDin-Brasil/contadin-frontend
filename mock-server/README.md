# Mock Server - Banco de Dados de Testes

## 📋 Scripts Disponíveis

### Iniciar o servidor
```bash
npm start
```
Inicia o JSON Server na porta 3001.

### Limpar transações órfãs
```bash
npm run limpar-orfaos
```
Remove todas as transações que referenciam instituições que não existem mais.

## 🔧 Funcionalidades de Manutenção

### Deleção em Cascata
Quando você deleta uma instituição (banco ou vale) através da aplicação, **todas as transações relacionadas são automaticamente removidas** antes da instituição ser deletada.

Isso garante a integridade referencial dos dados e evita transações órfãs.

#### Logs de Debug
Ao deletar uma instituição, você verá no console:
```
============================================================
🗑️  [DELETE CASCADE] Deletando instituição ID: 5
============================================================
📊 Encontradas 3 transações para deletar
  ↳ Deletando transação ID 101: Compra no mercado
  ↳ Deletando transação ID 102: Pagamento conta
  ↳ Deletando transação ID 103: Transferência
🏦 Deletando instituição ID: 5
✅ Instituição e 3 transações deletadas com sucesso!
============================================================
```

### Limpeza de Transações Órfãs

#### Via Script (Recomendado para manutenção manual)
Execute o script de limpeza diretamente no banco de dados:
```bash
cd mock-server
npm run limpar-orfaos
```

**Exemplo de output:**
```
🧹 Iniciando limpeza de transações órfãs...

🏦 Instituições válidas encontradas: 10
   IDs: [4, 5, 9, 10, 11, 14, 15, 16, 19, 20]

📊 Total de transações: 34
🔍 Transações órfãs encontradas: 13

📋 Lista de transações órfãs:
   • ID 25: "Delivery iFood" - R$ 72
     └─ Instituição 13 não existe mais
   • ID 15: "Cinema + Pipoca" - R$ 55
     └─ Instituição 13 não existe mais
   ...

✅ 13 transações órfãs removidas com sucesso!
📊 Total de transações após limpeza: 21

✨ Limpeza concluída!
```

#### Via Aplicação
Na tela de **Configurações** do app, há um botão "Limpar Dados Órfãos" na seção de Manutenção que executa a mesma limpeza através da API.

## 🔍 Como Funciona

### Integridade Referencial
O banco de dados mantém relacionamentos entre tabelas:
- **transacao.fk_instituicao** → **instituicao.id**
- **transacao.fk_categoria** → **categoria.id**

Quando uma instituição é removida, todas as transações que a referenciam ficam "órfãs" (com referência inválida).

### Prevenção de Órfãos
A aplicação agora previne a criação de órfãos através de:

1. **Deleção em cascata automática**: Ao deletar uma instituição pela interface, as transações são removidas automaticamente
2. **Botão de limpeza**: Para casos onde dados órfãos já existem ou foram criados manualmente
3. **Script de manutenção**: Para limpeza direta no arquivo JSON

## 📝 Restaurar Dados Originais

Para restaurar o banco de dados ao estado original:

### Windows
```bash
reset-db.bat
```

### Linux/Mac
```bash
./reset-db.sh
```

Isso copiará o conteúdo de `db.backup.json` para `db.json`.
