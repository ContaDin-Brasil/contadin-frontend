import { useTranslation } from 'react-i18next';
import { ehIdiomaRtl } from '../../../../i18n/rtl';

/**
 * Estilos de layout para idiomas RTL (ex.: árabe)
 */
export const useLayoutRtl = () => {
  const { i18n } = useTranslation();
  const isRtl = ehIdiomaRtl(i18n.language);

  return {
    isRtl,
    container: isRtl ? { direction: 'rtl' as const } : undefined,
    texto: {
      textAlign: (isRtl ? 'right' : 'left') as 'right' | 'left',
      writingDirection: (isRtl ? 'rtl' : 'ltr') as 'rtl' | 'ltr',
    },
    row: {
      flexDirection: (isRtl ? 'row-reverse' : 'row') as 'row-reverse' | 'row',
    },
  };
};
