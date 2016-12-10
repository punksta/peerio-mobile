import React, { Component } from 'react';
import {
    Text,
    View
} from 'react-native';
// import { observable, reaction } from 'mobx';
import { observer } from 'mobx-react/native';

const firstRowStyle = {
    flex: 1,
    flexDirection: 'row'
};

const bottomRowStyle = {
    flex: 0,
    flexDirection: 'row',
    backgroundColor: '#CFCFCF'
};

const firstColumnStyle = {
    flex: 1
};

@observer
export default class FileView extends Component {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View style={firstRowStyle}>
                    <View>
                        <Text>file icon</Text>
                    </View>
                    <View style={firstColumnStyle}>
                        <View>
                            <Text>file owner</Text>
                        </View>
                        <View style={firstRowStyle}>
                            <View style={{ flex: 1 }}>
                                <Text>file size</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text>modified</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={bottomRowStyle}>
                    <Text>bottom row</Text>
                </View>
            </View>
        );
    }
}
