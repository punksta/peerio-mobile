Feature: Chat list unread message indicator

    Scenario Outline: Use top unread message indicator to find chat in chat list
        When I log in as <user_sender> user
        Then I start a DM with <user_reciever> user
        Then I can send a message to the current chat
        Then I exit the current chat
        And  they sign out
        When I log in as <user_reciever> user
        Then I scroll down the chat list
        And  I press the top unread message indicator 
        And  I can see the top unread chat
    Examples:
    | user_reciever          | user_sender          |
    | chatListUnreadReciever | chatListUnreadSender |

    Scenario Outline: Use bottom unread message indicator to find chat in chat list
        When I log in as <user_sender> user
        Then I start a DM with <user_reciever> user
        Then I can send a message to the current chat
        Then I exit the current chat
        And  they sign out
        When I log in as <user_reciever> user
        Then I press the bottom unread message indicator
        And  I can see the bottom unread chat
    Examples:
    | user_reciever            | user_sender            |
    | chatListUnreadReciever_2 | chatListUnreadSender_2 |
