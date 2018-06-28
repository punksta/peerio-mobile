Feature: Edit Profile Settings

    Scenario Outline: I change my first name
        When I log in as <new or existing> user
        And  I go to public profile settings
        Then I change my first name
    Examples:
    | new or existing |
    | new             |
    | profiletest     |

    Scenario Outline: User changes last name
        When I log in as <new or existing> user
        And  I go to public profile settings
        Then I change my last name
    Examples:
    | new or existing |
    | new             |
    | profiletest     |

    Scenario Outline: User uploads a new avatar
        When I log in as <new or existing> user
        And  I go to public profile settings
        Then I upload a new avatar
    Examples:
    | new or existing |
    | new             |
    | profiletest     |

    Scenario: User changes existing avatar
        When I log in as profiletest user
        And  I go to public profile settings
        Then I change my existing avatar

    Scenario: View account key
        Given I log in as new user
        When  I go to security settings
        Then  I can see my account key