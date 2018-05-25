import React from 'react';
import SignupStep1 from '../signup-step1';
import SignupStepMedcryptor from '../signup-step-medcryptor';
import SignupAccountKey from '../signup-account-key';
import SignupConfirmBackup from '../signup-confirm-backup';
import SignupContactSyncStart from '../signup-contact-sync-start';
import SignupContactAdd from '../signup-contact-add';
import SignupContactInvite from '../signup-contact-invite';

const signupStep1 = () => <SignupStep1 />;
const signupStepMedcryptor = () => <SignupStepMedcryptor />;
const signupAccountKey = () => <SignupAccountKey />;
const signupConfirmBackup = () => <SignupConfirmBackup />;
const signupContactSyncStart = () => <SignupContactSyncStart />;
const signupContactAdd = () => <SignupContactAdd />;
const signupContactInvite = () => <SignupContactInvite />;

const PAGES = {
    signupStep1,
    signupStepMedcryptor,
    signupAccountKey,
    signupConfirmBackup,
    signupContactSyncStart,
    signupContactAdd,
    signupContactInvite
};

const PAGE_NAMES = Object.keys(PAGES);
const PAGE_COMPONENTS = Object.values(PAGES);

module.exports = { PAGE_NAMES, PAGE_COMPONENTS };
