import { navAssets } from "../../nav/navAssets";
import fab from "./navFab.module.css";

type NavSettingsFabProps = {
  onClick: () => void;
};

export function NavSettingsFab({ onClick }: NavSettingsFabProps) {
  return (
    <button
      type="button"
      className={`${fab.fab} ${fab.fabSettings}`}
      onClick={onClick}
      aria-label="설정"
    >
      <span className={fab.fabSettingsIcon} aria-hidden="true">
        <span className={fab.fabSettingsPad}>
          <img src={navAssets.settings} alt="" />
        </span>
      </span>
    </button>
  );
}
