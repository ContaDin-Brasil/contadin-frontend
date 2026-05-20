import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Linking,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAjuda } from './hooks/useAjuda';
import { useLayoutRtl } from './hooks/useLayoutRtl';
import {
  CONTATOS,
  EXIBIR_CHATBOT_AJUDA,
  EXIBIR_OUTROS_CANAIS_AJUDA,
  FAQ_ITENS,
  OUTROS_CONTATOS,
} from './constants/constantesConfiguracao';
import SeletorIdiomaAjuda from './componentes/SeletorIdiomaAjuda';
import { styles } from './styles/TelaAjuda.styles';

const CHAT_MENSAGENS = [
  {
    id: 'chat-01',
    from: 'bot',
    text: 'Oi! Sou o Contadin Bot. Quer ajuda para organizar suas financas?',
    time: '10:24'
  },
  {
    id: 'chat-02',
    from: 'user',
    text: 'Quero organizar meu orcamento mensal e cortar gastos desnecessarios.',
    time: '10:25'
  },
  {
    id: 'chat-03',
    from: 'bot',
    text: 'Comece listando receitas e gastos fixos. Depois, defina um teto para variaveis.',
    time: '10:25'
  },
  {
    id: 'chat-04',
    from: 'user',
    text: 'Qual regra simples posso usar?',
    time: '10:26'
  },
  {
    id: 'chat-05',
    from: 'bot',
    text: 'A regra 50-30-20 funciona bem: 50% necessidades, 30% desejos, 20% reserva.',
    time: '10:26'
  },
  {
    id: 'chat-06',
    from: 'bot',
    text: 'Quer que eu crie categorias basicas e metas de gasto para voce?',
    time: '10:27'
  }
];

