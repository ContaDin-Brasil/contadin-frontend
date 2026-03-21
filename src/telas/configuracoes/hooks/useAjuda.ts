/**
 * Hook para gerenciar tela de ajuda (tabs e accordions)
 */
import { useState } from 'react';
import { TabAjuda } from '../types/configuracoes.types';

export const useAjuda = () => {
  const [selectedTab, setSelectedTab] = useState<TabAjuda>('FAQ');
  const [emailExpanded, setEmailExpanded] = useState(false);
  const [whatsappExpanded, setWhatsappExpanded] = useState(false);
  const [faqExpandedIds, setFaqExpandedIds] = useState<string[]>([]);

  const toggleEmail = () => {
    setEmailExpanded(!emailExpanded);
  };

  const toggleWhatsapp = () => {
    setWhatsappExpanded(!whatsappExpanded);
  };

  const toggleFaqItem = (id: string) => {
    setFaqExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  return {
    selectedTab,
    setSelectedTab,
    emailExpanded,
    setEmailExpanded,
    whatsappExpanded,
    setWhatsappExpanded,
    faqExpandedIds,
    setFaqExpandedIds,
    toggleEmail,
    toggleWhatsapp,
    toggleFaqItem
  };
};
