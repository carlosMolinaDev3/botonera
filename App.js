import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, Linking, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Audio } from 'expo-av'; 
import { Asset } from 'expo-asset';
import * as Sharing from 'expo-sharing';

const audios = [
  { id: 1, title: 'Andá a la cancha bobo', file: require('./assets/audios/andalacancha.mp3')},
  { id: 2, title: 'Y bien amigos', file: require('./assets/audios/ybienamigos.mp3') },
  { id: 3, title: 'Cositas lindas', file: require('./assets/audios/cositaslindas.m4a') },
  { id: 4, title: 'Quinteros Madrid', file: require('./assets/audios/golquinteros.mp3') },
  { id: 5, title: 'Que la chupen', file: require('./assets/audios/maradonachupen.mp3') },
  { id: 6, title: 'Tatan tatan', file: require('./assets/audios/tatantatan.mp3') },
  { id: 7, title: 'Pisala Pomelo', file: require('./assets/audios/pisalapomelo.mp3') },
  { id: 8, title: 'Anda payá', file: require('./assets/audios/quemirasbobo.mp3') },
  { id: 9, title: 'Ramón tití', file: require('./assets/audios/ramontiti.mp3') },
  { id: 10, title: 'Somos Montiel', file: require('./assets/audios/somostodosmontiel.mp3') },
];

export default function App() {
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playSound = async (audioFile) => {
    if (currentAudio === audioFile && isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      try {
        if (sound) {
          await sound.unloadAsync();
        }
        const { sound: newSound } = await Audio.Sound.createAsync(audioFile);
        setSound(newSound);
        setCurrentAudio(audioFile);
        await newSound.playAsync();
        setIsPlaying(true);
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (!status.isPlaying) {
            setIsPlaying(false);
          }
        });
      } catch (error) {
        console.log('Error al reproducir el sonido:', error);
      }
    }
  };

  const shareSound = async (audio) => {
    try {
      const audioFile = Asset.fromModule(audio.file);
      await audioFile.downloadAsync();

      const shareOptions = {
        mimeType: 'audio/mp3',
        UTI: 'com.apple.m4a-audio',
        dialogTitle: 'Compartir archivo de audio',
        UTI: 'public.audio',
        url: audioFile.localUri || audioFile.uri,
      };

      await Sharing.shareAsync(audioFile.localUri || audioFile.uri, shareOptions);
    } catch (error) {
      console.error('Error al compartir el audio:', error);
      Alert.alert('Error', 'No se pudo compartir el audio. Por favor, inténtalo de nuevo.');
    }
  };

  const filteredAudios = audios.filter(audio => audio.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.banner}>
        <Image source={require('./assets/222.jpg')} style={styles.bannerImage} />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar audio..."
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
        />
        <TouchableOpacity style={styles.searchButton}>
          <AntDesign name="search1" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.gridContainer}>
        {filteredAudios.map(audio => (
          <View key={audio.id} style={styles.audioContainer}>
            <Text style={styles.audioTitle}>{audio.title}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.playButton} onPress={() => playSound(audio.file)}>
                <AntDesign name={currentAudio === audio.file && isPlaying ? 'pause' : 'play'} size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton} onPress={() => shareSound(audio)}>
                <AntDesign name="sharealt" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingTop: 70,
  },
  banner: {
    height: 140,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  audioContainer: {
    width: '48%',
    marginBottom: 30,
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  audioTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  playButton: {
    backgroundColor: '#1e88e5',
    width: 56,
    height: 56,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: '#4caf50',
    width: 56,
    height: 56,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

