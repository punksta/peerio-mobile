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
import signupState from '../signup/signup-state';
import { telemetry } from '../../lib/icebear';
import tm from '../../telemetry';

const { S } = telemetry;

const MAINTENANCE_DAY = 'May 15';
const MAINTENANCE_TIME1 = '2 AM';
const MAINTENANCE_TIME2 = '5 AM';

const outerCircle = {
    width: vars.iconSizeMedium2x,
    height: vars.iconSizeMedium2x,
    borderRadius: vars.iconSizeMedium2x / 2,
    backgroundColor: vars.black05,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: vars.spacing.small.mini2x,
    marginBottom: vars.spacing.medium.mini
};
const innerCircle = {
    width: vars.iconSizeMedium,
    height: vars.iconSizeMedium,
    borderRadius: vars.iconSizeMedium / 2,
    backgroundColor: vars.black07,
    justifyContent: 'center',
    alignItems: 'center'
};

@observer
class TopDrawerBackupAccountKey extends SafeComponent {
    renderThrow() {
        const action = () => {
            signupState.saveAccountKey();
            tm.signup.saveAk(S.TERMS_TOP_DRAWER);
        };
        return (
            <TopDrawer
                {...this.props}
                heading={tx('title_backupAk')}
                image={(
                    <View style={outerCircle}>
                        <View style={innerCircle}>
                            {icons.darkNoPadding('file-download')}
                        </View>
                    </View>)}
                descriptionLine1={tx('title_backupAkReminderMobile')}
                buttonText={tx('button_backupNow')}
                buttonAction={action}
            />
        );
    }
}

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

export { TopDrawerMaintenance, TopDrawerNewContact, TopDrawerBackupAccountKey };
