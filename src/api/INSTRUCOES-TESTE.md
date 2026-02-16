# 📋 Instruções para Testar a API

## 🎯 Teste Rápido (Recomendado)

### 1. Inicie o Mock Server

```bash
cd mock-server
npm install  # primeira vez apenas
npm start
```

Aguarde até ver: `JSON Server is running on http://localhost:3001`

### 2. Adicione o Componente de Teste

Edite seu `App.js` e adicione temporariamente:

```javascript
import TesteAPI from './src/api/TesteAPI';

export default function App() {
  // Comente seu código existente temporariamente
  return <TesteAPI />;
}
```

### 3. Execute o App

```bash
# No terminal do projeto (não no mock-server)
npm start
```

Pressione `i` para iOS ou `a` para Android.

### 4. Use os Botões de Teste

No app, você verá botões para:
- **Listar** - Ver transações existentes
- **Criar** - Criar uma nova transação
- **Atualizar** - Modificar uma transação existente
- **Deletar** - Remover uma transação
- **Filtros** - Ver resumo de gastos e receitas

## 📝 Teste via Console

Alternativamente, você pode testar via console:

```javascript
// Em qualquer componente
import { testarAPI, testarConexao } from './src/api/teste';

// No useEffect ou em um botão
useEffect(() => {
  testarConexao(); // Teste rápido
  // ou
  testarAPI(); // Teste completo
}, []);
```

## 🔍 Verificar Logs

Abra o console do React Native para ver os logs:

```bash
# No terminal onde você rodou npm start
# Os logs aparecerão automaticamente
```

## ✅ Checklist

- [ ] Mock server rodando em http://localhost:3001
- [ ] App React Native iniciado
- [ ] Console aberto para ver logs
- [ ] Componente de teste adicionado ou funções de teste chamadas

## 🐛 Problemas Comuns

### "Network Error" ou "Connection Failed"

**Causa**: Mock server não está rodando ou URL incorreta

**Solução**:
1. Verifique se o mock server está rodando
2. Para Android, certifique-se de usar `http://10.0.2.2:3001`
3. Para dispositivo físico, use o IP local da sua máquina

### "Cannot find module"

**Causa**: Importação incorreta

**Solução**: Use caminho relativo correto:
```javascript
import { transacaoService } from '../api'; // ou '../../api' dependendo da localização
```

### App não atualiza

**Causa**: Cache do Metro

**Solução**:
```bash
# Pressione 'r' no terminal para recarregar
# ou
npm start --reset-cache
```

## 📱 Teste em Dispositivo Físico

1. Descubra o IP local da sua máquina:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. Edite `src/api/config.js` e adicione seu IP:
   ```javascript
   if (__DEV__) {
     return 'http://SEU_IP_LOCAL:3001'; // ex: http://192.168.1.100:3001
   }
   ```

3. No mock server, use:
   ```bash
   npm run start:host
   ```

4. Certifique-se de estar na mesma rede Wi-Fi

## 🎉 Próximos Passos

Após confirmar que a API está funcionando:

1. Integre os serviços nos componentes existentes
2. Substitua dados mockados pelos dados da API
3. Implemente tratamento de erros adequado
4. Adicione loading states
5. Quando o backend real estiver pronto, apenas altere a URL em `config.js`

## 📚 Documentação

- [README.md](README.md) - Documentação completa
- [QUICK-START.md](QUICK-START.md) - Guia rápido de uso
- [exemplos-uso.js](exemplos-uso.js) - Exemplos de código
