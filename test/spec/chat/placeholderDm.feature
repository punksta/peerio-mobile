Feature: Placeholder DM

    Scenario: I invite someone to Peerio and User accepts placeholder DM
        When I log in as placeholder_test user
        And  I invite someone to join Peerio
        And  I sign out
        Then They sign up
        And  They confirm their email
        Then they sign out
        Then I log in as placeholder_test user
        And  I recieve placeholder DM
        And  User accepts placeholder DM
        And  I can send a message to the current chat

    Scenario: I invite someone to Peerio and User dismisses placeholder DM
        When I log in as placeholder_test user
        And  I invite someone to join Peerio
        And  I sign out
        Then They sign up
        And  They confirm their email
        And they sign out
        Then I log in as placeholder_test user
        And  I recieve placeholder DM
        And  User dismisses placeholder DM
        And  I cannot see their DM

    Scenario: I invite someone to Peerio and User accepts placeholder DM
        When I log in as placeholder_test user
        And  I invite someone to join Peerio
        And  I sign out
        Then They sign up
        And  They confirm their email
        Then They recieve placeholder DM
        And  User accepts placeholder DM
        And  They can send a message to the current chat

    Scenario: I invite someone to Peerio and they decline placeholder DM
        When I log in as placeholder_test user
        And  I invite someone to join Peerio
        And  I sign out
        Then They sign up
        And  They confirm their email
        Then They recieve placeholder DM
        And  User dismisses placeholder DM
        And  They cannot see my DM