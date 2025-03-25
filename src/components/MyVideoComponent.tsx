import { useVideoPlayer, VideoView } from "expo-video";
import { StyleProp, ViewStyle } from "react-native";

export default function MyVideoComponent({
  source,
  style,
}: {
  source: string;
  style?: StyleProp<ViewStyle>;
}) {
  if (!source) return;

  const player = useVideoPlayer(source, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <VideoView
      style={style}
      player={player}
      allowsFullscreen
      allowsPictureInPicture
    />
  );
}
