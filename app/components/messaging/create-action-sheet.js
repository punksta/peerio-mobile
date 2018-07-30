import { tx } from '../utils/translator';
import routes from '../routes/routes';
import ActionSheetLayout from '../layout/action-sheet-layout';

export default class CreateActionSheet {
    static show() {
        const actionButtons = [
            { title: tx('title_newRoom'), action: routes.modal.createChannel },
            { title: tx('title_newDirectMessage'), action: routes.modal.compose }
        ];
        ActionSheetLayout.show({
            header: null,
            actionButtons,
            hasCancelButton: true
        });
    }
}
