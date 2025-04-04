import { storage } from "@vendetta/plugin";
import { React } from "@vendetta/metro/common";
import { showToast } from "@vendetta/ui/toasts";
import { useProxy } from "@vendetta/storage";
import { Forms, General } from "@vendetta/ui/components";
import { updateRPC } from "./index"; // Import update function

const { View, ScrollView } = General;
const { FormInput, FormRow, FormSwitch, FormSection, FormDivider } = Forms;

export default function SettingsPage(): JSX.Element {
  useProxy(storage);

  return (
    <ScrollView>
      <FormSection title="CustomRPC - Rich Presence">
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
          label="Show Start Timestamp"
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

        <FormSection title="Custom Buttons">
          {storage.rpcButtons.map((button, index) => (
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
        </FormSection>

        <FormRow
          label="Clear CustomRPC"
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
}
