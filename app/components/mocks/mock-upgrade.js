import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import ModalLayout from '../layout/modal-layout';
import routerModal from '../routes/router-modal';

@observer
export default class MockUpgrade extends Component {
    componentDidMount() {
        setTimeout(() => routerModal.accountUpgradeSwiper(), 500);
    }

    render() {
        return <ModalLayout />;
    }
}
