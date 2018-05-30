import React from 'react';
import MedcryptorAdminScreen from './medcryptor-admin-screen';
import medcryptorAdminState from './medcryptor-admin-state';

const MEDCRYPTOR_INITIAL_ROUTE = 'medcryptorAdmin';

const extendRoutes = (router) => {
    router.add(MEDCRYPTOR_INITIAL_ROUTE, [<MedcryptorAdminScreen />], medcryptorAdminState);
    router._initialRoute = MEDCRYPTOR_INITIAL_ROUTE;
};

export default extendRoutes;
