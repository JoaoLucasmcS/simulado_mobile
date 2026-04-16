import React, { useState, useEffect} from 'react';
import { StatusBar }  from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  StatusBar as sb_react,
  FlatList
} from 'react-native';
import {News} from './src/components/News';

import { fetchNewsService, NewsData } from './src/utils/handle-api';
import {globalStyles} from "./src/styles/global";

export default function App() {
  const [newsList, setNewsList] = useState<NewsData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await fetchNewsService();
      setNewsList(data);
    } catch (err: any) {
      setError(err.message || "Erro ao obter notícias");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
          style="dark"
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Últimas notícias</Text>
      </View>
      {!loading && !error && (
          <Text style={styles.counterText}>
            Notícias Carregadas : {newsList.length}
          </Text>
      )
      }

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Carregando notícias...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Erro: {error}</Text>
        </View>
      ) : (
          <FlatList
              data={newsList}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.scrollContent}
              renderItem={({ item }) => (
                <News
                    title={item.title}
                    summary={item.summary}
                    image={item.image}
                    published={item.published}
                    link={item.link}
                />
            )}
              ItemSeparatorComponent={() => <View style={styles.itemSeparatorContent}></View>}
              ListEmptyComponent={() =>
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Nenhuma notícia disponível no momento.</Text>
                  </View>}
          />
          )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.backgroundColor,
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
    ...Platform.select({
      android: {
        paddingTop: sb_react.currentHeight,
      },
      ios: {
        paddingTop: 30,
      },
      default: {
        paddingTop: 40,
      },
    })
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: globalStyles.bodyFontSize,
    color: '#666',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  scrollContent: {
    padding: 16,
  },
  counterText: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
    fontSize: 12,
    color: '#000000',
    fontWeight: '500',
  },
  itemSeparatorContent: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
