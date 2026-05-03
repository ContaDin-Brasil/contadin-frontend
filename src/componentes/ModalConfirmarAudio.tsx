import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { COLORS } from '../styles/colors';

interface Props {
  visible: boolean;
  audioUri: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const ModalConfirmarAudio: React.FC<Props> = ({
  visible,
  audioUri,
  onConfirm,
  onCancel,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const webAudioRef = useRef<HTMLAudioElement | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  // Limpa o player quando o modal fecha
  useEffect(() => {
    if (!visible) {
      _cleanup();
      setIsPlaying(false);
      setPosition(0);
      setDuration(0);
    }
  }, [visible]);

  const _cleanup = async () => {
    if (Platform.OS === 'web') {
      if (webAudioRef.current) {
        webAudioRef.current.pause();
        webAudioRef.current = null;
      }
    } else {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    }
  };

  const togglePlay = async () => {
    if (!audioUri) return;

    if (Platform.OS === 'web') {
      if (!webAudioRef.current) {
        const audio = new (window as any).Audio(audioUri);
        audio.onloadedmetadata = () => {
          setDuration(Math.round(audio.duration * 1000));
        };
        audio.ontimeupdate = () => {
          setPosition(Math.round(audio.currentTime * 1000));
        };
        audio.onended = () => {
          setIsPlaying(false);
          setPosition(0);
        };
        webAudioRef.current = audio;
      }

      if (isPlaying) {
        webAudioRef.current.pause();
        setIsPlaying(false);
      } else {
        await webAudioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      if (!soundRef.current) {
        const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setPosition(status.positionMillis);
            setDuration(status.durationMillis ?? 0);
            if (status.didJustFinish) {
              setIsPlaying(false);
              setPosition(0);
            }
          }
        });
        soundRef.current = sound;
      }

      if (isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await soundRef.current.playAsync();
        setIsPlaying(true);
      }
    }
  };

  const formatTime = (ms: number): string => {
    const total = Math.floor(ms / 1000);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progress = duration > 0 ? Math.min(position / duration, 1) : 0;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>

          {/* Cabeçalho */}
          <View style={styles.header}>
            <Ionicons name="mic" size={22} color={COLORS.primaryLight} />
            <Text style={styles.title}>Confirmar áudio</Text>
          </View>
          <Text style={styles.subtitle}>Ouça antes de enviar para a IA</Text>

          {/* Player */}
          <View style={styles.player}>
            <TouchableOpacity onPress={togglePlay} style={styles.playButton}>
              <Ionicons
                name={isPlaying ? 'pause-circle' : 'play-circle'}
                size={52}
                color={COLORS.primary}
              />
            </TouchableOpacity>

            <View style={styles.playerInfo}>
              {/* Barra de progresso */}
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` as any }]} />
              </View>

              {/* Tempos */}
              <View style={styles.timeRow}>
                <Text style={styles.timeText}>{formatTime(position)}</Text>
                <Text style={styles.timeText}>
                  {duration > 0 ? formatTime(duration) : '--:--'}
                </Text>
              </View>
            </View>
          </View>

          {/* Botões */}
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Ionicons name="trash-outline" size={18} color={COLORS.error} />
              <Text style={styles.cancelText}>Descartar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Ionicons name="send" size={16} color={COLORS.white} />
              <Text style={styles.confirmText}>Enviar</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 380,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  player: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: COLORS.secondaryLighter,
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
  },
  playButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerInfo: {
    flex: 1,
    gap: 6,
  },
  progressTrack: {
    height: 4,
    backgroundColor: COLORS.primaryLighter,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.error,
  },
  cancelText: {
    color: COLORS.error,
    fontWeight: '600',
    fontSize: 14,
  },
  confirmButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },
  confirmText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default ModalConfirmarAudio;
