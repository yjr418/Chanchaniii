import photoShared from "./onboardingPhotoShared.module.css";

export const PHOTO_CREATE_TITLE = [
  "사진으로 찬찬이를",
  "만들 수 있어요",
] as const;

export const PHOTO_CHANGE_TITLE = "찬찬이 바꾸기";

export type PhotoScreenTitle = typeof PHOTO_CREATE_TITLE | string;

type PhotoScreenHeadingProps = {
  title?: PhotoScreenTitle;
};

export function PhotoScreenHeading({
  title = PHOTO_CREATE_TITLE,
}: PhotoScreenHeadingProps) {
  if (typeof title === "string") {
    return (
      <h1 className={photoShared.title}>
        <span>{title}</span>
      </h1>
    );
  }

  return (
    <h1 className={photoShared.title}>
      {title.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </h1>
  );
}
