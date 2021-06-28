import React, { Component, PureComponent } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import Constant from "../util/constant";

export default class Loading extends PureComponent {
    constructor(props) {
        super(props)
    
    }
   
    render() {
        return (
        
            <View style={{ height: "100%", backgroundColor: 'rgba(52, 52, 52, 0.3)', position: 'absolute', top: 0, width: '100%', alignItems: 'center' }}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator color={Constant.COLOR.secondary} size={28} />
                </View>
            </View>
        )
    }
}