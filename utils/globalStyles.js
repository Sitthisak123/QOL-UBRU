import { StyleSheet } from "react-native";
export const globalCustomStyles = (theme) => ({
  view: {
    flex: 1,
    backgroundColor: theme.colors.background, // Use theme color
  },
  subView: {
    flex: 1,
    backgroundColor: "transparent", // Use surface color
  },
  scrollView: {
    flex: 1,
    padding: 0,
  },
  fieldDataColor: {
    color: theme.colors.text, // Use theme's text color
  },
  TextHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.primary, // Use primary color for text
  },
    DigiHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary, // Use primary color for text
  },
  icon: {
    color: theme.colors.text,
    backgroundColor: 'transparent'
  },
  dataFieldCenter: {
    alignItems: "center", 
    justifyContent: "center"
  }
});


export const dropdownStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 5,
    borderRadius: 5, 
    flexDirection: "row", 
    flexWrap: "nowrap", 
    justifyContent: "space-between",
  },
  buttonText: {
    color: theme.colors.text,
    fontSize: 16,
  },
  dropdown: {
    width: "auto",
    overflow: 'hidden', // Hide content that overflows the dropdown box
    marginTop: 5,
    // position: "relative",
  },
  list: {
    // backgroundColor: '',
    borderRadius: 5,
    borderWidth: 1, //Dev

  },
  listItem: {
    // borderBottomWidth: 1,
    // borderBottomColor: '#ddd',
  },
  listItemText: {
    fontSize: 16,
    textAlign: "left",
  },
});


