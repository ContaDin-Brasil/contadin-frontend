/**
 * Hook para gerenciar tela de ajuda (tabs e accordions)
 */
import { useState } from 'react';
import { TabAjuda } from '../types/configuracoes.types';

export const useAjuda = () => {
  const [selectedTab, setSelectedTab] = useState<TabAjuda>('FAQ');
  const [emailExpanded, setEmailExpanded] = useState(false);
  const [whatsappExpanded, setWhatsappExpanded] = useState(true);

  const toggleEmail = () => {
    setEmailExpanded(!emailExpanded);
  };

  const toggleWhatsapp = () => {
    setWhatsappExpanded(!whatsappExpanded);
  };

  return {
    selectedTab,
    setSelectedTab,
    emailExpanded,
    setEmailExpanded,
    whatsappExpanded,
    setWhatsappExpanded,
    toggleEmail,
    toggleWhatsapp
  };
};
