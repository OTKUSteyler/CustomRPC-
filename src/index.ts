import { storage } from "@vendetta/plugin";
import { React } from "@vendetta/ui/components";
import { findByProps } from "@vendetta/metro";
import { showToast } from "@vendetta/ui/toasts";
import { useProxy } from "@vendetta/storage";
import { registerSettings } from "@vendetta/settings";
import { Forms, General } from "@vendetta/ui/components";

const { View, ScrollView } = General;
const { FormInput, FormRow, FormSwitch, FormSection, FormDivider } = Forms;
const { setCustomStatus } = findByProps("setCustomStatus");

interface CustomButton {
  label: string;
  url: string;
}

// Default storage values
storage.rpcTitle = storage.rpcTitle || "";
storage.rpcDetails = storage.rpcDetails || "";
storage.rpcState = storage.rpcState || "";
storage.rpcLargeImage = storage.rpcLargeImage || "";
storage.rpcSmallImage = storage.rpcSmallImage || "";
storage.rpcStartTimestamp = storage.rpcStartTimestamp || false;
storage.rpcEndTimestamp = storage.rpcEndTimestamp || false;
storage.rpcButtons = storage.rpcButtons || [] as CustomButton[];

// Function to update the RPC status
const updateRPC = (): void => {
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

// Plugin Settings UI
const SettingsPage = (): JSX.Element => {
  useProxy(storage);

  return (
    <ScrollView>
      <FormSection title="Custom RPC">
        <FormInput
          title="Game Name"
          value={storage.rpcTitle}
          onChange={(text) => {
            storage.rpcTitle = text;
            updateRPC();
          }}
          placeholder="e.g., Playing GTA VI"
        />

        <FormInput
          title="Details"
          value={storage.rpcDetails}
          onChange={(text) => {
            storage.rpcDetails = text;
            updateRPC();
          }}
          placeholder="e.g., Exploring Vice City"
        />

        <FormInput
          title="State"
          value={storage.rpcState}
          onChange={(text) => {
            storage.rpcState = text;
            updateRPC();
          }}
          placeholder="e.g., In a Mission"
        />

        <FormInput
          title="Large Image Key"
          value={storage.rpcLargeImage}
          onChange={(text) => {
            storage.rpcLargeImage = text;
            updateRPC();
          }}
          placeholder="e.g., gta_vi_cover"
        />

        <FormInput
          title="Small Image Key"
          value={storage.rpcSmallImage}
          onChange={(text) => {
            storage.rpcSmallImage = text;
            updateRPC();
          }}
          placeholder="e.g., character_icon"
        />

        <FormRow
          label="Show Timestamps"
          trailing={
            <FormSwitch
              value={storage.rpcStartTimestamp}
              onValueChange={(value) => {
                storage.rpcStartTimestamp = value;
                updateRPC();
              }}
            />
          }
        />

        <FormRow
          label="Show End Timestamp (10 min later)"
          trailing={
            <FormSwitch
              value={storage.rpcEndTimestamp}
              onValueChange={(value) => {
                storage.rpcEndTimestamp = value;
                updateRPC();
              }}
            />
          }
        />

        {storage.rpcButtons.map((button: CustomButton, index: number) => (
          <View key={index}>
            <FormRow
              label={`Button ${index + 1}`}
              subLabel={button.label}
              trailing={
                <FormSwitch
                  value={true}
                  onValueChange={() => {
                    storage.rpcButtons.splice(index, 1);
                    updateRPC();
                  }}
                />
              }
            />
            <FormDivider />
          </View>
        ))}

        <FormInput
          title="Add Button Label"
          placeholder="e.g., Join Beta"
          onSubmitEditing={({ nativeEvent }) => {
            if (nativeEvent.text) {
              storage.rpcButtons.push({ label: nativeEvent.text, url: "#" });
              updateRPC();
            }
          }}
        />

        <FormRow
          label="Clear Custom RPC"
          onPress={() => {
            storage.rpcTitle = "";
            storage.rpcDetails = "";
            storage.rpcState = "";
            storage.rpcLargeImage = "";
            storage.rpcSmallImage = "";
            storage.rpcStartTimestamp = false;
            storage.rpcEndTimestamp = false;
            storage.rpcButtons = [];
            updateRPC();
            showToast("Custom RPC cleared.");
          }}
        />
      </FormSection>
    </ScrollView>
  );
};

// Register the settings page when the "Options" button is clicked
registerSettings("custom-rpc-settings", SettingsPage);

// Plugin lifecycle hooks
export const onLoad = (): void => {};
export const onUnload = (): void => setCustomStatus(null);
