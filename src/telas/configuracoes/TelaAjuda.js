import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HelpScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('FAQ');
  const [emailExpanded, setEmailExpanded] = useState(false);
  const [whatsappExpanded, setWhatsappExpanded] = useState(true);

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
          style={[styles.tab, selectedTab === 'FAQ' && styles.activeTab]}
          onPress={() => setSelectedTab('FAQ')}
        >
          <Text style={[styles.tabText, selectedTab === 'FAQ' && styles.activeTabText]}>FAQ</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'Contato' && styles.activeTab]}
          onPress={() => setSelectedTab('Contato')}
        >
          <Text style={[styles.tabText, selectedTab === 'Contato' && styles.activeTabText]}>Contato</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'ChatBot' && styles.activeTab]}
          onPress={() => setSelectedTab('ChatBot')}
        >
          <Text style={[styles.tabText, selectedTab === 'ChatBot' && styles.activeTabText]}>ChatBot</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {selectedTab === 'Contato' && (
          <View>
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={() => setEmailExpanded(!emailExpanded)}
            >
              <View style={styles.contactHeader}>
                <Ionicons name="mail-outline" size={24} color="#000" />
                <Text style={styles.contactTitle}>Email</Text>
              </View>
              <Ionicons name={emailExpanded ? 'chevron-up' : 'chevron-down'} size={24} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.contactItem}
              onPress={() => setWhatsappExpanded(!whatsappExpanded)}
            >
              <View style={styles.contactHeader}>
                <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
                <Text style={styles.contactTitle}>Whatsapp</Text>
              </View>
              <Ionicons name={whatsappExpanded ? 'chevron-up' : 'chevron-down'} size={24} color="#000" />
            </TouchableOpacity>

            {whatsappExpanded && (
              <View style={styles.expandedContent}>
                <Text style={styles.contactInfo}>(11) 94002-8922</Text>
              </View>
            )}
          </View>
        )}

        {selectedTab === 'FAQ' && (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>FAQ - Perguntas Frequentes</Text>
          </View>
        )}

        {selectedTab === 'ChatBot' && (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>ChatBot - Em breve</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#B8DBFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  content: {
    marginTop: 20,
  },
  contactItem: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  expandedContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    marginTop: -8,
    marginBottom: 12,
  },
  contactInfo: {
    fontSize: 16,
    color: '#333',
  },
  placeholderContainer: {
    backgroundColor: '#FFF',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    color: '#666',
  },
});

export default HelpScreen;
