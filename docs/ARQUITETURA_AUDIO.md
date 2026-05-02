# Arquitetura da Implementação de Áudio

## 🗂️ Estrutura de Componentes

```
TelaAdicionarTransacao (Componente Principal)
│
├── useFormularioTransacao (Hook de Formulário)
├── useProcessamentoIA (Hook de IA/OCR/Áudio)
│   │
│   ├── audioUtils (Funções de Áudio)
│   │   ├── requestAudioPermission()
│   │   ├── configureAudioSession()
│   │   └── resetAudioSession()
│   │
│   └── audioService (Serviço HTTP)
│       └── sendAudioForTranscription()
│           └── POST /ai/audio (multipart/form-data)
│
└── ModalConfirmarAudio (Componente)
    ├── Player (play/pause + barra de progresso + tempo)
    ├── Botão Enviar
    └── Botão Descartar
```

---

## 🔄 Fluxo de Dados

```
[Usuário toca "🎤 Áudio"]
                ↓
[handleAudioInput() — isRecording = false]
                ↓
[_startRecording()]
  ├── requestAudioPermission()
  ├── configureAudioSession()
  └── Audio.Recording.createAsync(HIGH_QUALITY)
                ↓
[isRecording = true → botão vira "⏹ Parar" (vermelho)]
                ↓
[Usuário toca "⏹ Parar"]
                ↓
[handleAudioInput() — isRecording = true]
                ↓
[_stopAndSendAudio()]
  ├── stopAndUnloadAsync()
  ├── resetAudioSession()
  └── getURI() → "blob:..." (web) | "file://..." (nativo)
                ↓
[pendingAudioUri = uri]
[audioConfirmModalVisible = true]
                ↓
[ModalConfirmarAudio renderiza]
                ↓
    ┌───────────┴───────────┐
    ↓                       ↓
[Enviar]              [Descartar]
    ↓                       ↓
[confirmAudioSend()]  [cancelAudioSend()]
    ↓                       ↓
[audioService         [limpa pendingAudioUri
 .sendAudioFor         e fecha modal]
 Transcription(uri)]
    ↓
[POST /ai/audio]
    ↓
[Etapa 2: processar resposta → AISuggestion]
```

---

## 📦 Dependências

```
expo-av
  ├── Audio.Recording         — gravação de áudio
  ├── Audio.Sound             — reprodução nativo
  ├── Audio.requestPermissionsAsync()
  └── Audio.setAudioModeAsync()

react-native (built-in)
  ├── Platform                — detecção web vs nativo
  ├── Modal
  └── TouchableOpacity

window.Audio (Web API)        — reprodução no web (blob URLs)
```

---

## 💾 Estado Global

### useProcessamentoIA
```typescript
{
  // Estados existentes (compartilhados com foto)
  isProcessing: boolean
  processingType: 'photo' | 'audio' | null
  aiSuggestion: AISuggestion | null
  pulseAnim: Animated.Value

  // Estados exclusivos do áudio
  isRecording: boolean               // gravação em andamento
  pendingAudioUri: string | null     // URI aguardando confirmação
  audioConfirmModalVisible: boolean  // modal de confirmação aberto
}
```

### ModalConfirmarAudio (estado interno)
```typescript
{
  isPlaying: boolean
  position: number   // ms — posição atual da reprodução
  duration: number   // ms — duração total do áudio
}
```

---

## 🎯 Componentes UI

### Botão de Áudio (TelaAdicionarTransacao)
- **Estado padrão**: ícone `mic` + texto "Áudio" (azul)
- **Gravando**: ícone `stop-circle` + texto "Parar" (vermelho `COLORS.error`)
- **Desabilitado**: quando `isProcessing = true`

### ModalConfirmarAudio
- **Tipo**: Modal centralizado com overlay escuro
- **Animação**: `fade` (300ms)
- **Player**:
  - Botão play/pause (ícone `play-circle` / `pause-circle`)
  - Barra de progresso (azul sobre fundo azul claro)
  - Tempo decorrido e duração total (`MM:SS`)
- **Botões**:
  - "Descartar" — borda vermelha, descarta o áudio
  - "Enviar" — fundo azul, dispara o POST

---

## 📊 Estados e Transições

