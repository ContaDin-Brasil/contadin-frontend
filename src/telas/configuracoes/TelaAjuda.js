import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAjuda } from './hooks/useAjuda';
import { CONTATOS } from './constants/constantesConfiguracao';
import { styles } from './styles/TelaAjuda.styles';

const HelpScreen = ({ navigation }) => {
  const ajuda = useAjuda();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Ajuda e Contato</Text>
      </View>

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
        
        <TouchableOpacity 
          style={[styles.tab, ajuda.selectedTab === 'ChatBot' && styles.activeTab]}
          onPress={() => ajuda.setSelectedTab('ChatBot')}
        >
          <Text style={[styles.tabText, ajuda.selectedTab === 'ChatBot' && styles.activeTabText]}>ChatBot</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {ajuda.selectedTab === 'Contato' && (
          <View>
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={ajuda.toggleEmail}
            >
              <View style={styles.contactHeader}>
                <Ionicons name="mail-outline" size={24} color="#000" />
                <Text style={styles.contactTitle}>Email</Text>
              </View>
              <Ionicons name={ajuda.emailExpanded ? 'chevron-up' : 'chevron-down'} size={24} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.contactItem}
              onPress={ajuda.toggleWhatsapp}
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
              </View>
            )}
          </View>
        )}

        {ajuda.selectedTab === 'FAQ' && (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>FAQ - Perguntas Frequentes</Text>
          </View>
        )}

        {ajuda.selectedTab === 'ChatBot' && (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>ChatBot - Em breve</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default HelpScreen;
