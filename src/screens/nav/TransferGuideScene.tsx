import { CameraBackground } from "../../components/CameraBackground";
import { navAssets } from "../../nav/navAssets";
import styles from "./transferGuide.module.css";

type TransferGuideSceneProps = {
  cameraStream: MediaStream | null;
  cameraStarting: boolean;
  fallbackImage: "transferGuide1" | "transferGuide2";
};

export function TransferGuideScene({
  cameraStream,
  cameraStarting,
  fallbackImage,
}: TransferGuideSceneProps) {
  const fallbackSrc = navAssets[fallbackImage];

  return (
    <>
      <div className={styles.scenePlaceholder} aria-hidden="true" />
      {cameraStream ? (
        <CameraBackground stream={cameraStream} className={styles.scene} />
      ) : cameraStarting ? (
        <div className={styles.sceneLoading}>카메라 준비 중...</div>
      ) : (
        <img className={styles.scene} src={fallbackSrc} alt="" />
      )}
    </>
  );
}
