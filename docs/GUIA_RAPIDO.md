# 🚀 Guia Rápido - Câmera e Galeria

## Instalação (já realizada)

```bash
npm install expo-image-picker@^14.7.1 --legacy-peer-deps
```

## Iniciar Aplicação

```bash
# Opção 1: Servidor Expo
npm start

# Opção 2: Android direto
npm run android

# Opção 3: iOS direto
npm run ios
```

## Como Testar

### Passo a Passo:
1. Abra o app ContaDin
2. Vá para "Adicionar Transação"
3. Clique no botão "📷 Foto"
4. Escolha:
   - **Câmera** - tirar foto
   - **Galeria** - selecionar existente
   - **Cancelar** - fechar modal

### O que Deve Acontecer:
- ✅ Modal aparece de baixo (35% da tela)
- ✅ Câmera/Galeria abre após escolha
- ✅ Imagem aparece em preview
- ✅ Sugestão mock é exibida
- ✅ Pode aceitar ou descartar

## Arquivos Principais

| Arquivo | Função |
|---------|--------|
| `cameraUtils.ts` | Acesso câmera/galeria |
| `useCaptureImage.ts` | Hook para captura |
| `ModalSelecaoImagem.tsx` | Modal bottom sheet |
| `ImagePreview.tsx` | Preview da imagem |
| `useProcessamentoIA.ts` | Gerencia sugestões mock |

## Resolução de Problemas

### Erro: "Permission denied"
```
Settings → Permissões → ContaDin → Câmera: ON
```

### Imagem não aparece
- Reinicie: `Ctrl+C` e `npm start`
- Limpe cache: `npm start -- --clear`

### App fecha ao clicar "Foto"
- Verifique console: `Ctrl+Shift+J`
- Teste em outro dispositivo/emulador

### "Cannot find module"
- Salve todos os arquivos (Ctrl+S)
- Reinicie o servidor Expo

## Verificação Final

Antes de considerar pronto:

- [ ] npm start carrega sem erros
- [ ] App abre normalmente
- [ ] Botão "Foto" visível
- [ ] Modal abre ao clicar
- [ ] Câmera captura foto
- [ ] Galeria seleciona imagem
- [ ] Preview aparece
- [ ] Sugestão é exibida
- [ ] Pode aceitar/descartar

## Debug

Ver logs:
```bash
# Terminal onde rodando npm start
# Ou console do emulador (F12)
```

Ativar logs no código:
```typescript
// Em cameraUtils.ts
console.log('Capturando...', { hasPermission, imageUri })
```

## Próximos Passos

Quando integrar OCR real:

1. Criar `src/api/services/ocrService.ts`
2. Importar em `useProcessamentoIA.ts`
3. Substituir mock por chamada OCR
4. Testar com imagens reais

---

**Tudo funcionando?** ✅ Pronto para adicionar OCR real!
