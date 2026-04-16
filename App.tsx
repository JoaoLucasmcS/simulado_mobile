import React, {useState, useEffect, useMemo} from 'react';
import { StatusBar }  from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  StatusBar as sb_react,
  FlatList, TextInput, TouchableOpacity
} from 'react-native';
import {News} from './src/components/News';

import { fetchNewsService, NewsData } from './src/utils/handle-api';
import {globalStyles} from "./src/styles/global";

export default function App() {
  const [newsList, setNewsList] = useState<NewsData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');


  useEffect(() => {
    fetchNews();
  }, []);

  const filteredAndSortedNews = useMemo(() => {
    let result = newsList;

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter((news) =>
          news.title.toLowerCase().includes(lowerQuery)
      );
    }

    result = [...result].sort((a, b) => {
      const dateA = new Date(a.published).getTime();
      const dateB = new Date(b.published).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [newsList, searchQuery, sortOrder]);

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
        <TextInput
            placeholder={"Buscar notícias..."}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
        />
        <TouchableOpacity
            style={[
              styles.sortButton,
              sortOrder === 'asc' && styles.sortButtonActive
            ]}
            onPress={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
        >
          <Text
              style={[
                styles.sortButtonText,
                sortOrder === 'asc' && styles.sortButtonTextActive
              ]}
          >
            {sortOrder === 'asc' ? '↑ Mais antigas' : '↓ Mais recentes'}
          </Text>
        </TouchableOpacity>
      </View>
      {!loading && !error && (
          <Text style={styles.counterText}>
            {filteredAndSortedNews.length} notícias encontradas
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
              data={filteredAndSortedNews}
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
  searchInput: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 12,
    backgroundColor: '#fff',
  },
  sortButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    width: '100%',
  },
  sortButtonActive: {
    backgroundColor: '#007bff',
  },
  sortButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  sortButtonTextActive: {
    color: '#fff',
  },
});
