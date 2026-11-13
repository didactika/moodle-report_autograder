@report @report_autograder @javascript
Feature: The autograder report
  In order to follow what Autograder decided
  As a teacher
  I need a report that lists the students of an activity and narrows as I ask

  Background:
    Given the following "courses" exist:
      | fullname      | shortname |
      | Statistics 1  | STAT1     |
    And the following "users" exist:
      | username | firstname | lastname |
      | teacher1 | Marina    | Castro   |
      | ana      | Ana       | Lopez    |
      | bruno    | Bruno     | Marti    |
      | carla    | Carla     | Nunez    |
      | diego    | Diego     | Ortega   |
    And the following "course enrolments" exist:
      | user     | course | role           |
      | teacher1 | STAT1  | editingteacher |
      | ana      | STAT1  | student        |
      | bruno    | STAT1  | student        |
      | carla    | STAT1  | student        |
      | diego    | STAT1  | student        |
    And the following "activities" exist:
      | activity | name        | course | idnumber |
      | assign   | Final essay | STAT1  | essay    |
    And the following autograder decisions exist:
      | activity | user  | status  | when |
      | essay    | ana   | pending | 3    |
      | essay    | bruno | graded  | -2   |
      | essay    | carla | failed  | -1   |
      | essay    | diego | manual  | -4   |
    And the guided tour of the autograder report is off
    And I log in as "admin"
    And I open the autograder report of "essay"

  Scenario: The report lists every student with the state of their decision
    When I wait for the report rows
    Then the report should show 4 rows
    And I should see "Ana Lopez" in the "#autograder-report-container table" "css_element"
    And I should see "Pending" in the "#autograder-report-container table" "css_element"
    And I should see "Autograded" in the "#autograder-report-container table" "css_element"

  Scenario: The search box narrows the table as the name is typed
    When I wait for the report rows
    And I set the field with xpath "//div[contains(@class, 'dd-searchbox')]//input" to "Bruno"
    And I wait "1" seconds
    And I wait for the report rows
    Then the report should show 1 row
    And I should see "Bruno Marti" in the "#autograder-report-container table" "css_element"

  Scenario: A state can be chosen in the filter and cleared again
    When I wait for the report rows
    And I click on "Status" "button" in the "[data-menu='status']" "css_element"
    And I click on "Pending" "text" in the "[data-menu='status'] .dd-select-menu" "css_element"
    And I wait for the report rows
    Then the report should show 1 row
    And I click on "Clear every filter" "button"
    And I wait for the report rows
    And the report should show 4 rows

  Scenario: The names can be sorted
    When I wait for the report rows
    And I click on "Sort by student name" "button"
    And I wait for the report rows
    Then "Ana Lopez" "text" should appear before "Diego Ortega" "text"
    And I click on "Sort by student name" "button"
    And I wait for the report rows
    And "Diego Ortega" "text" should appear before "Ana Lopez" "text"

  Scenario: The graders page names the people who could grade a course
    When I open the graders page of the autograder report for "STAT1"
    Then I should see "Marina Castro"
    And I should see "Ana Lopez"
