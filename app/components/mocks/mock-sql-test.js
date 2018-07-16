import React, { Component } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import randomWords from 'random-words';
import SqlCipherDbStorage from '../../store/sqlcipher-db-storage';
import Text from '../controls/custom-text';
import mockLog from './mock-log';

@observer
export default class MockSqlTest extends Component {
    db = null;

    componentDidMount() {
        this.db = new SqlCipherDbStorage('test');
        this.startTest();
    }

    async startTest() {
        mockLog.start('...');
        const { db } = this;
        mockLog.start('open db');
        await db.open();
        const k = randomWords();
        const v = randomWords();
        mockLog.log(`set k ${k} value to ${v}`);
        await db.setValue(k, v, () => true);
        const r = await db.getValue(k);
        mockLog.log(`result ${r}, ${v === r}`);
        mockLog.stopAndLog();
    }

    render() {
        return (
            <View style={{ flexGrow: 1 }}>
                <View style={{ justifyContent: 'flex-start', flexGrow: 1, padding: 20 }}>
                    <Text>Sql Db Storage test results:</Text>
                    <Text>{mockLog.list}</Text>
                </View>
            </View>
        );
    }
}
