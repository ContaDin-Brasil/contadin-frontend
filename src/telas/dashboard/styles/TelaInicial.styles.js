import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },

  header: {
    backgroundColor: '#569FFE',
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  saudacao: {
    flex: 1,
  },
  saudacaoTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.9,
  },
  nomeUsuario: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 2,
  },
  iconeNotificacao: {
    padding: 8,
  },

  saldoTotal: {
    marginBottom: 20,
  },
  saldoLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 5,
  },
  saldoValor: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },

  cardsResumo: {
    flexDirection: 'row',
    gap: 12,
  },
  cardResumo: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardResumoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardResumoIcone: {
    marginRight: 8,
  },
  cardResumoLabel: {
    color: '#666666',
    fontSize: 12,
    fontWeight: '500',
  },
  cardResumoMes: {
    color: '#AAAAAA',
    fontSize: 10,
    marginTop: 1,
  },
  cardResumoValor: {
    color: '#333333',
    fontSize: 18,
    fontWeight: 'bold',
  },

  secao: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  secaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  secaoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  secaoLinkGrafico: {
    fontSize: 13,
    color: '#569FFE',
    fontWeight: '600',
  },

  itemCategoria: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  itemCategoriaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemCategoriaIcone: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemCategoriaTextoIcone: {
    fontSize: 18,
  },
  itemCategoriaInfo: {
    flex: 1,
  },
  itemCategoriaNome: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },
  itemCategoriaValor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  itemCategoriaPorcentagem: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  barraProgresso: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barraProgressoPreenchida: {
    height: '100%',
    borderRadius: 3,
  },

  itemInstituicao: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  itemInstituicaoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemInstituicaoIcone: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  itemInstituicaoTextoIcone: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  itemInstituicaoLogo: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  itemInstituicaoInfo: {
    flex: 1,
  },
  itemInstituicaoNome: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },
  itemInstituicaoValor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  itemInstituicaoPorcentagem: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },

  graficoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  graficoHeader: {
    marginBottom: 15,
  },
  graficoTitulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  graficoSubtitulo: {
    fontSize: 12,
    color: '#999999',
    marginTop: 2,
  },
  graficoLegenda: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 12,
  },
  graficoLegendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  graficoLegendaCor: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  graficoLegendaTexto: {
    fontSize: 12,
    color: '#555555',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666666',
  },
  erroContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  erroTexto: {
    fontSize: 16,
    color: '#E31C23',
    textAlign: 'center',
    marginBottom: 20,
  },
  botaoTentarNovamente: {
    backgroundColor: '#5BA3FF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  botaoTentarNovamenteTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },


  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyTexto: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
  
  containerStyle: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
},

 tituloStyle: {
  fontSize: 15,
  fontWeight: '700',
  color: '#1A1A1A',
  marginBottom: 14,
},

resumoStyle: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#F7F9FF',
  borderRadius: 12,
  paddingVertical: 12,
  paddingHorizontal: 8,
  marginBottom: 14,
},

resumoItemStyle: {
  flex: 1,
  alignItems: 'center',
},

resumoLabelStyle: {
  fontSize: 10,
  color: '#999999',
  marginBottom: 3,
  textAlign: 'center',
},

resumoValorStyle: {
  fontSize: 13,
  fontWeight: '700',
  color: '#1A1A1A',
  textAlign: 'center',
},

separadorStyle: {
  width: 1,
  height: 32,
  backgroundColor: '#E0E0E0',
},

periodoContainerStyle: {
  flexDirection: 'row',
  backgroundColor: '#F0F0F0',
  borderRadius: 10,
  padding: 3,
  marginBottom: 14,
  alignSelf: 'center',
  gap: 2,
},

periodoItemStyle: {
  paddingHorizontal: 16,
  paddingVertical: 6,
  borderRadius: 8,
},

periodoTextoStyle: {
  fontSize: 13,
  fontWeight: '600',
  color: '#666666',
},


yAxisLabelStyle: {
  fontSize: 9,
  color: '#999999',
  textAlign: 'right',
},

emptyStyle: {
  height: 100,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 16,
},

emptyTextoStyle: {
  fontSize: 13,
  color: '#999999',
  textAlign: 'center',
},

legendaBaseStyle: {
  fontSize: 10,
  color: '#BBBBBB',
  marginTop: 10,
  textAlign: 'center',
  fontStyle: 'italic',
},

overlayStyle: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 24,
},

modalStyle: {
  backgroundColor: '#FFFFFF',
  borderRadius: 20,
  width: '100%',
  paddingTop: 20,
  paddingBottom: 28,
  paddingHorizontal: 20,
},

closeButtonStyle: {
  position: 'absolute',
  top: 16,
  right: 16,
  zIndex: 10,
  padding: 4,
},

titleStyle: {
  fontSize: 18,
  fontWeight: '700',
  color: '#1A1A1A',
  textAlign: 'center',
  marginBottom: 24,
  marginTop: 4,
},

chartWrapperStyle: {
  alignItems: 'center',
  marginBottom: 24,
},

legendaGridStyle: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 12,
},

legendaItemStyle: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  width: '45%',
},

legendaCorStyle: {
  width: 12,
  height: 12,
  borderRadius: 6,
  flexShrink: 0,
},

legendaNomeStyle: {
  fontSize: 13,
  fontWeight: '600',
  color: '#1A1A1A',
  flexShrink: 1,
},

legendaPctStyle: {
  fontSize: 11,
  fontWeight: '500',
  color: '#888888',
  flexShrink: 0,
},

legendaValorStyle: {
  fontSize: 11,
  color: '#666666',
  marginTop: 1,
}

});
