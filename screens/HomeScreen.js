import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../utils/supabase";

const PAGE_SIZE = 14;

export default function HomeScreen({ navigation }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      console.log(`Fetching movies from ${from} to ${to}`);

      const { data, error } = await supabase
        .from("movies")
        .select("*")
        .order("release_date", { ascending: false })
        .range(from, to);

      if (error) {
        console.error("Error fetching movies:", error);
        return;
      }

      if (data.length < PAGE_SIZE) {
        setHasMore(false); // No more movies left
      }

      setMovies((prevMovies) => [...prevMovies, ...data]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  };

  const loadMoreMovies = () => {
    if (!fetchingMore && hasMore) {
      setFetchingMore(true);
      fetchMovies();
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("Details", { movie: item })}
    >
      <View style={styles.posterContainer}>
        <Image source={{ uri: item.poster }} style={styles.poster} />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.formats}>{item.formats}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color="#FFD700" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require("../assets/MovieHunt-header-icon.png")}
            style={styles.logo}
          />
          <Text style={styles.heading}>MovieHunt</Text>
        </View>

        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.scrollContent}
          renderItem={renderItem}
          ListFooterComponent={() =>
            hasMore ? (
              <TouchableOpacity
                style={styles.loadMoreButton}
                onPress={loadMoreMovies}
              >
                {fetchingMore ? (
                  <ActivityIndicator size="small" color="#FFD700" />
                ) : (
                  <Text style={styles.loadMoreText}>Load More</Text>
                )}
              </TouchableOpacity>
            ) : (
              <Text style={styles.noMoreText}>No more movies!</Text>
            )
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#1F1F1F" },
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F1F1F",
    paddingVertical: 18,
    paddingHorizontal: 15,
  },
  logo: { width: 32, height: 32, marginRight: 12 },
  heading: { fontSize: 24, color: "#FFD700", fontWeight: "bold" },
  scrollContent: { padding: 15, paddingBottom: 30 },
  card: {
    backgroundColor: "#1F1F1F",
    borderRadius: 12,
    padding: 10,
    width: "48%",
    marginBottom: 20,
    marginHorizontal: "1%",
  },
  posterContainer: { width: "100%", overflow: "hidden", borderRadius: 10 },
  poster: {
    width: "100%",
    height: undefined,
    aspectRatio: 2 / 3,
    resizeMode: "cover",
  },
  title: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
    marginTop: 10,
    textAlign: "center",
  },
  formats: {
    fontSize: 14,
    color: "#FF6F61",
    marginTop: 5,
    textAlign: "center",
  },
  loadMoreButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 20,
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
    width: "50%",
  },
  loadMoreText: {
    color: "#121212",
    fontWeight: "bold",
    fontSize: 16,
  },
  noMoreText: {
    color: "#888",
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
  },
  centerContent: { flex: 1, justifyContent: "center", alignItems: "center" },
});
