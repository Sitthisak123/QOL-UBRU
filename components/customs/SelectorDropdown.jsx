import React, { useState } from "react";
import { View, Text } from "react-native";
import { Menu, Button, useTheme } from "react-native-paper";

export default function SelectorDropdown({
  options = [],
  value,
  onSelect,
  label = "Select...",
  style = {},
}) {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const selectedLabel =
    value === undefined || value === null || value === "-" ? "-" : value;

  return (
    <View
      style={[
        { margin: 10, backgroundColor: theme.colors.background, alignItems: "center" }, // center horizontally
        style,
      ]}
    >
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchorPosition="bottom"
        anchor={
          <Button
            mode="outlined"
            textColor={theme.colors.onSurface}
            onPress={openMenu}
            style={{
              borderColor: theme.colors.outline,
              justifyContent: "space-between",
            }}
          >
            <Text style={{ color: theme.colors.onSurface }}>{selectedLabel}</Text>
          </Button>
        }
        style={{ width: 150 }} // optional: set menu width
      >
        <Menu.Item
          onPress={() => {
            onSelect("-");
            closeMenu();
          }}
          title="-"
        />
        {options.map((opt, idx) => (
          <Menu.Item
            key={idx}
            onPress={() => {
              onSelect(opt);
              closeMenu();
            }}
            title={opt}
          />
        ))}
      </Menu>
    </View>
  );
}
