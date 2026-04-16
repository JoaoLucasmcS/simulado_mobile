import React, {useState} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Linking } from 'react-native';

interface NewsProps {
  title: string;
  image?: string | null;
  published: string;
  link: string;
  summary?: string;
}

export function News({title, image, published, link, summary}: NewsProps) {
  const [imageError, setImageError] = useState<boolean>(false);
  const handlePress = async () => {
    try {
      const supported = await Linking.canOpenURL(link);
      if (supported) {
        await Linking.openURL(link);
      } else {
        console.warn(`Não foi possível abrir a URL: ${link}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
      <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.7}>
        {image ? (
            imageError ? (
                <View style={styles.imageFallback}>
                  <Text style={styles.textFallback}>Sem imagem</Text>
                </View>
            ) : (
                <Image
                    style={styles.image}
                    source={{ uri: image }}
                    resizeMode="cover"
                    onError={() => setImageError(true)}
                />
            )
        ) : null}
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          {summary ? (
              <Text numberOfLines={2} style={styles.summary}>{summary}</Text>
          ) : null}
          <Text style={styles.date}>{published}</Text>
        </View>
      </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  summary: {
    fontSize: 15,
    marginBottom: 8,
    color: '#484D50',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  imageFallback: {
    width: '100%',
    height: 180,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textFallback: {
    color: '100%',
    fontWeight: 'bold',
  }
});
