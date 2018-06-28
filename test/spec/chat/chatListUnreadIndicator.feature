Feature: Chat list unread message indicator

    Scenario: Use top unread message indicator to find chat in chat list
        When I log in as chatListUnreadSender user
        Then I start a DM with chatListUnreadReciever user
        Then I can send a message to the current chat
        Then I exit the current chat
        And  they sign out
        When I log in as chatListUnreadReciever user
        Then I scroll down the chat list
        And  I press the top unread message indicator 
        And  I can see the top unread chat

    Scenario: Use bottom unread message indicator to find chat in chat list
        When I log in as chatListUnreadSender_2 user
        Then I start a DM with chatListUnreadReciever_2 user
        Then I can send a message to the current chat
        Then I exit the current chat
        And  they sign out
        When I log in as chatListUnreadReciever_2 user
        Then I press the bottom unread message indicator
        And  I can see the bottom unread chat