```
┌─────────────────────────────┐
│   Tela de Transação         │
│   (inicial)                 │
└────────────┬────────────────┘
             │ toca "Áudio"
             ↓
┌─────────────────────────────┐
│   Gravando                  │
│   (isRecording = true)      │
│   botão vermelho "Parar"    │
└─────────────┬───────────────┘
              │ toca "Parar"
              ↓
┌──────────────────────────────┐
│ ModalConfirmarAudio          │
│ (audioConfirmModalVisible)   │
│ player com play/pause        │
└──────────┬───────────────────┘
           │
      ┌────┴────┐
      ↓         ↓
  [Enviar]  [Descartar]
      │         │
      ↓         ↓
┌──────────┐  ┌──────────────────┐
│Processando│  │ Estado inicial   │
│isProcessing│ │ (tudo limpo)     │
└──────────┘  └──────────────────┘
      │
      ↓
┌──────────────────────────────┐
│ Etapa 2: Sugestão da IA      │
│ (a implementar)              │
└──────────────────────────────┘
```

---

## 🔐 Fluxo de Permissões

```
[_startRecording() chamado]
              ↓
[requestAudioPermission()]
  └── Audio.requestPermissionsAsync()
              ↓
       ┌──────┴──────┐
       ↓             ↓
   [granted]     [denied]
       ↓             ↓
[configureAudio  [Alert ao usuário
 Session()]       → return (sem gravar)]
       ↓
[Audio.Recording.createAsync()]
```

---

## 🔊 Reprodução por Plataforma

| Plataforma | Método | URI |
|------------|--------|-----|
| Web | `new window.Audio(uri)` | `blob:http://...` |
| Android | `expo-av Audio.Sound` | `file:///data/...` |
| iOS | `expo-av Audio.Sound` | `file:///var/...` |

> **Por que diferenciar?** No web, `expo-av Sound` não consegue reproduzir blob URLs geradas pelo Recording. O `HTMLAudioElement` nativo do browser suporta blob URLs diretamente.

---

## 🌐 Integração com ETL

### Endpoint
```
POST {EXPO_PUBLIC_OCR_ENDPOINT}/ai/audio
```

### Body
```
Content-Type: multipart/form-data
Campo: file
  ├── uri:  URI local do arquivo gravado
  ├── type: audio/m4a
  └── name: gravacao.m4a
```

### Resposta esperada (Etapa 2)
Mesmo formato do `/ai/scan`:
```json
{
  "transacao": {
    "valor": "...",
    "tipo": "GASTO | RECEITA",
    "descricao": "...",
    "data_transacao": "...",
    "categoria": "...",
    "fk_instituicao": null,
    "fk_categoria": null
  },
  "instituicao": {
    "nome": "...",
    "tipo": "..."
  }
}
```

---

## 📁 Árvore de Arquivos Afetados

```
src/
├── api/
│   └── services/
│       └── audioService.ts          (novo)
├── componentes/
│   └── ModalConfirmarAudio.tsx      (novo)
├── telas/
│   └── transacoes/
│       ├── TelaAdicionarTransacao.jsx   (atualizado)
│       └── hooks/
│           └── useProcessamentoIA.ts    (atualizado)
└── utils/
    └── audioUtils.ts                (novo)

app.json                             (atualizado — permissões + plugin expo-av)
package.json                         (atualizado — expo-av instalado)
```

---

## 📝 Referência Rápida

### audioUtils.ts
```
• requestAudioPermission()   → Promise<boolean>
• configureAudioSession()    → Promise<void>
• resetAudioSession()        → Promise<void>
```

### audioService.ts
```
• sendAudioForTranscription(uri, timeoutMs?)
    → Promise<{ success, data?, error?, totalTimeMs? }>
```

### useProcessamentoIA.ts (áudio)
```
• handleAudioInput()         → void  (toggle gravar/parar)
• confirmAudioSend()         → Promise<void>
• cancelAudioSend()          → void
• isRecording                → boolean
• pendingAudioUri            → string | null
• audioConfirmModalVisible   → boolean
```

---

## ✨ Status

| Item | Status |
|------|--------|
| Permissão de microfone | ✅ Implementado |
| Gravação (expo-av) | ✅ Implementado |
| Toggle gravar/parar | ✅ Implementado |
| Modal de confirmação | ✅ Implementado |
| Player web (blob URL) | ✅ Implementado |
| Player nativo (expo-av Sound) | ✅ Implementado |
| Envio multipart `/ai/audio` | ✅ Implementado |
| Tratamento da resposta (AISuggestion) | ✅ Implementado |
| Endpoint `/ai/audio` no ETL | ✅ Implementado |

---

**Versão**: 1.0
**Data**: Maio 2026
**Baseado em**: `ARQUITETURA_CAMERA.md` v1.0
