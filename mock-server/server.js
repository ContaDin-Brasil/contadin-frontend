const jsonServer = require('json-server');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

const PORT = 3001;
const DB_PATH = path.join(__dirname, 'db.json');

function lerDb() {
  const data = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(data);
}

function escreverDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
}

server.use(middlewares);
server.use(bodyParser.json());

// --- Rotas de autenticação ---

// POST /auth/login
server.post('/auth/login', (req, res) => {
  const { email, senha } = req.body || {};
  if (!email || senha === undefined) {
    return res.status(400).json({ error: 'email e senha são obrigatórios' });
  }
  const db = lerDb();
  const usuario = db.usuario.find((u) => u.email === email);
  if (!usuario) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }
  if (usuario.senha !== senha) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }
  const token = `mock-token-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  res.status(200).json({ data: { token } });
});

// POST /auth/logout
server.post('/auth/logout', (req, res) => {
  res.status(204).send();
});

// POST /auth/recuperar-senha
server.post('/auth/recuperar-senha', (req, res) => {
  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: 'email é obrigatório' });
  }
  const db = lerDb();
  const usuario = db.usuario.find((u) => u.email === email);
  if (usuario) {
    const value = `rec-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const data_expiracao = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const id = Math.max(0, ...(db.token_recuperar_senha || []).map((t) => t.id)) + 1;
    if (!db.token_recuperar_senha) db.token_recuperar_senha = [];
    db.token_recuperar_senha.push({ id, value, data_expiracao, fk_usuario: usuario.id });
    escreverDb(db);
  }
  res.status(204).send();
});

// POST /auth/alterar-senha
server.post('/auth/alterar-senha', (req, res) => {
  const { token, senha } = req.body || {};
  if (!token || senha === undefined) {
    return res.status(400).json({ error: 'token e senha são obrigatórios' });
  }
  const db = lerDb();
  const tokens = db.token_recuperar_senha || [];
  const registro = tokens.find((t) => t.value === token);
  if (!registro) {
    return res.status(401).json({ error: 'Token inválido' });
  }
  const expiracao = new Date(registro.data_expiracao).getTime();
  if (Date.now() > expiracao) {
    return res.status(401).json({ error: 'Token expirado' });
  }
  const usuario = db.usuario.find((u) => u.id === registro.fk_usuario);
  if (!usuario) {
    return res.status(401).json({ error: 'Usuário não encontrado' });
  }
  usuario.senha = senha;
  db.token_recuperar_senha = tokens.filter((t) => t.value !== token);
  escreverDb(db);
  res.status(204).send();
});

server.use(router);

server.listen(PORT, () => {
  console.log(`Mock server rodando em http://localhost:${PORT}`);
});
