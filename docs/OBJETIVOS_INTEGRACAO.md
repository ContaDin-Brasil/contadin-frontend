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
- `id`: number
- `nome`: string
- `tipo_objetivo`: "LIMITE_GASTO" | "AUMENTO_RECEITA"
- `valor_alvo`: number
- `data_inicio`: "YYYY-MM-DD"
- `data_fim`: "YYYY-MM-DD"
- `prioridade`: "ALTA" | "MEDIA" | "BAIXA" | null
- `fk_usuario`: number
- `fk_categoria`: number

Campos derivados (podem vir da API ou ser calculados no front):
- `valor_realizado`: number
- `percentual_realizado`: number (0-1)
- `status`: "no_ritmo" | "atencao" | "estourado" | "concluido" | "abaixo_do_ritmo"
- `insight`: string

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

- `impacto_previsto_mes`: soma de `max(0, valor_alvo - valor_realizado)` para objetivos ativos.
- `objetivos_no_ritmo`: count onde `status in ("no_ritmo", "concluido")`.
- `maior_alerta`: objetivo com maior desvio:
  - gasto: `percentual_realizado - percentual_periodo`
  - receita: `percentual_periodo - percentual_realizado`
- `acao_recomendada`: texto pronto para o card.

## Endpoints sugeridos

### GET /objetivos
Lista objetivos com campos derivados (preferencial).

Query:
- `fk_usuario`: number (obrigatorio)
- `data_inicio`: YYYY-MM-DD (opcional)
- `data_fim`: YYYY-MM-DD (opcional)

Response (200):
```json
[
  {
    "id": 1,
    "nome": "Gastar no maximo R$ 450 com delivery este mes",
    "tipo_objetivo": "LIMITE_GASTO",
    "valor_alvo": 450,
    "valor_realizado": 350,
    "percentual_realizado": 0.78,
    "status": "atencao",
    "insight": "Gastos sobem no fim de semana; planeje 2 refeicoes caseiras.",
    "data_inicio": "2026-05-01",
    "data_fim": "2026-05-31",
    "prioridade": "ALTA",
    "fk_usuario": 1,
    "fk_categoria": 10
  }
]
```

### GET /objetivos/kpis
Retorna KPIs e acao recomendada.

Query:
- `fk_usuario`: number (obrigatorio)
- `data_inicio`: YYYY-MM-DD (opcional)
- `data_fim`: YYYY-MM-DD (opcional)

Response (200):
```json
{
  "impacto_previsto_mes": 800,
  "objetivos_no_ritmo": 2,
  "total_objetivos": 5,
  "maior_alerta": {
    "id": 5,
    "nome": "Manter compras no cartao abaixo de R$ 600",
    "categoria": "Compras",
    "percentual": 1.08,
    "label": "Compras 108% usado"
  },
  "acao_recomendada": "Voce ja consumiu 108% do limite de Compras. Ajustar pequenos habitos pode manter o objetivo viavel."
}
```

### POST /objetivos
Cria um novo objetivo.

Request:
```json
{
  "nome": "Gastar no maximo R$ 450 com delivery este mes",
  "tipo_objetivo": "LIMITE_GASTO",
  "valor_alvo": 450,
  "data_inicio": "2026-05-01",
  "data_fim": "2026-05-31",
  "prioridade": "ALTA",
  "fk_usuario": 1,
  "fk_categoria": 10
}
```

Response (201): retorna o objetivo criado.

### PUT /objetivos/{id}
Atualiza objetivo.

### DELETE /objetivos/{id}
Remove objetivo.

## Observacao sobre endpoint atual

Se o backend ainda usar `/meta_gasto`, manter a rota e adaptar o payload, mas preservar os campos novos (`tipo_objetivo`, `prioridade`, `data_inicio`, `data_fim`, `valor_alvo`).

## Integracao no front (passos)

1) **TelaObjetivos**
   - Remover `OBJETIVOS_MOCK`.
   - Criar hook `useObjetivos` que chama:
     - `GET /objetivos`
     - `GET /objetivos/kpis`
   - Usar loading/erro (pode reutilizar padrao de telas ja existentes).

2) **TelaAdicionarObjetivo**
   - No `handleSalvar`, converter datas `DD/MM/AAAA` -> `YYYY-MM-DD` (local, sem UTC):
     - `const toISODate = (d) => `${yyyy}-${mm}-${dd}``
   - Chamar `POST /objetivos` e mostrar `ModalAviso` de sucesso.

3) **TelaEditarObjetivo**
   - No `handleSalvar`, chamar `PUT /objetivos/{id}`.
   - No `handleConfirmDelete`, chamar `DELETE /objetivos/{id}`.

4) **Conversao de datas**
   - Evitar `toISOString()` para nao deslocar o dia por fuso.
   - Preferir string local `YYYY-MM-DD`.

## Fallbacks (se API nao retornar derivados)

Se a API nao enviar `valor_realizado`, `status` ou `insight`:
- calcular no front usando as regras acima;
- manter o texto de `acao_recomendada` com base no `maior_alerta`.

## Remover mocks

- Remover `OBJETIVOS_MOCK` e logicas de mock na tela.
- Remover dados mockados se existirem em outras telas relacionadas a objetivos.
