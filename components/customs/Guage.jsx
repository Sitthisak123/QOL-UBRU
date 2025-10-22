import React, { useEffect, useRef } from 'react';
import { Path, Svg } from 'react-native-svg';
import { Animated, View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";
const AnimatedPath = Animated.createAnimatedComponent(Path);

const Gauge = ({
  centerText = "",
  centerTextsize = 0,
  centerTextcolor = "",
  headerText = "",
  headerTextsize = 0,
  minValue = 0,
  maxvalue = 100,
  value = 0,
  color = "#13bc13",
  pathColor = "#3a393e",
  size = 100,
  pathWidth = 7

}) => {
  const animationValue = useRef(new Animated.Value(0)).current;
  const pathRef = useRef(null);
  const radius = size / 2;
  const theme = useTheme();
  useEffect(() => {
    const animatePath = () => {
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 2000, // Duration of the animation
        useNativeDriver: true, // Use native driver for better performance
      }).start();
    };
    animatePath();
    return () => {
      animationValue.setValue(0); // Reset the animation value when the component unmounts
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: "transparent", width: size, height: size, borderRadius: "50%" }}>
      <Svg width={50 + size} height={50 + size} viewBox="0 0 100 100" >
        {/* Background path (grey arc) */}
        <Path
          d="M22.37 60.987a30.3 30.3 0 0 1-2.357-11.76C20.013 32.54 33.44 19.012 50 19.012S79.987 32.54 79.987 49.226c0 4.172-.84 8.146-2.357 11.76"
          fill="none"
          strokeWidth={pathWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke={pathColor}
          ref={pathRef}

        />
        {/* Foreground path (colored arc) */}
        <AnimatedPath
          d="M22.37 60.987a30.3 30.3 0 0 1-2.357-11.76C20.013 32.54 33.44 19.012 50 19.012S79.987 32.54 79.987 49.226c0 4.172-.84 8.146-2.357 11.76"
          strokeDasharray={animationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [
              '0 119', // Starting value (no stroke visible)
              `${(119.0 * value) / maxvalue} 119`, // Ending value based on the `value` prop
            ],
          })}
          fill="none"
          strokeWidth={pathWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke={color}
        />
      </Svg>

      {/* Value Text Header */}
      <View
        style={{
          position: 'absolute',
          top: -15,
          left: 0,
          transform: [
            { translateX: '-50%' },  // Move to the center horizontally
            { translateY: '-50%' },  // Move to the center vertically
            { translateX: size / 2 },  // Adjust by half of the size to truly center it
            { translateY: (size / 2) + 10 },  // Adjust by half of the size to truly center it
          ],
        }}
      >
        <Text style={{
          fontSize: headerTextsize ? headerTextsize : size * 0.17,
          fontWeight: 'bold',
          color: centerTextcolor ? centerTextcolor : theme.colors.onSecondaryContainer,
          alignItems: "center",
          justifyContent: "center",
        }}>
          {headerText ? headerText : "Unset"}
        </Text>
      </View>


      {/* Value Text at the center */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          transform: [
            { translateX: '-50%' },  // Move to the center horizontally
            { translateY: '-50%' },  // Move to the center vertically
            { translateX: size / 2 },  // Adjust by half of the size to truly center it
            { translateY: (size / 2) + 12 },  // Adjust by half of the size to truly center it
          ],
        }}
      >
        <Text style={{
          fontSize: centerTextsize ? centerTextsize : size * 0.11,
          fontWeight: 'bold',
          color: centerTextcolor ? centerTextcolor : theme.colors.onSecondaryContainer,
          alignItems: "center",
          justifyContent: "center",
        }}>
          {centerText ? centerText : "Unset"}
        </Text>
      </View>
    </View>
  );
};

export default Gauge;
