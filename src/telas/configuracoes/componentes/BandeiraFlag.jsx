import React from 'react';
import { View } from 'react-native';
import { styles } from '../styles/BandeiraFlag.styles';

import Br from 'flag-icons/flags/4x3/br.svg';
import Pt from 'flag-icons/flags/4x3/pt.svg';
import Sa from 'flag-icons/flags/4x3/sa.svg';
import Cn from 'flag-icons/flags/4x3/cn.svg';
import Us from 'flag-icons/flags/4x3/us.svg';
import Gb from 'flag-icons/flags/4x3/gb.svg';
import Ru from 'flag-icons/flags/4x3/ru.svg';
import Jp from 'flag-icons/flags/4x3/jp.svg';
import Fr from 'flag-icons/flags/4x3/fr.svg';
import Mx from 'flag-icons/flags/4x3/mx.svg';
import Es from 'flag-icons/flags/4x3/es.svg';
import EsCt from 'flag-icons/flags/4x3/es-ct.svg';
import De from 'flag-icons/flags/4x3/de.svg';

const BANDEIRAS = {
  br: Br,
  pt: Pt,
  sa: Sa,
  cn: Cn,
  us: Us,
  gb: Gb,
  ru: Ru,
  jp: Jp,
  fr: Fr,
  mx: Mx,
  es: Es,
  'es-ct': EsCt,
  de: De,
};

/**
 * Bandeira SVG via flag-icons (proporção 4x3)
 */
const BandeiraFlag = ({ codigo, largura = 28, altura = 21 }) => {
  const SvgComponent = BANDEIRAS[codigo];

  if (!SvgComponent) {
    return null;
  }

  return (
    <View style={[styles.container, { width: largura, height: altura }]}>
      <SvgComponent width={largura} height={altura} />
    </View>
  );
};

export default BandeiraFlag;