const HelpScreen = ({ navigation }) => {
  const ajuda = useAjuda();
  const { t } = useTranslation();
  const rtl = useLayoutRtl();
  const exibirSeletorIdioma = ajuda.selectedTab === 'FAQ';

  const handleOpenEmail = () => {
    Linking.openURL(`mailto:${CONTATOS.email}`);
  };

  const handleOpenLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <Ionicons
            name={rtl.isRtl ? 'arrow-forward' : 'arrow-back'}
            size={28}
            color="#000"
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, rtl.texto]}>{t('ajuda.titulo')}</Text>
        {exibirSeletorIdioma && (
          <View style={styles.seletorIdiomaHeader}>
            <SeletorIdiomaAjuda />
          </View>
        )}
      </View>
      <View style={styles.body}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, ajuda.selectedTab === 'FAQ' && styles.activeTab]}
            onPress={() => ajuda.setSelectedTab('FAQ')}
          >
            <Text style={[styles.tabText, ajuda.selectedTab === 'FAQ' && styles.activeTabText]}>FAQ</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, ajuda.selectedTab === 'Contato' && styles.activeTab]}
            onPress={() => ajuda.setSelectedTab('Contato')}
          >
            <Text style={[styles.tabText, ajuda.selectedTab === 'Contato' && styles.activeTabText]}>Contato</Text>
          </TouchableOpacity>
          
          {EXIBIR_CHATBOT_AJUDA && (
            <TouchableOpacity
              style={[styles.tab, ajuda.selectedTab === 'ChatBot' && styles.activeTab]}
              onPress={() => ajuda.setSelectedTab('ChatBot')}
            >
              <Text style={[styles.tabText, ajuda.selectedTab === 'ChatBot' && styles.activeTabText]}>
                ChatBot
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {EXIBIR_CHATBOT_AJUDA && ajuda.selectedTab === 'ChatBot' ? (
          <KeyboardAvoidingView
            style={styles.chatContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
          >
            <Text style={styles.chatTitle}>Conversa recente</Text>
            <ScrollView
              style={styles.chatScroll}
              contentContainerStyle={styles.chatScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.chatList}>
                {CHAT_MENSAGENS.map((mensagem) => {
                  const isUser = mensagem.from === 'user';

                  return (
                    <View
                      key={mensagem.id}
                      style={[styles.chatRow, isUser ? styles.chatRowUser : styles.chatRowBot]}
                    >
                      {!isUser && (
                        <View style={[styles.chatAvatar, styles.chatAvatarBot]}>
                          <Text style={styles.chatAvatarText}>CB</Text>
                        </View>
                      )}

                      <View style={[styles.chatBubble, isUser ? styles.chatBubbleUser : styles.chatBubbleBot]}>
                        <Text style={[styles.chatText, isUser && styles.chatTextUser]}>{mensagem.text}</Text>
                        <Text style={[styles.chatTime, isUser && styles.chatTimeUser]}>{mensagem.time}</Text>
                      </View>

                      {isUser && (
                        <View style={[styles.chatAvatar, styles.chatAvatarUser]}>
                          <Text style={[styles.chatAvatarText, styles.chatAvatarTextUser]}>VC</Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </ScrollView>

            <View style={styles.chatComposer}>
              <Ionicons name="attach-outline" size={20} color="#666" />
              <TextInput
                style={styles.chatInput}
                placeholder="Envie uma mensagem"
                placeholderTextColor="#999"
              />
              <View style={styles.chatComposerActions}>
                <Ionicons name="mic-outline" size={20} color="#666" />
                <Ionicons name="send" size={20} color="#0066FF" />
              </View>
            </View>
          </KeyboardAvoidingView>
        ) : (
          <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              {ajuda.selectedTab === 'Contato' && (
                <View>
                  <TouchableOpacity 
                    style={styles.contactItem}
                    onPressIn={ajuda.toggleEmail}
                  >
                    <View style={styles.contactHeader}>
                      <Ionicons name="mail-outline" size={24} color="#000" />
                      <Text style={styles.contactTitle}>Email</Text>
                    </View>
                    <Ionicons name={ajuda.emailExpanded ? 'chevron-up' : 'chevron-down'} size={24} color="#000" />
                  </TouchableOpacity>

                  {ajuda.emailExpanded && (
                    <View style={styles.expandedContent}>
                      <Text style={styles.contactInfo}>{CONTATOS.email}</Text>
                      <TouchableOpacity
                        style={styles.linkButton}
                        onPressIn={handleOpenEmail}
                      >
                        <Text style={styles.linkButtonText}>Enviar email</Text>
                        <Ionicons name="open-outline" size={18} color="#1A73E8" />
                      </TouchableOpacity>
                    </View>
                  )}

                  <TouchableOpacity 
                    style={styles.contactItem}
                    onPressIn={ajuda.toggleWhatsapp}
                  >
                    <View style={styles.contactHeader}>
                      <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
                      <Text style={styles.contactTitle}>Whatsapp</Text>
                    </View>
                    <Ionicons name={ajuda.whatsappExpanded ? 'chevron-up' : 'chevron-down'} size={24} color="#000" />
                  </TouchableOpacity>

                  {ajuda.whatsappExpanded && (
                    <View style={styles.expandedContent}>
                      <Text style={styles.contactInfo}>{CONTATOS.whatsapp}</Text>
                      <TouchableOpacity
                        style={styles.linkButton}
                        onPressIn={() => handleOpenLink(CONTATOS.whatsappLink)}
                      >
                        <Text style={styles.linkButtonText}>Abrir WhatsApp</Text>
                        <Ionicons name="open-outline" size={18} color="#1A73E8" />
                      </TouchableOpacity>
                    </View>
                  )}

                  {EXIBIR_OUTROS_CANAIS_AJUDA && (
                    <View style={styles.contactSection}>
                      <Text style={styles.sectionTitle}>Outros canais</Text>
                      {OUTROS_CONTATOS.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          style={styles.channelItem}
                          onPressIn={() => handleOpenLink(item.url)}
                        >
                          <View style={styles.channelHeader}>
                            <Ionicons name={item.icon} size={22} color="#000" />
                            <Text style={styles.channelTitle}>{item.titulo}</Text>
                          </View>
                          <View style={styles.channelRight}>
                            <Text style={styles.channelValue}>{item.valor}</Text>
                            <Ionicons name="open-outline" size={18} color="#666" />
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              )}

              {ajuda.selectedTab === 'FAQ' && (
                <View style={rtl.container}>
                  {FAQ_ITENS.map((item) => {
                    const isExpanded = ajuda.faqExpandedIds.includes(item.id);

                    return (
                      <View key={item.id}>
                        <TouchableOpacity
                          style={[styles.accordionItem, rtl.row]}
                          onPressIn={() => ajuda.toggleFaqItem(item.id)}
                        >
                          <View style={[styles.accordionHeader, rtl.row]}>
                            <Ionicons name="help-circle-outline" size={22} color="#000" />
                            <Text style={[styles.accordionTitle, rtl.texto]}>
                              {t(`faq.${item.id}.pergunta`)}
                            </Text>
                          </View>
                          <Ionicons
                            name={isExpanded ? 'chevron-up' : 'chevron-down'}
                            size={24}
                            color="#000"
                          />
                        </TouchableOpacity>

                        {isExpanded && (
                          <View style={styles.accordionContent}>
                            <Text style={[styles.accordionText, rtl.texto]}>
                              {t(`faq.${item.id}.resposta`)}
                            </Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default HelpScreen;
