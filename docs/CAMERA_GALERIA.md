# Implementação de Câmera e Galeria

## 📋 Resumo

Implementação da funcionalidade de câmera e galeria para capturar imagens na tela de adicionar transações do ContaDin.

## 🗂️ Estrutura de Arquivos

### Novos Utilitários

**1. `src/utils/cameraUtils.ts`**
- Gerencia permissões de câmera e galeria
- Fornece funções para abrir câmera (`openCamera`)
- Fornece funções para abrir galeria (`openGallery`)
- Interface `ImageData` para dados capturados

**2. `src/utils/imageProcessingUtils.ts`**
- Processa e valida imagens capturadas
- `getImageDimensions` - obtém dimensões da imagem
- `validateImage` - valida se imagem é adequada
- Funções auxiliares para base64 e data URLs

### Novos Hooks

**3. `src/telas/transacoes/hooks/useCaptureImage.ts`**
- Hook customizado para gerenciar captura de imagens
- Métodos: `captureFromCamera()`, `selectFromGallery()`, `pickImage()`
- Retorna imagem capturada e estado de carregamento
- Inclui limpeza de estado (`clearImage()`, `clearError()`)

**4. `src/telas/transacoes/hooks/useModalSelecaoImagem.ts`**
- Hook para gerenciar estado do modal de seleção
- Métodos: `abrirModal()`, `fecharModal()`

### Novos Componentes

**5. `src/componentes/ImagePreview.tsx`**
- Componente para exibir prévia da imagem capturada
- Botão para remover/descartar imagem
- Suporta customização de tamanho

**6. `src/componentes/ModalSelecaoImagem.tsx`**
- Modal bottom sheet que abre de baixo (35% da tela)
- Botões para câmera e galeria
- Animação suave ao abrir/fechar

### Componentes Atualizados

**7. `src/telas/transacoes/hooks/useProcessamentoIA.ts`**
- Integrado com `useCaptureImage`
- Métodos: `captureFromCamera()`, `captureFromGallery()`
- Gera sugestão mock após capturar imagem

**8. `src/telas/transacoes/TelaAdicionarTransacao.jsx`**
- Modal de seleção integrado
- Exibe prévia da imagem capturada
- Processamento mock de OCR

### Configuração

**9. `app.json`** (Atualizado)
- Adicionadas permissões de câmera e galeria
- Configuração do plugin `expo-image-picker`
- Mensagens de permissão para iOS e Android

## 🚀 Fluxo de Uso

1. Usuário clica no botão "📷 Foto" na tela de adicionar transação
2. Modal bottom sheet abre apresentando opções:
   - 📷 Câmera
   - 🖼️ Galeria
   - Cancelar
3. Usuário escolhe câmera ou galeria
4. Modal fecha e abre a câmera/galeria
5. Usuário captura ou seleciona uma imagem
6. Imagem é exibida em preview
7. Sistema gera sugestão com dados fictícios (mock)
8. Usuário pode aceitar ou descartar a sugestão

## 💾 Estrutura de Dados

### ImageData (cameraUtils.ts)
```typescript
{
  uri: string           // Caminho da imagem
  base64?: string       // Imagem em base64
  width?: number        // Largura em pixels
  height?: number       // Altura em pixels
  fileName?: string     // Nome do arquivo
}
```

### CapturedImage (useCaptureImage.ts)
```typescript
{
  uri: string           // Caminho da imagem
  base64?: string       // Imagem em base64
  width?: number        // Largura em pixels
  height?: number       // Altura em pixels
  fileName?: string     // Nome do arquivo
  capturedAt: string    // ISO timestamp
}
```

### AISuggestion (processada em mock)
```typescript
{
  descricao: string     // Descrição da transação
  valor: string         // Valor formatado
  categoria: string     // Categoria sugerida
  tipo: 'RECEITA' | 'GASTO'  // Tipo
  instituicao?: string  // Instituição
  data: string          // Data DD/MM/YYYY
}
```

## 🔐 Permissões

### iOS
- `NSCameraUsageDescription` - Acesso à câmera
- `NSPhotoLibraryUsageDescription` - Acesso à galeria
- `NSPhotoLibraryAddOnlyUsageDescription` - Permissão para salvar

### Android
- `CAMERA` - Acesso à câmera
- `READ_EXTERNAL_STORAGE` - Leitura de arquivos
- `WRITE_EXTERNAL_STORAGE` - Escrita de arquivos

As permissões são solicitadas dinamicamente quando o usuário clica no botão.

## 🎯 Estados do Hook useProcessamentoIA

```typescript
{
  isProcessing: boolean          // Processando?
  processingType: 'photo'|'audio'|null  // Tipo
  aiSuggestion: AISuggestion|null     // Sugestão mock
  capturedImage: CapturedImage|null   // Imagem capturada
  pulseAnim: Animated.Value    // Animação loading
}
```

## 🧪 Teste Rápido

Para verificar se está funcionando:

1. Instale a dependência: `npm install expo-image-picker` (já instalado)
2. Execute: `npm start` ou `expo start`
3. Abra o app no seu dispositivo/emulador
4. Na tela de adicionar transação, clique em "📷 Foto"
5. Escolha câmera ou galeria
6. Capture/selecione uma imagem
7. Verifique se a imagem aparece em preview
8. Verifique se a sugestão mock é exibida

## 📝 Referência Rápida

### cameraUtils.ts
```
• requestCameraPermission()    → Promise<boolean>
• requestGalleryPermission()   → Promise<boolean>
• openCamera()                 → Promise<ImageData | null>
• openGallery()                → Promise<ImageData | null>
• openImagePicker()            → Promise<ImageData | null>
```

### useCaptureImage.ts
```
• captureFromCamera()          → Promise<CapturedImage | null>
• selectFromGallery()          → Promise<CapturedImage | null>
• pickImage()                  → Promise<CapturedImage | null>
• clearImage()                 → void
• clearError()                 → void
```

### useProcessamentoIA.ts
```
• captureFromCamera()          → void
• captureFromGallery()         → void
• dismissAISuggestion()        → void
```

## 🔗 Integração com OCR Futuro

Quando implementar OCR real, modifique:

```typescript
// Em useProcessamentoIA.ts
// Substituir:
setTimeout(() => {
  setAiSuggestion({...});
}, 2500);

// Por:
const ocrResult = await processImageWithOCR(imageData.base64);
setAiSuggestion(parseOCRResult(ocrResult));
```

---

**Status**: ✅ Funcional com mock de OCR
**Última atualização**: Março 2026
