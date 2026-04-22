import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../../styles/colors';
import type { Category, FiltrosTransacao, Institution } from '../types/transacao.types';

type Filtros = FiltrosTransacao;
type TipoFiltroTransacao = Filtros['tipo'];
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const TIPOS_TRANSACAO: Array<{ value: TipoFiltroTransacao; label: string; icon: IoniconName }> = [
  { value: 'TODOS', label: 'Todos', icon: 'list-outline' },
  { value: 'RECEITA', label: 'Receitas', icon: 'arrow-up-circle' },
  { value: 'GASTO', label: 'Despesas', icon: 'arrow-down-circle' },
];

interface ModalFiltrosProps {
  visible: boolean;
  onClose: () => void;
  filtrosAtuais: Filtros;
  onAplicarFiltros: (filtros: Filtros) => void;
  instituicoes: Institution[];
  categorias: Category[];
}

export const ModalFiltros: React.FC<ModalFiltrosProps> = ({
  visible,
  onClose,
  filtrosAtuais,
  onAplicarFiltros,
  instituicoes,
  categorias,
}) => {
  const [filtrosTemp, setFiltrosTemp] = useState<Filtros>(filtrosAtuais);

  // Atualiza filtros temporários quando o modal abre
  useEffect(() => {
    if (visible) {
      setFiltrosTemp(filtrosAtuais);
    }
  }, [visible, filtrosAtuais]);

  const handleTipoChange = (tipo: 'TODOS' | 'RECEITA' | 'GASTO') => {
    setFiltrosTemp({ ...filtrosTemp, tipo });
  };

  const toggleInstituicao = (id: string | number) => {
    const instituicoesSelecionadas = filtrosTemp.instituicoes.some((i) => String(i) === String(id))
      ? filtrosTemp.instituicoes.filter((i) => String(i) !== String(id))
      : [...filtrosTemp.instituicoes, id];
    setFiltrosTemp({ ...filtrosTemp, instituicoes: instituicoesSelecionadas });
  };

  const toggleCategoria = (id: string | number) => {
    const categoriasSelecionadas = filtrosTemp.categorias.some((c) => String(c) === String(id))
      ? filtrosTemp.categorias.filter((c) => String(c) !== String(id))
      : [...filtrosTemp.categorias, id];
    setFiltrosTemp({ ...filtrosTemp, categorias: categoriasSelecionadas });
  };

  const handleLimparFiltros = () => {
    const filtrosVazios: Filtros = {
      tipo: 'TODOS',
      instituicoes: [],
      categorias: [],
      valorMin: '',
      valorMax: '',
      apenasParcelado: false,
      apenasRecorrente: false,
      dataInicio: filtrosTemp.dataInicio, // Mantém período
      dataFim: filtrosTemp.dataFim, // Mantém período
    };
    setFiltrosTemp(filtrosVazios);
  };

  const handleAplicar = () => {
    onAplicarFiltros(filtrosTemp);
    onClose();
  };

  const countFiltrosAtivos = () => {
    let count = 0;
    if (filtrosTemp.tipo !== 'TODOS') count++;
    if (filtrosTemp.instituicoes.length > 0) count++;
    if (filtrosTemp.categorias.length > 0) count++;
    if (filtrosTemp.valorMin || filtrosTemp.valorMax) count++;
    if (filtrosTemp.apenasParcelado) count++;
    if (filtrosTemp.apenasRecorrente) count++;
    // Não conta período aqui, pois agora é gerenciado separadamente
    return count;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Ionicons name="funnel-outline" size={24} color={COLORS.primary} />
              <Text style={styles.title}>Filtros</Text>
              {countFiltrosAtivos() > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{countFiltrosAtivos()}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Tipo de Transação */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tipo de Transação</Text>
              <View style={styles.typeButtons}>
                {TIPOS_TRANSACAO.map((tipo) => (
                  <TouchableOpacity
                    key={tipo.value}
                    style={[
                      styles.typeButton,
                      filtrosTemp.tipo === tipo.value && styles.typeButtonActive,
                    ]}
                    onPress={() => handleTipoChange(tipo.value)}
                  >
                    <Ionicons
                      name={tipo.icon}
                      size={20}
                      color={filtrosTemp.tipo === tipo.value ? COLORS.white : COLORS.textSecondary}
                    />
                    <Text
                      style={[
                        styles.typeButtonText,
                        filtrosTemp.tipo === tipo.value && styles.typeButtonTextActive,
                      ]}
                    >
                      {tipo.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Instituições */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Instituições {filtrosTemp.instituicoes.length > 0 && `(${filtrosTemp.instituicoes.length})`}
              </Text>
              {instituicoes.length === 0 ? (
                <Text style={styles.emptyText}>Nenhuma instituição cadastrada</Text>
              ) : (
                <View style={styles.checkboxList}>
                  {instituicoes.map((instituicao) => (
                    <TouchableOpacity
                      key={instituicao.id}
                      style={styles.checkboxItem}
                      onPress={() => toggleInstituicao(instituicao.id)}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          filtrosTemp.instituicoes.some((id) => String(id) === String(instituicao.id)) && styles.checkboxActive,
                        ]}
                      >
                        {filtrosTemp.instituicoes.some((id) => String(id) === String(instituicao.id)) && (
                          <Ionicons name="checkmark" size={16} color={COLORS.white} />
                        )}
                      </View>
                      <View style={styles.checkboxLabel}>
                        <View
                          style={[
                            styles.institutionDot,
                            { backgroundColor: instituicao.cor || COLORS.primary },
                          ]}
                        />
                        <Text style={styles.checkboxText}>{instituicao.nome}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Categorias */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Categorias {filtrosTemp.categorias.length > 0 && `(${filtrosTemp.categorias.length})`}
              </Text>
              {categorias.length === 0 ? (
                <Text style={styles.emptyText}>Nenhuma categoria cadastrada</Text>
              ) : (
                <View style={styles.checkboxList}>
                  {categorias.map((categoria) => (
                    <TouchableOpacity
                      key={categoria.id}
                      style={styles.checkboxItem}
                      onPress={() => toggleCategoria(categoria.id)}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          filtrosTemp.categorias.some((id) => String(id) === String(categoria.id)) && styles.checkboxActive,
                        ]}
                      >
                        {filtrosTemp.categorias.some((id) => String(id) === String(categoria.id)) && (
                          <Ionicons name="checkmark" size={16} color={COLORS.white} />
                        )}
                      </View>
                      <Text style={styles.checkboxText}>{categoria.nome}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Intervalo de Valor */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Intervalo de Valor</Text>
              <View style={styles.rangeInputs}>
                <View style={styles.rangeInput}>
                  <Text style={styles.rangeLabel}>Mínimo</Text>
                  <View style={styles.valueInputContainer}>
                    <Text style={styles.currencySymbol}>R$</Text>
                    <TextInput
                      style={styles.valueInput}
                      placeholder="0,00"
                      placeholderTextColor={COLORS.textTertiary}
                      value={filtrosTemp.valorMin}
                      onChangeText={(text) => setFiltrosTemp({ ...filtrosTemp, valorMin: text })}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                <View style={styles.rangeSeparator}>
                  <Ionicons name="remove-outline" size={20} color={COLORS.textSecondary} />
                </View>
                <View style={styles.rangeInput}>
                  <Text style={styles.rangeLabel}>Máximo</Text>
                  <View style={styles.valueInputContainer}>
                    <Text style={styles.currencySymbol}>R$</Text>
                    <TextInput
                      style={styles.valueInput}
                      placeholder="0,00"
                      placeholderTextColor={COLORS.textTertiary}
                      value={filtrosTemp.valorMax}
                      onChangeText={(text) => setFiltrosTemp({ ...filtrosTemp, valorMax: text })}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Características */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Características</Text>
              <TouchableOpacity
                style={styles.switchItem}
                onPress={() =>
                  setFiltrosTemp({ ...filtrosTemp, apenasParcelado: !filtrosTemp.apenasParcelado })
                }
              >
                <View style={styles.switchLabel}>
                  <Ionicons name="card-outline" size={20} color={COLORS.textSecondary} />
                  <Text style={styles.switchText}>Apenas parceladas</Text>
                </View>
                <View
                  style={[
                    styles.customSwitch,
                    filtrosTemp.apenasParcelado && styles.customSwitchActive,
                  ]}
                >
                  <View
                    style={[
                      styles.customSwitchThumb,
                      filtrosTemp.apenasParcelado && styles.customSwitchThumbActive,
                    ]}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.switchItem}
                onPress={() =>
                  setFiltrosTemp({
                    ...filtrosTemp,
                    apenasRecorrente: !filtrosTemp.apenasRecorrente,
                  })
                }
              >
                <View style={styles.switchLabel}>
                  <Ionicons name="repeat-outline" size={20} color={COLORS.textSecondary} />
                  <Text style={styles.switchText}>Apenas recorrentes</Text>
                </View>
                <View
                  style={[
                    styles.customSwitch,
                    filtrosTemp.apenasRecorrente && styles.customSwitchActive,
                  ]}
                >
                  <View
                    style={[
                      styles.customSwitchThumb,
                      filtrosTemp.apenasRecorrente && styles.customSwitchThumbActive,
                    ]}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.clearButton} onPress={handleLimparFiltros}>
              <Ionicons name="close-circle-outline" size={20} color={COLORS.textSecondary} />
              <Text style={styles.clearButtonText}>Limpar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleAplicar}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
              <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    gap: 6,
  },
  typeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeButtonText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: COLORS.white,
  },
  checkboxList: {
    gap: 12,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkboxLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  checkboxText: {
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  institutionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textTertiary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 12,
  },
  rangeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rangeInput: {
    flex: 1,
  },
  rangeLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  valueInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
  },
  currencySymbol: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginRight: 6,
  },
  valueInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    padding: 0,
  },
  rangeSeparator: {
    paddingTop: 20,
  },
  switchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  switchText: {
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  customSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.borderDark,
    padding: 2,
    justifyContent: 'center',
  },
  customSwitchActive: {
    backgroundColor: COLORS.primaryLight,
  },
  customSwitchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  customSwitchThumbActive: {
    transform: [{ translateX: 22 }],
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  clearButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    gap: 6,
  },
  clearButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  applyButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    gap: 6,
  },
  applyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clearPeriodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearPeriodText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  periodButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  periodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    gap: 4,
  },
  periodButtonText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  customPeriodContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.background,
  },
  customPeriodLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 10,
    fontWeight: '500',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    gap: 8,
  },
  dateInputText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    padding: 0,
  },
});
