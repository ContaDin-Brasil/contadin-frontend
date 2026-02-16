/**
 * Exportação centralizada de todos os serviços da API
 * 
 * Importação simples nos componentes:
 * import { usuarioService, transacaoService, ... } from '../api';
 */

export { default as api } from './config';
export { default as usuarioService } from './services/usuarioService';
export { default as categoriaService } from './services/categoriaService';
export { default as instituicaoService } from './services/instituicaoService';
export { default as transacaoService } from './services/transacaoService';
export { default as metaGastoService } from './services/metaGastoService';

// Exportar constantes
export * from './constants';
