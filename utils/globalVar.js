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
});

