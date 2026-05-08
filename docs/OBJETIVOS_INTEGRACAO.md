# Integracao de Objetivos (MVP)

Este documento orienta a integracao da tela de Objetivos com API real, removendo mocks e descrevendo requests e responses (incluindo KPIs).

## Escopo

- Substituir os mocks da tela Objetivos por dados da API.
- Integrar criacao, edicao e exclusao de objetivos.
- Consumir KPIs e acao recomendada no topo da tela.
- Manter regras de negocio consistentes com o MVP.

## Fonte de dados atual (mock)

- A tela usa `OBJETIVOS_MOCK` e calculos locais de status, impacto e maior alerta.
- Objetivo: remover o mock e passar a usar API.

## Modelo de dados (base)

Campos persistidos (minimo):
- `id`: string (uuid)
- `nome`: string
- `descricao`: string | null
- `tipoObjetivo`: "LIMITE_GASTO" | "AUMENTO_RECEITA"
- `valor`: number
- `dataInicio`: "YYYY-MM-DD"
- `dataFim`: "YYYY-MM-DD"
- `prioridade`: "ALTA" | "MEDIA" | "BAIXA" | null
- `fkUsuario`: string (uuid)
- `fkCategoria`: string (uuid)
- `criadoEm`: "YYYY-MM-DDTHH:mm:ss.sssZ"
- `atualizadoEm`: "YYYY-MM-DDTHH:mm:ss.sssZ"

Campos derivados (retornados pela API):
- `realizado`: number
- `percentual`: number (0-1)
- `status`: "TRANQUILO" | "ATENCAO" | "ESTOURADO" | "CONCLUIDO" | "ABAIXO_RITMO" (ver mapeamento abaixo)

## Regras de negocio (status)

Considere:
- `percentual_periodo = dias_passados / dias_totais`
- `percentual_realizado = valor_realizado / valor_alvo`

Para LIMITE_GASTO:
- `estourado` se `valor_realizado >= valor_alvo`
- `atencao` se `percentual_realizado > percentual_periodo + 0.05`
- `no_ritmo` caso contrario

Para AUMENTO_RECEITA:
- `concluido` se `valor_realizado >= valor_alvo`
- `no_ritmo` se `percentual_realizado >= percentual_periodo - 0.05`
- `abaixo_do_ritmo` caso contrario

## KPIs (topo)

Como o backend ainda nao expõe um endpoint de KPIs, calcular no front:

- `impactoPrevistoMes`: soma de `max(0, valor - realizado)` para objetivos ativos.
- `objetivosNoRitmo`: count onde `status in ("TRANQUILO", "CONCLUIDO")`.
- `maiorAlerta`: objetivo com maior desvio:
  - gasto: `percentual - percentual_periodo`
  - receita: `percentual_periodo - percentual`
- `acaoRecomendada`: texto gerado com base no `maiorAlerta`.

## Endpoints (atuais)

### GET /objetivos
Lista objetivos.

Query:
- `fkUsuario`: string (uuid, obrigatorio)
- `concluido`: boolean (opcional)
- `tipo`: string (opcional)

Response (200):
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "nome": "Gastar no maximo R$ 450 com delivery este mes",
    "descricao": "Limite mensal para delivery.",
    "tipoObjetivo": "LIMITE_GASTO",
    "valor": 450,
    "realizado": 350,
    "percentual": 0.78,
    "status": "TRANQUILO",
    "dataInicio": "2026-05-01",
    "dataFim": "2026-05-31",
    "prioridade": "ALTA",
    "fkCategoria": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "criadoEm": "2026-05-08T00:16:58.149Z",
    "atualizadoEm": "2026-05-08T00:16:58.149Z"
  }
]
```

### GET /objetivos/nome
Busca por nome.

Query:
- `nome`: string (obrigatorio)
- `fkUsuario`: string (uuid, obrigatorio)

### POST /objetivos
Cria um novo objetivo.

Request:
```json
{
  "tipoObjetivo": "LIMITE_GASTO",
  "nome": "Gastar no maximo R$ 450 com delivery este mes",
  "descricao": "Limite mensal para delivery.",
  "valor": 450,
  "dataInicio": "2026-05-01",
  "dataFim": "2026-05-31",
  "prioridade": "ALTA",
  "fkCategoria": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "fkUsuario": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

Response (200): retorna o objetivo criado.

### GET /objetivos/{id}
Busca um objetivo.

### PATCH /objetivos/{id}
Atualiza objetivo.

### DELETE /objetivos/{id}
Remove objetivo.

### DELETE /objetivos/{id}
Remove objetivo.

## Integracao no front (passos)

1) **TelaObjetivos**
  - Remover `OBJETIVOS_MOCK`.
  - Criar hook `useObjetivos` que chama `GET /objetivos`.
  - Aplicar filtros de `concluido` e `tipo` quando necessario.
  - Calcular KPIs no front a partir da lista.

2) **TelaAdicionarObjetivo**
   - No `handleSalvar`, converter datas `DD/MM/AAAA` -> `YYYY-MM-DD` (local, sem UTC):
     - `const toISODate = (d) => `${yyyy}-${mm}-${dd}``
   - Chamar `POST /objetivos` e mostrar `ModalAviso` de sucesso.

3) **TelaEditarObjetivo**
  - No `handleSalvar`, chamar `PATCH /objetivos/{id}`.
  - No `handleConfirmDelete`, chamar `DELETE /objetivos/{id}`.

4) **Conversao de datas**
   - Evitar `toISOString()` para nao deslocar o dia por fuso.
   - Preferir string local `YYYY-MM-DD`.

## Mapeamento de status

Sugestao para mapear o `status` da API para o texto da UI:

- `TRANQUILO` -> "no ritmo"
- `ATENCAO` -> "atenção"
- `ESTOURADO` -> "estourado"
- `CONCLUIDO` -> "concluído"
- `ABAIXO_RITMO` -> "abaixo do ritmo"

## Remover mocks

- Remover `OBJETIVOS_MOCK` e logicas de mock na tela.
- Remover dados mockados se existirem em outras telas relacionadas a objetivos.
