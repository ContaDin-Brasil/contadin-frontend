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

Os KPIs deixam de ser calculados no front e passam a vir da API.
**Um endpoint por KPI (4).**

### 1) Impacto previsto no mes
GET /objetivos/kpis/impacto-previsto

Query:
- `fkUsuario`: string (uuid, obrigatorio)
- `dataInicio`: "YYYY-MM-DD" (opcional, default: 1o dia do mes atual)
- `dataFim`: "YYYY-MM-DD" (opcional, default: ultimo dia do mes atual)
- `tipoObjetivo`: "LIMITE_GASTO" | "AUMENTO_RECEITA" (opcional)

Response (200):
```json
{
  "impactoPrevistoMes": 0
}
```

### 2) Objetivos no ritmo
GET /objetivos/kpis/no-ritmo

Query:
- `fkUsuario`: string (uuid, obrigatorio)
- `dataInicio`: "YYYY-MM-DD" (opcional)
- `dataFim`: "YYYY-MM-DD" (opcional)
- `tipoObjetivo`: "LIMITE_GASTO" | "AUMENTO_RECEITA" (opcional)

Response (200):
```json
{
  "objetivosNoRitmo": 0,
  "totalObjetivos": 0
}
```

### 3) Maior alerta
GET /objetivos/kpis/maior-alerta

Query:
- `fkUsuario`: string (uuid, obrigatorio)
- `dataInicio`: "YYYY-MM-DD" (opcional)
- `dataFim`: "YYYY-MM-DD" (opcional)
- `tipoObjetivo`: "LIMITE_GASTO" | "AUMENTO_RECEITA" (opcional)

Response (200):
```json
{
  "maiorAlerta": "Salario 55% atingido",
  "objetivoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "status": "ATENCAO",
  "tipoObjetivo": "AUMENTO_RECEITA"
}
```

### 4) Acao recomendada
GET /objetivos/kpis/acao-recomendada

Query:
- `fkUsuario`: string (uuid, obrigatorio)
- `dataInicio`: "YYYY-MM-DD" (opcional)
- `dataFim`: "YYYY-MM-DD" (opcional)
- `tipoObjetivo`: "LIMITE_GASTO" | "AUMENTO_RECEITA" (opcional)

Response (200):
```json
{
  "acaoRecomendada": "Reforce as acoes que trazem mais retorno.",
  "objetivoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

### Respostas sem objetivos
Se nao houver objetivos no periodo, retornar valores padrao:
- `impactoPrevistoMes = 0`
- `objetivosNoRitmo = 0` e `totalObjetivos = 0`
- `maiorAlerta = "--"`
- `acaoRecomendada = "Sem recomendacoes para esta semana."`

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
  - Criar chamadas para os 4 endpoints de KPI e usar os valores retornados.
  - Nao calcular KPIs a partir da lista de objetivos.

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
- Remover calculos locais de KPI (impacto, no ritmo, maior alerta, acao recomendada).
- Parar de usar a listagem de objetivos para montar KPI (usar apenas os endpoints de KPI).

## Arquivos Afetados pela Integracao

### Serao Mantidos (com refactoring)

#### 📄 `src/telas/configuracoes/hooks/useGerenciarObjetivos.ts`
**Hoje**: Carrega objetivos e passa para `calcularResumoObjetivos` para computar KPIs.
**Depois**: 
- Continua carregando objetivos (listagem nao muda).
- Remove chamada para `calcularResumoObjetivos`.
- Adiciona 4 novas chamadas HTTP para os endpoint de KPI.
- Retorna os KPIs vindo da API em vez da computacao local.

#### 📄 `src/telas/configuracoes/TelaObjetivos.jsx`
**Hoje**: Chama `useGerenciarObjetivos` e acessa `resumo` (contendo impacto, noRitmo, maiorAlerta, recomendacao).
**Depois**: Mesma estrutura, mesma renderizacao. Nao muda pois os dados vem do hook.

#### 📄 `src/api/services/objetivoGastoService.ts`
**Hoje**: Fornece `listarPorUsuario` e `buscarPorNome` para a listagem.
**Depois**: Adiciona 4 novos metodos para os endpoints de KPI (um por KPI).
```typescript
// Novos metodos
async obterImpatoPrevistoMes(usuarioId, dataInicio?, dataFim?, tipoObjetivo?)
async obterObjetivosNoRitmo(usuarioId, dataInicio?, dataFim?, tipoObjetivo?)
async obterMaiorAlerta(usuarioId, dataInicio?, dataFim?, tipoObjetivo?)
async obterAcaoRecomendada(usuarioId, dataInicio?, dataFim?, tipoObjetivo?)
```

### Serao Removidos (em breve)

#### 🗑️ `src/telas/configuracoes/objetivos/utils/objetivoResumo.ts`
**Por que**: `calcularResumoObjetivos` sera substituida por respostas HTTP.
**Quando**: Apos integrar os 4 endpoints de KPI.

#### 🗑️ `src/telas/configuracoes/objetivos/utils/objetivoInsights.ts`
**Por que**: `gerarRecomendacao` era mock local; recomendacao virara da API.
**Quando**: Apos integrar `GET /objetivos/kpis/acao-recomendada`.

#### 🗑️ `src/telas/configuracoes/objetivos/constants/constantesObjetivo.ts` (parcialmente)
**Por que**: `INSIGHTS_MOCK` sera removido (insights vem da API).
**Mantém**: `TIPOS_OBJETIVO`, `PRIORIDADES`, `STATUS_VISUAL`, `TIPO_VISUAL`, `PRIORIDADE_LABELS` (usados para mapear e exibir dados).

### Pode ser refatorado (opcional)

#### 📝 `src/telas/configuracoes/objetivos/utils/objetivoCalculos.ts`
**Hoje**: Helper para calcular percentuais, status, periodo.
**Depois**: Pode ser removido se o backend ja retornar `status` e `percentual` calculados.
**Manter se**: O frontend precisar de calculos locais adicionais (ex: para UI adaptativa ou debug).

#### 📝 `src/telas/configuracoes/objetivos/utils/objetivoMapper.ts`
**Hoje**: Converte objetivo API em `ObjetivoUi` com campos derivados.
**Depois**: Simplificar se a API ja retornar status, percentual e outros derivados.
**Manter se**: A API nao retornar todos os campos e o front precisar computar alguns.

## Timeline de Remocao

1. **Fase 1**: Adicionar 4 endpoints de KPI ao backend.
2. **Fase 2**: Integrar no `useGerenciarObjetivos` e testar em `TelaObjetivos`.
3. **Fase 3**: Remover `objetivoResumo.ts` e `objetivoInsights.ts`.
4. **Fase 4**: Limpar `INSIGHTS_MOCK` de constantes.
5. **Fase 5**: Opcionalmente refatorar mapeador e calculadora se backend enriquecer respostas.

## Checklist de Integracao

- [ ] Backend implementa 4 endpoints de KPI.
- [ ] `objetivoGastoService.ts` adiciona 4 novos metodos.
- [ ] `useGerenciarObjetivos.ts` chama endpoints de KPI.
- [ ] `TelaObjetivos.jsx` recebe e exibe KPIs da API.
- [ ] Testes passam; KPIs exibem corretamente.
- [ ] Remover `objetivoResumo.ts`.
- [ ] Remover `objetivoInsights.ts`.
- [ ] Remover `INSIGHTS_MOCK` de constantes.
- [ ] Testar novamente (smoke test objetivo listagem e KPIs).
- [ ] Documentacao atualizada (este arquivo).
