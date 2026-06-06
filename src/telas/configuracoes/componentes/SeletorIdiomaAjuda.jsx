import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { IDIOMAS_AJUDA } from '../../../../i18n/constantesIdiomas';
import { useLayoutRtl } from '../hooks/useLayoutRtl';
import { useTheme } from '../../../contexts/ThemeContext';
import { getColorsByTheme } from '../../../styles/colors';
import BandeiraFlag from './BandeiraFlag';
import { getStyles } from '../styles/SeletorIdiomaAjuda.styles';

const SeletorIdiomaAjuda = () => {
  const { i18n, t } = useTranslation();
  const rtl = useLayoutRtl();
  const { isDarkMode } = useTheme();
  const COLORS = getColorsByTheme(isDarkMode);
  const styles = getStyles(isDarkMode);
  const [modalVisivel, setModalVisivel] = useState(false);

  const idiomaAtual =
    IDIOMAS_AJUDA.find((item) => item.codigo === i18n.language) || IDIOMAS_AJUDA[0];

  const alterarIdioma = (codigo) => {
    i18n.changeLanguage(codigo);
    setModalVisivel(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.seletor}
        onPress={() => setModalVisivel(true)}
        accessibilityLabel={t('ajuda.selecionar_idioma')}
        accessibilityRole="button"
      >
        <BandeiraFlag codigo={idiomaAtual.bandeira} largura={32} altura={24} />
        <Ionicons name="chevron-down" size={16} color={COLORS.textPrimary} />
      </TouchableOpacity>

      <Modal
        visible={modalVisivel}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisivel(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setModalVisivel(false)}>
          <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitulo}>{t('ajuda.idioma_modal')}</Text>
            <FlatList
              data={IDIOMAS_AJUDA}
              keyExtractor={(item) => item.codigo}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const selecionado = item.codigo === i18n.language;

                return (
                  <TouchableOpacity
                    style={[styles.opcao, rtl.row, selecionado && styles.opcaoSelecionada]}
                    onPress={() => alterarIdioma(item.codigo)}
                  >
                    <BandeiraFlag codigo={item.bandeira} largura={28} altura={21} />
                    <Text
                      style={[
                        styles.opcaoTexto,
                        rtl.texto,
                        selecionado && styles.opcaoTextoSelecionado,
                      ]}
                    >
                      {t(`idiomas.${item.codigo}`)}
                    </Text>
                    {selecionado && <Ionicons name="checkmark" size={20} color={COLORS.primary} />}
                  </TouchableOpacity>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

export default SeletorIdiomaAjuda;
