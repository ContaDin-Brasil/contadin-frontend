import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Modal,
  Pressable,
} from "react-native";
import TituloPagina from "../../../componentes/TituloPagina";
import { useSelecaoBancos } from "./hooks/useSelecaoBancos";
import { getLogoByName } from "../../../componentes/modais/logosInstituicoes";
import { useTheme } from "../../../contexts/ThemeContext";
import { getColorsByTheme } from "../../../styles/colors";
import { getStyles } from "./styles/TelaSelecaoBancos.styles";

function TelaSelecaoBancos({ navigation, route }) {
  const { token, user } = route.params || {};
  const rawUserId =
    user && typeof user === "object" && "id" in user ? user.id : null;
  const userId =
    typeof rawUserId === "string" || typeof rawUserId === "number"
      ? rawUserId
      : null;
  const sel = useSelecaoBancos(userId);
  const { isDarkMode } = useTheme();
  const COLORS = getColorsByTheme(isDarkMode);
  const styles = getStyles(isDarkMode);

  const onSelecionar = async () => {
    await sel.handleContinuar(navigation, token, user);
  };

  const renderBanco = (banco) => {
    const logo = getLogoByName(banco.nome);
    const selected = sel.selecionados.has(banco.id);
    return (
      <TouchableOpacity
        key={banco.id}
        style={[
          styles.bankCard,
          { borderColor: banco.cor },
          selected && styles.bankCardSelected,
        ]}
        onPress={() => sel.toggleSelecao(banco.id)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.bankCardIcon,
              { backgroundColor: logo ? COLORS.backgroundLight : banco.cor },
          ]}
        >
          {logo ? (
            <Image
              source={logo}
              style={styles.bankLogo}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.bankIconText}>{banco.icone}</Text>
          )}
        </View>
        <Text style={styles.bankName} numberOfLines={1}>
          {banco.nome}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TituloPagina
        mostrarBotaoVoltar={true}
        onVoltar={() => navigation.goBack()}
      >
        Quais Bancos você utiliza no seu dia a dia?
      </TituloPagina>

      <Modal
        visible={true}
        transparent={true}
        animationType="slide"
      >
        <Pressable style={styles.overlay}>
          <Pressable
            style={styles.modalContainer}
            onPress={(e) => e.stopPropagation()}
          >
            <ScrollView
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollContent}
            >
              <Text style={styles.modalTitle}>Selecione uma Instituição:</Text>

              <View style={styles.grid}>{sel.bancos.map(renderBanco)}</View>

              <TouchableOpacity
                style={styles.linkAdicionar}
                onPress={() =>
                  navigation.navigate("CadastroInstituicao", {
                    token: route.params?.token,
                    user: route.params?.user,
                  })
                }
                activeOpacity={0.8}
              >
                <Text style={styles.linkAdicionarText}>
                  Seu banco não está na lista?{" "}
                  <Text style={styles.linkAdicionarBold}>Adicionar</Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.selecionarButton}
                onPress={onSelecionar}
                disabled={sel.loading}
              >
                <Text style={styles.selecionarButtonText}>
                  {sel.loading ? "Salvando..." : "Selecionar"}
                </Text>
              </TouchableOpacity>

              {sel.error ? (
                <Text style={styles.mensagemErro}>{sel.error}</Text>
              ) : null}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

export default TelaSelecaoBancos;
