# Testes unitarios e TDD

## Objetivo
Garantir que toda nova funcionalidade ou ajuste relevante tenha um teste antes da implementacao (TDD), sempre que for possivel testar de forma automatizada.

## Stack de testes
- Jest (preset Expo)
- @testing-library/react-native
- @testing-library/jest-native

## Como rodar
```bash
npm test
```

Para assistir alteracoes:
```bash
npm run test:watch
```

## Estrutura sugerida
- Testes em `__tests__/` organizados por dominio
- Um arquivo de teste por modulo ou por grupo de funcoes relacionadas

Exemplos:
- `__tests__/api/authService.test.ts`
- `__tests__/api/transacaoService.test.ts`
- `__tests__/carteira/instituicoesPadrao.test.ts`

## Ciclo TDD (red-green-refactor)
1. **Red**: escreva o teste que descreve o comportamento desejado e rode `npm test`.
2. **Green**: implemente o minimo necessario para o teste passar.
3. **Refactor**: organize o codigo mantendo os testes verdes.

## Checklist para novas funcionalidades
- [ ] Especificar comportamento esperado
- [ ] Criar testes unitarios (ou de integracao quando necessario)
- [ ] Rodar testes localmente
- [ ] Implementar a funcionalidade
- [ ] Rodar testes novamente
- [ ] Refatorar e manter cobertura

## Boas praticas
- Prefira testar logica pura (utils, mapeamentos, validacoes, services).
- Evite testar implementacao interna de UI; teste comportamento observavel.
- Mock de chamadas HTTP deve ser usado nos services.
- Manter testes deterministas (sem acesso a rede ou data/hora real).

## Quando evitar teste
- Protótipo temporario sem previsao de manutencao
- Feature descartavel ou estritamente visual sem logica

Se o teste nao for possivel, documentar no PR/commit o motivo.
