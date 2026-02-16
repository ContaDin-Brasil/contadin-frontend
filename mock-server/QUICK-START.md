# 🚀 Guia Rápido - Mock Server

## Início Rápido

### Windows
```bash
# Opção 1: Usar o script automático
start-server.bat

# Opção 2: Manual
cd mock-server
npm install
npm start
```

### Linux/Mac
```bash
# Opção 1: Usar o script automático
chmod +x start-server.sh
./start-server.sh

# Opção 2: Manual
cd mock-server
npm install
npm start
```

## Acessar o Servidor

Após iniciar, acesse:
- **API Base URL**: http://localhost:3001
- **Documentação Interativa**: http://localhost:3001 (JSON Server UI)

## Endpoints Principais

| Recurso | URL |
|---------|-----|
| Usuários | http://localhost:3001/usuario |
| Categorias | http://localhost:3001/categoria |
| Instituições | http://localhost:3001/instituicao |
| Transações | http://localhost:3001/transacao |
| Metas | http://localhost:3001/meta_gasto |

## Testar no React Native

```javascript
const API_URL = 'http://localhost:3001'; // iOS Simulator
// const API_URL = 'http://10.0.2.2:3001'; // Android Emulator
// const API_URL = 'http://SEU_IP:3001'; // Dispositivo físico

// Buscar todas as transações
fetch(`${API_URL}/transacao`)
  .then(res => res.json())
  .then(data => console.log(data));

// Criar nova transação
fetch(`${API_URL}/transacao`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    valor: 50.00,
    tipo: 'GASTO',
    descricao: 'Teste',
    data_transacao: new Date().toISOString(),
    parcelado: false,
    recorrencia: null,
    fim_recorrencia: null,
    fk_instituicao: 1,
    fk_categoria: 1
  })
})
  .then(res => res.json())
  .then(data => console.log('Criado:', data));
```

## Resetar Dados

### Windows
```bash
reset-db.bat
```

### Linux/Mac
```bash
chmod +x reset-db.sh
./reset-db.sh
```

## Comandos Úteis

```bash
# Iniciar servidor normal
npm start

# Iniciar com delay (simular latência)
npm run start:delay

# Iniciar acessível na rede local
npm run start:host
```

## 📚 Documentação Completa

Veja [README.md](README.md) para documentação completa e exemplos detalhados.

## ❓ Problemas Comuns

### Porta em uso
```bash
# Windows
netstat -ano | findstr :3001

# Linux/Mac
lsof -ti:3001
```

### Não consegue acessar do celular
1. Use `npm run start:host`
2. Verifique se está na mesma rede Wi-Fi
3. Use seu IP local (não localhost)
4. Verifique o firewall

### Descubra seu IP local
```bash
# Windows
ipconfig

# Linux/Mac
ifconfig
# ou
ip addr show
```
