import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import TopDrawer from '../shared/top-drawer';
import { tx } from '../utils/translator';
import AvatarCircle from './avatar-circle';
import SafeComponent from './safe-component';
import { chatState } from '../states';

const MAINTENANCE_DAY = 'May 15';
const MAINTENANCE_TIME1 = '2 AM';
const MAINTENANCE_TIME2 = '5 AM';

@observer
class TopDrawerMaintenance extends SafeComponent {
    renderThrow() {
        return (
            <TopDrawer
                {...this.props}
                heading={tx('title_scheduledMaintenance')}
                image={icons.imageIcon(
                    require('../../assets/info-icon.png'),
                    vars.iconSizeMedium2x
                )}
                descriptionLine1={tx('title_peerioUnavailable')}
                descriptionLine2={tx('title_unavailabilityTime', {
                    day: MAINTENANCE_DAY,
                    time1: MAINTENANCE_TIME1,
                    time2: MAINTENANCE_TIME2
                })}
                buttonText={tx('title_readMore')}
                buttonAction={() => console.log('open link')} // TODO fix link
            />
        );
    }
}

class TopDrawerNewContact extends SafeComponent {
    renderThrow() {
        const { contact } = this.props;
        if (!contact) throw new Error('Must pass contact as props');
        return (
            <TopDrawer
                {...this.props}
                heading={tx('title_newContactHeading')}
                image={
                    <View style={{ padding: vars.spacing.small.maxi2x }}>
                        <AvatarCircle contact={contact} />
                    </View>
                }
                descriptionLine1={tx('title_newContactDescription', {
                    username: contact.username,
                    email: contact.addresses[0]
                })}
                buttonText={tx('button_startChat')}
                buttonAction={() => chatState.startChat([contact])}
            />
        );
    }
}

export { TopDrawerMaintenance, TopDrawerNewContact };
