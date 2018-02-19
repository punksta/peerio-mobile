Feature: Account and login
    Users should be able to sign up, 
    login/logout or delete their accounts.

    Scenario: User signs up successfully
        When I choose the create account option
        And  I input my personal info
        Then I am presented with my passcode
        And  I confirm that I saved my passcode
        Then I am taken to the home tab

    @noCacheReset
    Scenario: Autologin
        Given I have signed up
        And   I close Peerio
        When  I open Peerio
        Then  I am taken to the home tab

    @noCacheReset
    Scenario: User logs out successfully
        Given I have signed up
        When  I sign out
        And   I close Peerio
        When  I open Peerio
        Then  I am taken to the Login Start screen

    @noCacheReset
    Scenario: Delete account
        Given I have signed up
        And   my email is confirmed
        When  I delete my account
        And   I close Peerio
        And   I open Peerio
        Then  I can not login with my credentials