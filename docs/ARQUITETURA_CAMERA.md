# Arquitetura da Implementação de Câmera

## 🗂️ Estrutura de Componentes

```
TelaAdicionarTransacao (Componente Principal)
│
├── useFormularioTransacao (Hook de Formulário)
├── useProcessamentoIA (Hook de IA/Mock)
│   │
│   ├── useCaptureImage (Hook de Captura)
│   │   │
│   │   └── cameraUtils (Funções de Câmera/Galeria)
│   │       ├── openCamera()
│   │       ├── openGallery()
│   │       └── requestPermissions()
│   │
│   ├── imageProcessingUtils (Processamento de Imagem)
│   │   ├── validateImage()
│   │   ├── getImageDimensions()
│   │   └── isValidBase64Image()
│   │
│   └── Mock OCR (Simulação)
│       └── Retorna dados fictícios
│
├── useModalSelecaoImagem (Hook de Modal)
│   └── Gerencia estado de abertura/fechamento
│
├── ModalSelecaoImagem (Componente)
│   ├── Bottom sheet (35% da tela)
│   ├── Botão Câmera
│   ├── Botão Galeria
│   └── Botão Cancelar
│
└── ImagePreview (Componente)
    └── Exibe preview da imagem capturada
```

## 🔄 Fluxo de Dados

```
[Usuário clica em "📷 Foto"]
                ↓
[useModalSelecaoImagem.abrirModal()]
                ↓
[ModalSelecaoImagem renderiza]
                ↓
    ┌───────────┴───────────┐
    ↓                       ↓
[Câmera]              [Galeria] [Cancelar]
    ↓                       ↓
[openCamera()]      [openGallery()]
    ↓                       ↓
    └───────────┬───────────┘
                ↓
[ImageData { uri, base64, width, height }]
                ↓
[setCapturedImage()]
                ↓
[Modal fecha automaticamente]
                ↓
[ImagePreview renderiza imagem]
                ↓
[Mock OCR processa (timeout 2.5s)]
                ↓
[AISuggestion gerada com dados fictícios]
                ↓
[Exibir sugestão na tela]
                ↓
    ┌──────────┴──────────┐
    ↓                     ↓
[Aceitar]           [Descartar]
    ↓                     ↓
[Aplicar dados]  [Limpar e tentar novamente]
```

## 📦 Dependências

```
expo-image-picker@^14.7.1
  ├── RN Camera API
  ├── RN ImagePicker API
  └── Permissões do SO

react-native (built-in)
  ├── View, Text, Modal
  ├── Image Component
  ├── Animated
  └── TouchableOpacity
```

## 💾 Estado Global

### useProcessamentoIA
```typescript
{
  isProcessing: boolean
  processingType: 'photo' | 'audio' | null
  aiSuggestion: AISuggestion | null
  capturedImage: CapturedImage | null
  pulseAnim: Animated.Value
}
```

### useModalSelecaoImagem
```typescript
{
  modalVisible: boolean
}
```

### useCaptureImage
```typescript
{
  isLoading: boolean
  capturedImage: CapturedImage | null
  error: string | null
}
```

## 🎯 Componentes UI

### ModalSelecaoImagem
- **Tipo**: Modal com Bottom Sheet
- **Altura**: 35% da tela
- **Animação**: 300ms entrada/saída
- **Overlay**: Touchable (fecha ao tocar)
- **Botões**: 
  - Câmera (com ícone)
  - Galeria (com ícone)
  - Cancelar (com estilo primário)

### ImagePreview
- **Tipo**: View com imagem e botão de remover
- **Tamanho**: Customizável (padrão 150px)
- **Botão**: Ícone X para descartar

## 📊 Estados e Transições

```
┌─────────────────────────────┐
│   Tela de Transação         │
│   (inicial)                 │
└────────────┬────────────────┘
             │ clica em "Foto"
             ↓
┌─────────────────────────────┐
│   Modal Seleção Imagem      │
│   (aberto)                  │
└─────────────┬───────────────┘
              │
         ┌────┼────┐
         ↓    ↓    ↓
    [Cam][Gal][Can]
         │    │    │
         └────┼────┘
              ↓
┌──────────────────────────────┐
│ Capturando/Selecionando      │
│ (isLoading = true)           │
└──────────┬───────────────────┘
           ↓
┌──────────────────────────────┐
│ Imagem Capturada             │
│ + Preview visível            │
│ + Processando Mock...        │
│ (isProcessing = true)        │
└──────────┬───────────────────┘
           ↓
┌──────────────────────────────┐
│ Sugestão Exibida             │
│ Usuário: Aceitar/Descartar   │
└──────────┬───────────────────┘
           │
      ┌────┴────┐
      ↓         ↓
  [Aceita]  [Descarta]
      │         │
      └────┬────┘
           ↓
┌──────────────────────────────┐
│ Preencher Formulário ou      │
│ Tentar Novamente             │
└──────────────────────────────┘
```

## 🔐 Fluxo de Permissões

```
[Função openCamera/openGallery chamada]
              ↓
[requestCameraPermission/requestGalleryPermission]
              ↓
       ┌──────┴──────┐
       ↓             ↓
   [Granted]     [Denied]
       ↓             ↓
  [Abre]        [Alert]
       │             │
       └──────┬──────┘
              ↓
       [Continua]
```

## 📁 Árvore de Arquivos Afetados

```
src/
├── api/
│   └── services/
│       └── (OCR aqui quando implementado)
├── componentes/
│   ├── ImagePreview.tsx (novo)
│   └── ModalSelecaoImagem.tsx (novo)
├── styles/
│   └── colors.ts (ref. em componentes)
├── telas/
│   └── transacoes/
│       ├── TelaAdicionarTransacao.jsx (atualizado)
│       ├── hooks/
│       │   ├── useCaptureImage.ts (novo)
│       │   ├── useModalSelecaoImagem.ts (novo)
│       │   └── useProcessamentoIA.ts (atualizado)
│       └── ...
└── utils/
    ├── cameraUtils.ts (novo)
    └── imageProcessingUtils.ts (novo)

app.json (atualizado)
```

## 🚀 Sequência de Inicialização

```
1. App inicia
2. TelaAdicionarTransacao carrega
3. Hooks inicializam:
   - useFormularioTransacao
   - useProcessamentoIA
     - useCaptureImage
   - useModalSelecaoImagem
4. Componente renderiza com:
   - ModalSelecaoImagem (escondido)
   - ImagePreview (se houver imagem)
   - Botões de ações
```

## 🔗 Integração com Backend (Futuro)

Quando implementar OCR real:

1. **Criar serviço**: `src/api/services/ocrService.ts`
2. **Importar em**: `useProcessamentoIA.ts`
3. **Substituir mock**: 
   ```typescript
   // Antes:
   setTimeout(() => { setAiSuggestion(...) }, 2500)
   
   // Depois:
   const result = await ocrService.processImage(base64)
   setAiSuggestion(parseResult(result))
   ```

---

**Versão**: 1.0
**Data**: Março 2026
**Status**: ✅ Funcional
