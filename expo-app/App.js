import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';

const VITE_PORT = 3000;

function getPreviewHostFromExpo() {
  const dbg = Constants.expoGoConfig?.debuggerHost;
  if (!dbg) return null;
  return String(dbg).split(':')[0] || null;
}

function isTunnelHost(host) {
  if (!host) return true;
  return host.includes('exp.direct') || host.includes('ngrok') || host.includes('trycloudflare');
}

function getPreviewUrl() {
  const fromEnv = process.env.EXPO_PUBLIC_PREVIEW_URL;
  if (fromEnv) {
    return fromEnv.endsWith('/') ? fromEnv : `${fromEnv}/`;
  }
  const host = getPreviewHostFromExpo();
  if (!host || isTunnelHost(host)) {
    return null;
  }
  return `http://${host}:${VITE_PORT}/`;
}

export default function App() {
  const uri = getPreviewUrl();

  if (!uri) {
    return (
      <View style={styles.root}>
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={styles.errorBox}>
          <Text style={styles.errorTitle}>Local preview setup</Text>
          <Text style={styles.errorBody}>
            Metro is running in tunnel mode, or the dev host could not be read. For a simple local preview:
            {'\n\n'}
            1. Stop Expo (Ctrl+C).{'\n'}
            2. From `expo-app/`, run: `npm run start:lan` (LAN — not tunnel).{'\n'}
            3. From the repo root, run Vite: `npm run dev` (port {VITE_PORT}).{'\n'}
            4. Phone and computer must be on the same Wi‑Fi.{'\n'}
            5. Android: rebuild or reinstall the app after enabling cleartext in app.json if the WebView stays blank.{'\n'}
            6. Optional: `EXPO_PUBLIC_PREVIEW_URL=http://YOUR_LAN_IP:{VITE_PORT}/` (run `npm run which-ip` in expo-app).{'\n\n'}
            Tunnel mode cannot guess your Vite URL; use LAN or set the env URL explicitly.
          </Text>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <WebView
        source={{ uri }}
        style={styles.webview}
        cacheEnabled={false}
        cacheMode="LOAD_NO_CACHE"
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        originWhitelist={['*']}
        mixedContentMode="always"
        setSupportMultipleWindows={false}
        onError={(e) => {
          console.warn('WebView load error', e?.nativeEvent);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1a1208',
  },
  webview: {
    flex: 1,
  },
  errorBox: {
    padding: 24,
    paddingTop: 56,
  },
  errorTitle: {
    color: '#f5efe0',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  errorBody: {
    color: '#c9a227',
    fontSize: 14,
    lineHeight: 22,
  },
});
