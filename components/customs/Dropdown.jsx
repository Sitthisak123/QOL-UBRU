import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';
import { dropdownStyles } from '../../utils/globalStyles'
// import { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';

const Dropdown = ({
    headername = "unset",
    componentList = [],
    propstyle = {},
    credit = 0,
    maxCredit = 0,
    fail = 0,
    incomplete = 0,
    remain = 0
}) => {
    const [isOpen, setIsOpen] = useState(false);
    // const translateY = useSharedValue(0);
    const theme = useTheme();
    const styles = dropdownStyles(theme);


    // Toggle dropdown open/close
    const toggleDropdown = () => {
        setIsOpen(!isOpen);

        // Animate translateY value (slide down or up)
        // translateY.value = withTiming(isOpen ? 150 : 0, { duration: 300 }); // Slide down to 0 when opened
    };

    return (
        <View style={[styles.container, propstyle]}>
            {/* Button to toggle dropdown */}
            <View>
                <TouchableOpacity onPress={toggleDropdown} style={[styles.button, { backgroundColor: credit===maxCredit? "#10c81f":theme.colors.secondary }]} activeOpacity={.85}>
                    <Text style={styles.buttonText}>{headername}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", alignItems: "center", paddingRight: 10, gap: 5 }}>
                        <Text>{`${credit}/${maxCredit}`}</Text>
                        {(credit != maxCredit && credit < maxCredit) && <Icon
                            source="help-circle-outline"
                            color={fail ? theme.colors.onError : theme.colors.backdrop}
                            size={20}
                            onPress={() => console.log('Pressed')}
                        />}
                    </View>
                </TouchableOpacity>

                {/* Animated Dropdown List */}
                <Animated.View
                    style={[
                        styles.dropdown,
                    ]}
                >
                    {componentList.length && isOpen ? (
                        <View style={styles.list}>
                            {componentList.map(item => item)}
                        </View>
                    ) : null}

                </Animated.View>
            </View>
        </View>
    );
};


export default Dropdown;
