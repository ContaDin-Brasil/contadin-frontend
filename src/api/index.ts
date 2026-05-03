/**
 * Exportação centralizada de todos os serviços da API
 * 
 * Importação simples nos componentes:
 * import { usuarioService, transacaoService, ... } from '../api';
 */

export { default as api } from './config';
export { default as usuarioService } from './services/usuarioService';
export { default as authService } from './services/authService';
export { default as categoriaService } from './services/categoriaService';
export { default as instituicaoService } from './services/instituicaoService';
export { default as transacaoService } from './services/transacaoService';
export { default as objetivoGastoService } from './services/objetivoGastoService';
export { default as importacaoPlanilhaService } from './services/importacaoPlanilhaService';

// Exportar constantes
export * from './constants';
export * from './types';
