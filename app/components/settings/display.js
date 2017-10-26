import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text } from 'react-native';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import SafeComponent from '../shared/safe-component';
import WarningItem from './warning-item';
import PreferenceToggleItem from './preference-toggle-item';
import preferenceStore from './preference-store';

const bgStyle = {
    flexGrow: 1,
    flex: 1,
    paddingVertical: vars.listViewPaddingVertical / 2,
    paddingHorizontal: vars.listViewPaddingHorizontal,
    backgroundColor: vars.settingsBg
};

const spacer = {
    height: 24
};

const text = {
    color: vars.txtMedium,
    marginBottom: vars.spacing.small.midi2x,
    marginLeft: vars.spacing.small.midi2x
};

@observer
export default class Display extends SafeComponent {
    renderThrow() {
        return (
            <View style={bgStyle}>
                <Text style={text}>{tx('title_imagePreview')}</Text>
                <PreferenceToggleItem
                    property={'peerioContentEnabled'}
                    title={tx('title_showImagePreviews')}
                    description={tx('title_showImagePreviewsDescription')} />
                <PreferenceToggleItem
                    property={'limitInlineImageSize'}
                    title={tx('title_showLargeImages')} />
                {<Text style={text}>{tx('title_urlPreview')}</Text>}
                <WarningItem
                    content={tx('title_EnableUrlPreviewWarning')}
                    linkContent={tx('title_learnMore')}
                    link=""
                    />
                <PreferenceToggleItem
                    property={'externalContentEnabled'}
                    title={tx('title_enableAllUrlPreview')} />
                {preferenceStore.prefs.externalContentEnabled &&
                    <PreferenceToggleItem
                        property={'externalContentJustForFavs'}
                        title={tx('title_onlyFromFavourites')} />}
                <View style={spacer} />
            </View>
        );
    }
}
