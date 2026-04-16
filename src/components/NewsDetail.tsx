import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking, SafeAreaView } from 'react-native';
import { NewsData } from '../utils/handle-api';

interface NewsDetailProps {
    news: NewsData | null;
    onClose: () => void;
}

export default function NewsDetail({ news, onClose }: NewsDetailProps) {
    const [imageError, setImageError] = useState<boolean>(false);

    if (!news) return null;

    const handleOpenLink = async () => {
        try {
            const supported = await Linking.canOpenURL(news.link);
            if (supported) {
                await Linking.openURL(news.link);
            } else {
                console.warn(`Não foi possível abrir a URL: ${news.link}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Fechar</Text>
                    </TouchableOpacity>
                </View>

                {news.image ? (
                    imageError ? (
                        <View style={styles.fallbackImage}>
                            <Text style={styles.fallbackText}>Sem imagem</Text>
                        </View>
                    ) : (
                        <Image
                            style={styles.image}
                            source={{ uri: news.image }}
                            resizeMode="cover"
                            onError={() => setImageError(true)}
                        />
                    )
                ) : (
                    <View style={styles.fallbackImage}>
                        <Text style={styles.fallbackText}>Sem imagem</Text>
                    </View>
                )}

                <View style={styles.content}>
                    <Text style={styles.title}>{news.title}</Text>
                    <Text style={styles.date}>{news.published}</Text>
                    <Text style={styles.summary}>{news.summary}</Text>

                    <TouchableOpacity style={styles.linkButton} onPress={handleOpenLink}>
                        <Text style={styles.linkButtonText}>Ler notícia completa</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        paddingBottom: 24,
    },
    header: {
        padding: 16,
        alignItems: 'flex-start',
    },
    closeButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    closeButtonText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
    },
    image: {
        width: '100%',
        height: 220,
    },
    fallbackImage: {
        width: '100%',
        height: 220,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fallbackText: {
        color: '#333',
        fontWeight: 'bold',
    },
    content: {
        padding: 16,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 22,
        marginBottom: 8,
        color: '#333',
    },
    date: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    summary: {
        fontSize: 16,
        color: '#444',
        lineHeight: 24,
        marginBottom: 24,
    },
    linkButton: {
        backgroundColor: '#007bff',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    linkButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});