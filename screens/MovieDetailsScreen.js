import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";

export default function MovieDetailsScreen({ route }) {
  const { movie } = route.params;

  const handleDownload = (url) => {
    if (url) {
      Linking.openURL(url);
    } else {
      alert("Download link not available.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).replace(',', '');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView style={styles.container}>
        <Image source={{ uri: movie.poster }} style={styles.poster} />
        <View style={styles.content}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.meta}>Language: {movie.language}</Text>
          <Text style={styles.meta}>Release Date: {formatDate(movie.release_date)}</Text>
          <Text style={styles.synopsis}>{movie.synopsis}</Text>

          {/* 720p Downloads */}
          <Text style={styles.heading}>🎬 720p Downloads</Text>
          {movie.download_link1_720p || movie.download_link2_720p ? (
            <>
              {movie.download_link1_720p && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleDownload(movie.download_link1_720p)}
                >
                  <Text style={styles.buttonText}>Download Link 1 (720p)</Text>
                </TouchableOpacity>
              )}
              {movie.download_link2_720p && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleDownload(movie.download_link2_720p)}
                >
                  <Text style={styles.buttonText}>Download Link 2 (720p)</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <Text style={styles.noLinks}>No 720p links available.</Text>
          )}

          {/* 1080p Downloads */}
          <Text style={styles.heading}>🎬 1080p Downloads</Text>
          {movie.download_link1_1080p || movie.download_link2_1080p ? (
            <>
              {movie.download_link1_1080p && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleDownload(movie.download_link1_1080p)}
                >
                  <Text style={styles.buttonText}>Download Link 1 (1080p)</Text>
                </TouchableOpacity>
              )}
              {movie.download_link2_1080p && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleDownload(movie.download_link2_1080p)}
                >
                  <Text style={styles.buttonText}>Download Link 2 (1080p)</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <Text style={styles.noLinks}>No 1080p links available.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#1F1F1F" },
  container: { flex: 1, backgroundColor: "#121212" },
  poster: { width: "100%", aspectRatio: 2 / 3, resizeMode: "cover" },
  content: { padding: 20 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 15,
  },
  meta: { fontSize: 16, color: "#FF6F61", marginBottom: 8 },
  synopsis: { fontSize: 16, color: "#FFFFFF", marginTop: 10, lineHeight: 24 },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFD700",
    marginTop: 30,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#FFD700",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 12,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#121212",
    fontSize: 16,
    fontWeight: "bold",
  },
  noLinks: {
    color: "#FF6F61",
    fontSize: 16,
    marginTop: 5,
  },
});
