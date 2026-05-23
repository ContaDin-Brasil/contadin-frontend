import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import { IDIOMAS_AJUDA, IDIOMA_AJUDA_PADRAO } from './constantesIdiomas';

import ptBR from './idiomas/pt-BR.json';
import ptPT from './idiomas/pt-PT.json';
import ar from './idiomas/ar.json';
import zh from './idiomas/zh.json';
import enUS from './idiomas/en-US.json';
import enGB from './idiomas/en-GB.json';
import ru from './idiomas/ru.json';
import ja from './idiomas/ja.json';
import fr from './idiomas/fr.json';
import es419 from './idiomas/es-419.json';
import esES from './idiomas/es-ES.json';
import ca from './idiomas/ca.json';
import de from './idiomas/de.json';

const supportedLanguages = IDIOMAS_AJUDA.map((idioma) => idioma.codigo);

const resolverIdiomaInicial = () => {
  try {
    const locale = getLocales()?.[0];
    const deviceLanguage = locale?.languageTag || locale?.languageCode || IDIOMA_AJUDA_PADRAO;
    if (supportedLanguages.includes(deviceLanguage)) return deviceLanguage;
    const porPrefixo = supportedLanguages.find((code) =>
      deviceLanguage.startsWith(code.split('-')[0])
    );
    if (porPrefixo) return porPrefixo;
  } catch {
    // expo-localization indisponível fora do runtime Expo
  }
  return IDIOMA_AJUDA_PADRAO;
};

const normalizedDevice = resolverIdiomaInicial();

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: normalizedDevice,
  fallbackLng: IDIOMA_AJUDA_PADRAO,
  supportedLngs: supportedLanguages,
  resources: {
    'pt-BR': { translation: ptBR },
    'pt-PT': { translation: ptPT },
    ar: { translation: ar },
    zh: { translation: zh },
    'en-US': { translation: enUS },
    'en-GB': { translation: enGB },
    ru: { translation: ru },
    ja: { translation: ja },
    fr: { translation: fr },
    'es-419': { translation: es419 },
    'es-ES': { translation: esES },
    ca: { translation: ca },
    de: { translation: de },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
