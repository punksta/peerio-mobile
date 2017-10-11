import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text, TextInput } from 'react-native';
import { observable } from 'mobx';
import SafeComponent from '../shared/safe-component';
import { t, tx } from '../utils/translator';
import Layout1 from '../layout/layout1';
import Center from '../controls/center';
import FileInnerItem from './file-inner-item';
import fileState from './file-state';
import icons from '../helpers/icons';
import { fileStore } from '../../lib/icebear';
import { vars } from '../../styles/styles';

@observer
export default class SelectFiles extends SafeComponent {
    @observable findFileText = null;

    onChangeFindFileText(text) {
        this.findFileText = text;
    }

    textbox() {
        const container = {
            flexGrow: 1,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 4,
            paddingTop: 0,
            paddingBottom: 0
        };
        const style = {
            flexGrow: 1,
            marginLeft: 8
        };

        return (
            <View style={container}>
                {icons.dark('search')}
                <TextInput
                    value={this.findFileText}
                    onChangeText={text => this.onChangeFindFileText(text)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder={tx('title_search')}
                    ref={ti => { this.textInput = ti; }} style={style} />
            </View>
        );
    }

    exitRow() {
        const container = {
            flexGrow: 1,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 4,
            paddingTop: vars.statusBarHeight,
            paddingBottom: 0
        };
        const style = {
            flexGrow: 1
        };
        const textStyle = {
            fontSize: vars.font.size.normal,
            fontWeight: vars.font.weight.semiBold,
            color: 'rgba(0, 0, 0, .54)'
        };
        const goStyle = {
            fontSize: vars.font.size.normal,
            fontWeight: vars.font.weight.semiBold,
            color: vars.bg
        };
        const selected = fileState.selected.length;
        return (
            <View style={container}>
                {icons.dark('close', () => fileState.exitSelectFiles())}
                <Center style={style}><Text style={textStyle}>{tx('title_shareToChat')}</Text></Center>
                { selected ?
                    icons.text(t('button_go'), () => fileState.submitSelectFiles(), goStyle) : icons.placeholder()}
            </View>
        );
    }

    get data() {
        let result = fileStore.files.sort((f1, f2) => {
            return f2.uploadedAt - f1.uploadedAt;
        }).filter(f => f.readyForDownload && f.canShare);
        if (this.findFileText) {
            const text = this.findFileText.toLowerCase();
            result = result.filter(f => f.name.toLowerCase().indexOf(text) !== -1);
        }
        return result;
    }

    item(file) {
        return (
            <FileInnerItem
                key={file.id}
                checkbox="always"
                hideArrow
                file={file} />
        );
    }

    body() {
        return (
            <View>
                {this.data.map(this.item)}
            </View>
        );
    }

    lineBlock(content) {
        const s = {
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0, 0, 0, .12)'
        };
        return (
            <View style={s}>{content}</View>
        );
    }

    header() {
        const tbSearch = this.textbox();
        const exitRow = this.exitRow();
        return (
            <View>
                {this.lineBlock(exitRow)}
                {this.lineBlock(tbSearch)}
            </View>
        );
    }

    renderThrow() {
        const header = this.header();
        const body = this.body();
        const layoutStyle = {
            backgroundColor: 'white'
        };
        return (
            <Layout1
                defaultBar
                noFitHeight
                body={body}
                header={header}
                style={layoutStyle} />
        );
    }
}

