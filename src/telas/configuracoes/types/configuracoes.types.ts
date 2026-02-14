/**
 * Tipos e interfaces para o módulo de configurações
 * Alinhado com esquema do DB: usuario
 */

export interface PerfilUsuario {
  id?: number;
  nome: string;
  sobrenome: string;
  tel: string;
  email: string;
  senha?: string; // Apenas para contextos específicos
  ativo?: boolean;
  pushNotifications: boolean; // Configuração local, não no DB
  darkTheme: boolean; // Configuração local, não no DB
}

export interface AlterarSenha {
  senhaAtual: string;
  novaSenha: string;
  confirmarSenha: string;
}

export interface ValidacaoSenha {
  temOitoCaracteres: boolean;
  temNumero: boolean;
  temCaractereEspecial: boolean;
  semSequenciaNumerica: boolean;
  semNumerosRepetidos: boolean;
}

export interface ModaisContaState {
  deleteModalVisible: boolean;
  confirmDeleteModalVisible: boolean;
  deactivatedModalVisible: boolean;
}

export interface ModaisAjudaState {
  emailExpanded: boolean;
  whatsappExpanded: boolean;
}

export type TabAjuda = 'FAQ' | 'Contato' | 'ChatBot';
