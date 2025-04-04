import { useVideoPlayer, VideoView } from "expo-video";
import { ScrollView, StyleProp, ViewStyle } from "react-native";
import { VisibilitySensor } from "@futurejj/react-native-visibility-sensor";

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
  });

  function checkVisible(isVisible: boolean) {
    if (isVisible) {
      player.play();
    } else {
      player.pause();
    }
  }

  return (
    <ScrollView>
      <VisibilitySensor
        onChange={(isVisible) => checkVisible(isVisible)}
        threshold={{
          left: 100,
          right: 100,
        }}
      >
        <VideoView
          style={style}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
        />
      </VisibilitySensor>
    </ScrollView>
  );
}
