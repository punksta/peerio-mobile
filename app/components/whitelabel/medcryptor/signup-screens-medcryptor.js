import React from 'react';
import SignupStep1Medcryptor from './signup-step1-medcryptor';
import SignupStep2Medcryptor from './signup-step2-medcryptor';
import SignupAccountKey from '../../whitelabel/medcryptor/signup-account-key';
import SignupConfirmBackup from '../../whitelabel/medcryptor/signup-confirm-backup';
import SignupContactSyncStart from '../../signup/signup-contact-sync-start';
import SignupContactAdd from '../../signup/signup-contact-add';
import SignupContactInvite from '../../signup/signup-contact-invite';

const signupStep1 = () => <SignupStep1Medcryptor />;
const signupStep2Medcryptor = () => <SignupStep2Medcryptor />;
const signupAccountKey = () => <SignupAccountKey />;
const signupConfirmBackup = () => <SignupConfirmBackup />;
const signupContactSyncStart = () => <SignupContactSyncStart />;
const signupContactAdd = () => <SignupContactAdd />;
const signupContactInvite = () => <SignupContactInvite />;

const PAGES = {
    signupStep1,
    signupStep2Medcryptor,
    signupAccountKey,
    signupConfirmBackup,
    signupContactSyncStart,
    signupContactAdd,
    signupContactInvite
};

const PAGE_NAMES = Object.keys(PAGES);
const PAGE_COMPONENTS = Object.values(PAGES);

module.exports = { PAGE_NAMES, PAGE_COMPONENTS };
