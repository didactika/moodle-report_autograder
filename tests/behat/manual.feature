@report @report_autograder @javascript @report_autograder_manual
Feature: The screenshots of the user manual
  In order to keep the user manual true to the interface
  As a maintainer
  I need the screenshots of the manual to be taken from the real report, with data that makes them worth looking at

  Background:
    Given the following "courses" exist:
      | fullname                  | shortname |
      | Introduction to statistics | STAT101   |
      | Advanced calculus          | CALC201   |
    And the following "users" exist:
      | username | firstname | lastname |
      | marina   | Marina    | Castro   |
      | ana      | Ana       | Lopez    |
      | bruno    | Bruno     | Marti    |
      | carla    | Carla     | Nunez    |
      | diego    | Diego     | Ortega   |
      | elena    | Elena     | Ruiz     |
      | felix    | Felix     | Soler    |
      | gala     | Gala      | Torres   |
    And the following "course enrolments" exist:
      | user   | course  | role           |
      | marina | STAT101 | editingteacher |
      | marina | CALC201 | editingteacher |
      | ana    | STAT101 | student        |
      | bruno  | STAT101 | student        |
      | carla  | STAT101 | student        |
      | diego  | STAT101 | student        |
      | elena  | STAT101 | student        |
      | felix  | STAT101 | student        |
      | gala   | STAT101 | student        |
      | ana    | CALC201 | student        |
      | bruno  | CALC201 | student        |
    And the following "activities" exist:
      | activity | name                   | course  | idnumber |
      | assign   | Final essay            | STAT101 | essay    |
      | assign   | Laboratory report      | STAT101 | lab      |
      | assign   | Limits problem set     | CALC201 | limits   |
    And the following autograder decisions exist:
      | activity | user  | status      | when | reason     |
      | essay    | ana   | pending     | 3    | duedate    |
      | essay    | bruno | graded      | -2   | submission |
      | essay    | carla | failed      | -1   | completion |
      | essay    | diego | manual      | -4   | duedate    |
      | essay    | elena | pending     | 1    | useroverride |
      | essay    | felix | notengaged  | 5    | duedate    |
      | essay    | gala  | graded      | -3   | submission |
      | lab      | ana   | pending     | 6    | duedate    |
      | lab      | bruno | graded      | -1   | submission |
      | limits   | ana   | graded      | -5   | submission |
      | limits   | bruno | pending     | 2    | duedate    |
    And I log in as "admin"
    And I change viewport size to "1400x1000"

  Scenario: The report of an activity
    When I open the autograder report of "essay"
    And I wait for the report rows
    And I wait "2" seconds
    Then I capture the report as "report-activity"

  Scenario: The status filter and the report of a course
    When I open the autograder report of "essay"
    And I wait for the report rows
    And I click on "Status" "button" in the ".arp-toolbar" "css_element"
    And I click on "Pending" "button" in the ".arp-floating" "css_element"
    And I wait for the report rows
    And I wait "1" seconds
    Then I capture the report as "report-status-filter"

  Scenario: The report on a small screen
    When I change viewport size to "430x900"
    And I open the autograder report of "essay"
    And I wait for the report rows
    And I wait "2" seconds
    Then I capture the report as "report-mobile"

  Scenario: The graders of a course
    When I open the graders page of the autograder report
    And I click on "Course" "button" in the ".arp-toolbar" "css_element"
    And I set the field with xpath "//input[contains(@class, 'arp-picker-field')]" to "STAT"
    And I click on "Introduction to statistics" "button" in the ".arp-floating" "css_element"
    And I click on "See which grader each student would get" "button"
    And I wait "2" seconds
    Then I capture the report as "graders"
