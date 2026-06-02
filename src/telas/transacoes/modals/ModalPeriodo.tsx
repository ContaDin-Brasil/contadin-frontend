import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { getColorsByTheme } from '../../../styles/colors';

interface ModalPeriodoProps {
  visible: boolean;
  onClose: () => void;
  periodoAtual: string;
  dataInicio: string;
  dataFim: string;
  onAplicarPeriodo: (periodo: string, dataInicio: string, dataFim: string) => void;
}

export const ModalPeriodo: React.FC<ModalPeriodoProps> = ({
  visible,
  onClose,
  periodoAtual,
  dataInicio,
  dataFim,
  onAplicarPeriodo,
}) => {
  const { isDarkMode } = useTheme();
  const COLORS = getColorsByTheme(isDarkMode);
  const styles = getModalPeriodoStyles(COLORS);
  const [periodoSelecionado, setPeriodoSelecionado] = useState(periodoAtual);
  const [dataInicioTemp, setDataInicioTemp] = useState(dataInicio);
  const [dataFimTemp, setDataFimTemp] = useState(dataFim);

  useEffect(() => {
    if (visible) {
      setPeriodoSelecionado(periodoAtual);
      setDataInicioTemp(dataInicio);
      setDataFimTemp(dataFim);
    }
  }, [visible, periodoAtual, dataInicio, dataFim]);

  // Funções auxiliares
  const formatarData = (date: Date): string => {
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const handleDataInicioChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length >= 2) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    if (cleaned.length >= 4) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8);
    }
    setDataInicioTemp(formatted);
    setPeriodoSelecionado('Personalizado');
  };

  const handleDataFimChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length >= 2) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    if (cleaned.length >= 4) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8);
    }
    setDataFimTemp(formatted);
    setPeriodoSelecionado('Personalizado');
  };

  const selecionarPeriodo = (nome: string, inicio: string, fim: string) => {
    setPeriodoSelecionado(nome);
    setDataInicioTemp(inicio);
    setDataFimTemp(fim);
  };

  const handleAplicar = () => {
    onAplicarPeriodo(periodoSelecionado, dataInicioTemp, dataFimTemp);
    onClose();
  };

  // Períodos predefinidos
  const periodos = [
    {
      id: 'completo',
      nome: 'Período Completo',
      icon: 'infinite-outline' as const,
      calcular: () => {
        selecionarPeriodo('Período Completo', '', '');
      },
    },
    {
      id: 'hoje',
      nome: 'Hoje',
      icon: 'today-outline' as const,
      calcular: () => {
        const hoje = new Date();
        const dataFormatada = formatarData(hoje);
        selecionarPeriodo('Hoje', dataFormatada, dataFormatada);
      },
    },
    {
      id: 'semana',
      nome: 'Esta Semana',
      icon: 'calendar-outline' as const,
      calcular: () => {
        const hoje = new Date();
        const diaSemana = hoje.getDay();
        const inicio = new Date(hoje);
        inicio.setDate(hoje.getDate() - diaSemana);
        const fim = new Date(inicio);
        fim.setDate(inicio.getDate() + 6);
        selecionarPeriodo('Esta Semana', formatarData(inicio), formatarData(fim));
      },
    },
    {
      id: 'mes',
      nome: 'Este Mês',
      icon: 'calendar-number-outline' as const,
      calcular: () => {
        const hoje = new Date();
        const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        const fim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
        selecionarPeriodo('Este Mês', formatarData(inicio), formatarData(fim));
      },
    },
    {
      id: '30dias',
      nome: 'Últimos 30 Dias',
      icon: 'time-outline' as const,
      calcular: () => {
        const hoje = new Date();
        const inicio = new Date(hoje);
        inicio.setDate(hoje.getDate() - 30);
        selecionarPeriodo('Últimos 30 Dias', formatarData(inicio), formatarData(hoje));
      },
    },
    {
      id: '90dias',
      nome: 'Últimos 90 Dias',
      icon: 'timer-outline' as const,
      calcular: () => {
        const hoje = new Date();
        const inicio = new Date(hoje);
        inicio.setDate(hoje.getDate() - 90);
        selecionarPeriodo('Últimos 90 Dias', formatarData(inicio), formatarData(hoje));
      },
    },
    {
      id: 'ano',
      nome: 'Este Ano',
      icon: 'calendar' as const,
      calcular: () => {
        const hoje = new Date();
        const inicio = new Date(hoje.getFullYear(), 0, 1);
        const fim = new Date(hoje.getFullYear(), 11, 31);
        selecionarPeriodo('Este Ano', formatarData(inicio), formatarData(fim));
      },
    },
  ];

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
              <Ionicons name="calendar-outline" size={24} color={COLORS.primary} />
              <Text style={styles.title}>Selecionar Período</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Períodos Rápidos */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Períodos Rápidos</Text>
              <View style={styles.periodButtonsGrid}>
                {periodos.map((periodo) => (
                  <TouchableOpacity
                    key={periodo.id}
                    style={[
                      styles.periodCard,
                      periodoSelecionado === periodo.nome && styles.periodCardActive,
                    ]}
                    onPress={periodo.calcular}
                  >
                    <Ionicons
                      name={periodo.icon}
                      size={24}
                      color={periodoSelecionado === periodo.nome ? COLORS.white : COLORS.primary}
                    />
                    <Text
                      style={[
                        styles.periodCardText,
                        periodoSelecionado === periodo.nome && styles.periodCardTextActive,
                      ]}
                    >
                      {periodo.nome}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Período Personalizado */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Período Personalizado</Text>
              <View style={styles.customPeriodContainer}>
                <View style={styles.dateInputWrapper}>
                  <Text style={styles.dateLabel}>Data Inicial</Text>
                  <View style={styles.dateInputContainer}>
                    <Ionicons name="calendar-outline" size={20} color={COLORS.textSecondary} />
                    <TextInput
                      style={styles.dateInput}
                      placeholder="DD/MM/AAAA"
                      placeholderTextColor={COLORS.textTertiary}
                      value={dataInicioTemp}
                      onChangeText={handleDataInicioChange}
                      keyboardType="numeric"
                      maxLength={10}
                    />
                  </View>
                </View>

                <View style={styles.arrowContainer}>
                  <Ionicons name="arrow-forward" size={20} color={COLORS.textSecondary} />
                </View>

                <View style={styles.dateInputWrapper}>
                  <Text style={styles.dateLabel}>Data Final</Text>
                  <View style={styles.dateInputContainer}>
                    <Ionicons name="calendar-outline" size={20} color={COLORS.textSecondary} />
                    <TextInput
                      style={styles.dateInput}
                      placeholder="DD/MM/AAAA"
                      placeholderTextColor={COLORS.textTertiary}
                      value={dataFimTemp}
                      onChangeText={handleDataFimChange}
                      keyboardType="numeric"
                      maxLength={10}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Preview */}
            {(dataInicioTemp || dataFimTemp) && (
              <View style={styles.previewContainer}>
                <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
                <Text style={styles.previewText}>
                  {dataInicioTemp && dataFimTemp
                    ? `De ${dataInicioTemp} até ${dataFimTemp}`
                    : dataInicioTemp
                    ? `A partir de ${dataInicioTemp}`
                    : `Até ${dataFimTemp}`}
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleAplicar}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
              <Text style={styles.applyButtonText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const getModalPeriodoStyles = (COLORS) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.backgroundLight,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
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
  closeButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  periodButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  periodCard: {
    width: '48%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    gap: 8,
  },
  periodCardActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  periodCardText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  periodCardTextActive: {
    color: COLORS.white,
  },
  customPeriodContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  dateInputWrapper: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    gap: 8,
  },
  dateInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    padding: 0,
  },
  arrowContainer: {
    paddingBottom: 12,
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: COLORS.primaryLighter,
    borderRadius: 8,
    marginBottom: 20,
  },
  previewText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
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
});
