import { storage } from "@vendetta/plugin";
import { findByProps } from "@vendetta/metro";
import SettingsPage from "./Settings"; // Import Settings

const { setCustomStatus } = findByProps("setCustomStatus");

// Default Values (Prevents crashes)
storage.rpcTitle = storage.rpcTitle || "";
storage.rpcDetails = storage.rpcDetails || "";
storage.rpcState = storage.rpcState || "";
storage.rpcLargeImage = storage.rpcLargeImage || "";
storage.rpcSmallImage = storage.rpcSmallImage || "";
storage.rpcStartTimestamp = storage.rpcStartTimestamp || false;
storage.rpcEndTimestamp = storage.rpcEndTimestamp || false;
storage.rpcButtons = storage.rpcButtons || [];

// Function to update Rich Presence
export const updateRPC = (): void => {
  setCustomStatus(
    storage.rpcTitle
      ? {
          text: storage.rpcTitle,
          emoji: null,
          details: storage.rpcDetails || undefined,
          state: storage.rpcState || undefined,
          timestamps: storage.rpcStartTimestamp
            ? { start: Date.now(), end: storage.rpcEndTimestamp ? Date.now() + 600000 : undefined }
            : undefined,
          assets: {
            large_image: storage.rpcLargeImage || undefined,
            small_image: storage.rpcSmallImage || undefined,
          },
          buttons: storage.rpcButtons,
        }
      : null
  );
};

// Restore RPC on reload
updateRPC();

// Register settings page with a unique ID
registerSettings("customrpc-settings", SettingsPage);

// Plugin Lifecycle Hooks
export const onLoad = (): void => {};
export const onUnload = (): void => setCustomStatus(null);
export { default as settings } from "./Settings";
function registerSettings(arg0: string, SettingsPage: () => JSX.Element) {
  throw new Error("Function not implemented.");
}

