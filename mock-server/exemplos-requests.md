# Exemplos de Requests para testar no Postman, Insomnia ou cURL

## ==========================================
## INSTITUIÇÕES
## ==========================================

### Criar nova instituição (Banco)
POST http://localhost:3001/instituicao
Content-Type: application/json

{
  "nome": "Caixa Econômica",
  "icone": "bank",
  "cor": "#0066B3",
  "fk_usuario": 1
}

### Criar nova instituição (Vale)
POST http://localhost:3001/instituicao
Content-Type: application/json

{
  "nome": "Vale Alimentação",
  "icone": "food",
  "cor": "#2E7D32",
  "fk_usuario": 1
}

### Atualizar instituição
PUT http://localhost:3001/instituicao/1
Content-Type: application/json

{
  "id": 1,
  "nome": "Banco do Brasil - Conta Corrente",
  "icone": "bank",
  "cor": "#FFDD00",
  "fk_usuario": 1
}

### Deletar instituição
DELETE http://localhost:3001/instituicao/5

### Listar instituições de um usuário
GET http://localhost:3001/instituicao?fk_usuario=1

## ==========================================
## CATEGORIAS
## ==========================================

### Criar nova categoria
POST http://localhost:3001/categoria
Content-Type: application/json

{
  "nome": "Educação",
  "fk_usuario": 1
}

### Atualizar categoria
PUT http://localhost:3001/categoria/1
Content-Type: application/json

{
  "id": 1,
  "nome": "Alimentação e Bebidas",
  "fk_usuario": 1
}

### Deletar categoria
DELETE http://localhost:3001/categoria/5

### Listar categorias de um usuário
GET http://localhost:3001/categoria?fk_usuario=1

## ==========================================
## TRANSAÇÕES
## ==========================================

### Criar nova transação de gasto
POST http://localhost:3001/transacao
Content-Type: application/json

{
  "valor": 89.90,
  "tipo": "GASTO",
  "descricao": "Farmácia - Remédios",
  "data_transacao": "2026-02-15T16:45:00",
  "parcelado": false,
  "recorrencia": null,
  "fim_recorrencia": null,
  "fk_instituicao": 2,
  "fk_categoria": 1
}

### Criar transação de receita
POST http://localhost:3001/transacao
Content-Type: application/json

{
  "valor": 500.00,
  "tipo": "RECEITA",
  "descricao": "Freelance - Design",
  "data_transacao": "2026-02-14T10:00:00",
  "parcelado": false,
  "recorrencia": null,
  "fim_recorrencia": null,
  "fk_instituicao": 1,
  "fk_categoria": 4
}

### Criar transação recorrente
POST http://localhost:3001/transacao
Content-Type: application/json

{
  "valor": 99.90,
  "tipo": "GASTO",
  "descricao": "Netflix",
  "data_transacao": "2026-02-01T00:00:00",
  "parcelado": false,
  "recorrencia": "MENSAL",
  "fim_recorrencia": null,
  "fk_instituicao": 2,
  "fk_categoria": 5
}

### Criar transação parcelada
POST http://localhost:3001/transacao
Content-Type: application/json

{
  "valor": 1200.00,
  "tipo": "GASTO",
  "descricao": "TV 50 polegadas - 12x",
  "data_transacao": "2026-02-10T14:30:00",
  "parcelado": true,
  "recorrencia": null,
  "fim_recorrencia": null,
  "fk_instituicao": 2,
  "fk_categoria": 5
}

### Atualizar transação
PUT http://localhost:3001/transacao/1
Content-Type: application/json

{
  "id": 1,
  "valor": 165.75,
  "tipo": "GASTO",
  "descricao": "Supermercado - Compra mensal",
  "data_transacao": "2026-02-10T10:30:00",
  "parcelado": false,
  "recorrencia": null,
  "fim_recorrencia": null,
  "fk_instituicao": 2,
  "fk_categoria": 1
}

### Deletar transação
DELETE http://localhost:3001/transacao/5

### Listar todas transações
GET http://localhost:3001/transacao

### Listar apenas gastos
GET http://localhost:3001/transacao?tipo=GASTO

### Listar apenas receitas
GET http://localhost:3001/transacao?tipo=RECEITA

### Listar transações de uma instituição
GET http://localhost:3001/transacao?fk_instituicao=1

### Listar transações de uma categoria
GET http://localhost:3001/transacao?fk_categoria=1

### Listar transações recorrentes
GET http://localhost:3001/transacao?recorrencia_ne=null

### Listar transações por período
GET http://localhost:3001/transacao?data_transacao_gte=2026-02-01&data_transacao_lte=2026-02-28

### Listar transações ordenadas por data (mais recente)
GET http://localhost:3001/transacao?_sort=data_transacao&_order=desc

### Listar transações com valor maior que 100
GET http://localhost:3001/transacao?valor_gte=100

## ==========================================
## METAS DE GASTO
## ==========================================

### Criar nova meta
POST http://localhost:3001/meta_gasto
Content-Type: application/json

{
  "nome": "Meta Lazer Fevereiro",
  "valor": 400.00,
  "data_fim_meta": "2026-02-28",
  "fk_usuario": 1,
  "fk_categoria": 5
}

### Atualizar meta
PUT http://localhost:3001/meta_gasto/1
Content-Type: application/json

{
  "id": 1,
  "nome": "Meta Alimentação Atualizada",
  "valor": 600.00,
  "data_fim_meta": "2026-02-28",
  "fk_usuario": 1,
  "fk_categoria": 1
}

### Deletar meta
DELETE http://localhost:3001/meta_gasto/2

### Listar metas de um usuário
GET http://localhost:3001/meta_gasto?fk_usuario=1

### Listar metas ativas (até a data atual)
GET http://localhost:3001/meta_gasto?data_fim_meta_gte=2026-02-15

## ==========================================
## USUÁRIO
## ==========================================

### Criar novo usuário
POST http://localhost:3001/usuario
Content-Type: application/json

{
  "nome": "Carlos",
  "sobrenome": "Oliveira",
  "email": "carlos.oliveira@email.com",
  "senha": "$2a$10$hash_exemplo_senha",
  "tel": "(31) 99123-4567",
  "ativo": true
}

### Atualizar perfil do usuário
PUT http://localhost:3001/usuario/1
Content-Type: application/json

{
  "id": 1,
  "nome": "João Pedro",
  "sobrenome": "Silva Santos",
  "email": "joao.silva@email.com",
  "senha": "$2a$10$hash_exemplo_senha",
  "tel": "(11) 98765-4321",
  "ativo": true
}

### Atualizar parcialmente (apenas nome)
PATCH http://localhost:3001/usuario/1
Content-Type: application/json

{
  "nome": "João Carlos"
}

### Desativar usuário
PATCH http://localhost:3001/usuario/1
Content-Type: application/json

{
  "ativo": false
}

### Buscar usuário por email
GET http://localhost:3001/usuario?email=joao.silva@email.com

## ==========================================
## CONSULTAS COMBINADAS
## ==========================================

### Resumo financeiro: Somar todos os gastos de fevereiro
GET http://localhost:3001/transacao?tipo=GASTO&data_transacao_gte=2026-02-01&data_transacao_lte=2026-02-28

### Gastos por categoria em período específico
GET http://localhost:3001/transacao?tipo=GASTO&fk_categoria=1&data_transacao_gte=2026-02-01&data_transacao_lte=2026-02-28

### Todas as instituições e suas transações
GET http://localhost:3001/instituicao?_embed=transacao

### Paginação - 10 transações por página
GET http://localhost:3001/transacao?_page=1&_limit=10&_sort=data_transacao&_order=desc
