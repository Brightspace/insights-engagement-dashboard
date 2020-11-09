/* eslint quotes: 0 */

export default {
	"components.insights-engagement-dashboard.title": "Engagement Dashboard",
	"components.insights-engagement-dashboard.summaryHeading": "Summary View",
	"components.insights-engagement-dashboard.resultsHeading": "Results",
	"components.insights-engagement-dashboard.resultsReturned": "Users returned within results.",
	"components.insights-engagement-dashboard.overdueAssignments": "Users currently have one or more overdue assignments.",
	"components.insights-engagement-dashboard.overdueAssignmentsHeading": "Overdue Assignments",
	"components.insights-engagement-dashboard.lastSystemAccess": "Users have no system access in the last 14 days.",
	"components.insights-engagement-dashboard.lastSystemAccessHeading": "System Access",
	"components.insights-engagement-dashboard.tooManyResults": "There are too many results in your filters. Please refine your selection.",
	"components.insights-engagement-dashboard.learMore": "Learn More",
	"components.insights-engagement-dashboard.exportToCsv": "Export to CSV",
	"components.insights-engagement-dashboard.saveDefaultView": "Make this my default view",
	"components.insights-engagement-dashboard.emailButton": "Email",
	"components.insights-engagement-dashboard.noUsersSelectedDialogText": "Please select one or more users to email.",
	"components.insights-engagement-dashboard.noResultsAvailable": "There are no results available that match your filters.",

	"components.insights-role-filter.name": "Role",

	"components.org-unit-filter.name-all-selected": "Org Unit: All",
	"components.org-unit-filter.name-some-selected": "Org Unit: Selections Applied",

	"components.semester-filter.name": "Semester",
	"components.semester-filter.semester-name": "{orgUnitName} (Id: {orgUnitId})",

	"components.simple-filter.search-label": "Search",
	"components.simple-filter.search-placeholder": "Search...",
	"components.simple-filter.dropdown-action": "Open {name} filter",

	"components.tree-filter.node-name": "{orgUnitName} (Id: {id})",
	"components.tree-filter.node-name.root": "root",
	"components.tree-selector.filterBy": "Filter By",
	"components.tree-selector.clear-label": "Clear",
	"components.tree-selector.search-label": "Search",
	"components.tree-selector.load-more-label": "Load More",
	"components.tree-selector.parent-load-more.aria-label": "Load more child org units",
	"components.tree-selector.search-load-more.aria-label": "Load more search results",
	"components.tree-selector.search-placeholder": "Search...",
	"components.tree-selector.dropdown-action": "Open {name} filter",
	"components.tree-selector.arrow-label.closed": "Expand {name} at level {level}, child of {parentName}",
	"components.tree-selector.arrow-label.open": "Collapse {name} at level {level}, child of {parentName}",
	"components.tree-selector.node.aria-label": "{name}, child of {parentName},",

	"components.dropdown-filter.load-more": "Load More",
	"components.dropdown-filter.opener-text-all": "{filterName}: All",
	"components.dropdown-filter.opener-text-multiple": "{filterName}: {selectedCount} selected",
	"components.dropdown-filter.opener-text-single": '{filterName}: {selectedItemName}',

	"components.insights-users-table.title": "User Details",
	"components.insights-users-table.loadingPlaceholder": "Loading",
	"components.insights-users-table.lastFirstName": "Name",
	"components.insights-users-table.lastAccessedSystem": "Last Accessed System",
	"components.insights-users-table.courses": "Courses",
	"components.insights-users-table.avgGrade": "Average Grade",
	"components.insights-users-table.avgTimeInContent": "Average Time in Content (mins)",
	"components.insights-users-table.avgDiscussionActivity": "Average Discussion Activity",
	"components.insights-users-table.totalUsers": "Total Users: {num}",
	"components.insights-users-table.lastAccessedSys" : "Last Accessed System",
	"components.insights-users-table.null" : "NULL",
	"components.insights-users-table.selectorAriaLabel": "Select {userLastFirstName}",

	"components.insights-table.selectAll": "Select all",

	"components.insights-users-table-export.lastName": "Last Name",
	"components.insights-users-table-export.FirstName": "First Name",
	"components.insights-users-table-export.UserName": "User Name",
	"components.insights-users-table-export.UserID": "User ID",

	"components.insights-summary-card.label": "{value} {message}",

	"components.insights-time-in-content-vs-grade-card.timeInContentVsGrade": "Time in Content vs. Grade",
	"components.insights-time-in-content-vs-grade-card.currentGrade": "Current Grade (%)",
	"components.insights-time-in-content-vs-grade-card.timeInContent": "Time in Content (mins)",
	"components.insights-time-in-content-vs-grade-card.leftTop": "{numberOfUsers} user enrollments are getting an above average grade and spending below average time in content.",
	"components.insights-time-in-content-vs-grade-card.rightTop": " {numberOfUsers} user enrollments are getting an above average grade and spending above average time in content.",
	"components.insights-time-in-content-vs-grade-card.leftBottom": "{numberOfUsers} user enrollments are getting a below average grade and spending below average time in content.",
	"components.insights-time-in-content-vs-grade-card.rightBottom": "{numberOfUsers} user enrollments are getting a below average grade and spending above average time in content.",

	"components.insights-current-final-grade-card.currentGrade": "Current Grade",
	"components.insights-current-final-grade-card.numberOfStudents": "Number of Users",
	"components.insights-current-final-grade-card.xAxisLabel": "Current Grade (%)",
	"components.insights-current-final-grade-card.textLabel": "This chart displays the current final grade for each user per course",
	"components.insights-current-final-grade-card.emptyMessage": "There are no results available that match your filters.",
	"components.insights-current-final-grade-card.gradeBetween": "{numberOfUsers} users have a current grade between {range}%",
	"components.insights-current-final-grade-card.gradeBetweenSingleUser": "1 user has a current grade between {range}%",

	"components.insights-course-last-access-card.courseAccess": "Course Access",
	"components.insights-course-last-access-card.numberOfUsers": "Number of Users",
	"components.insights-course-last-access-card.textLabel": "This chart displays the current final grade for each user per course",
	"components.insights-course-last-access-card.lastDateSinceAccess": "Last Time a User Accessed a Course",
	"components.insights-course-last-access-card.never": "Never",
	"components.insights-course-last-access-card.moreThanFourteenDaysAgo": "> 14 days ago",
	"components.insights-course-last-access-card.sevenToFourteenDaysAgo": "7-14 days ago",
	"components.insights-course-last-access-card.fiveToSevenDaysAgo": "5-7 days ago",
	"components.insights-course-last-access-card.oneToFiveDaysAgo": "1-5 days ago",
	"components.insights-course-last-access-card.lessThanOneDayAgo": "< 1 day ago",
	"components.insights-course-last-access-card.accessibilityLessThanOne": "Less than 1 day ago",
	"components.insights-course-last-access-card.tooltipNeverAccessed": "{numberOfUsers} users have never accessed the course",
	"components.insights-course-last-access-card.tooltipMoreThanFourteenDays": "{numberOfUsers} users last accessed the course more than 14 days ago",
	"components.insights-course-last-access-card.toolTipSevenToFourteenDays": "{numberOfUsers} users last accessed the course 7 to 14 days ago",
	"components.insights-course-last-access-card.toolTipFiveToSevenDays": "{numberOfUsers} users last accessed the course 5 to 7 days ago",
	"components.insights-course-last-access-card.toolTipOneToFiveDays": "{numberOfUsers} users last accessed the course 1 to 5 days ago",
	"components.insights-course-last-access-card.toolTipLessThanOneDay": "{numberOfUsers} users last accessed the course less than 1 day ago",
	"components.insights-course-last-access-card.tooltipNeverAccessedSingleUser": "1 user has never accessed the course",
	"components.insights-course-last-access-card.tooltipMoreThanFourteenDaysSingleUser": "1 user last accessed the course more than 14 days ago",
	"components.insights-course-last-access-card.toolTipSevenToFourteenDaysSingleUser": "1 user last accessed the course 7 to 14 days ago",
	"components.insights-course-last-access-card.toolTipFiveToSevenDaysSingleUser": "1 user last accessed the course 5 to 7 days ago",
	"components.insights-course-last-access-card.toolTipOneToFiveDaysSingleUser": "1 user last accessed the course 1 to 5 days ago",
	"components.insights-course-last-access-card.toolTipLessThanOneDaySingleUser": "1 user last accessed the course less than 1 day ago",

	"components.insights-discussion-activity-card.cardTitle": "Discussion Activity",
	"components.insights-discussion-activity-card.threads": "Threads",
	"components.insights-discussion-activity-card.replies": "Replies",
	"components.insights-discussion-activity-card.reads": "Reads",
	"components.insights-discussion-activity-card.textLabel": "This chart displays the total number of threads, replies, and reads in discussion forums for all users in the selected courses",

	"components.insights-discussion-activity-card.toolTipThreads": "{numberOfUsers} threads have been created by the returned users",
	"components.insights-discussion-activity-card.toolTipReplies": "{numberOfUsers} posts have been replied to by the returned users",
	"components.insights-discussion-activity-card.toolTipReads": "{numberOfUsers} posts have been read by the returned users",
	"components.insights-discussion-activity-card.legendItem": "Toggle {itemName}",
	"components.insights-discussion-activity-card.legendLabel": "Toggle filtering",

	"components.insights-applied-filters.clear-all": "Clear all",
	"components.insights-applied-filters.label-text": "Showing only:",

	"components.insights-aria-loading-progress.loading-start": "Loading is in progress",
	"components.insights-aria-loading-progress.loading-finish": "Loading is finished",

	"components.insights-default-view-popup.title": "Engagement Dashboard Default View",
	"components.insights-default-view-popup.defaultViewDescription1": "This dashboard is designed to look at portions of your organization's engagement. Results showing are from {numDefaultCourses} recently accessed courses to get you started.",
	"components.insights-default-view-popup.defaultViewDescription2": "Use the dashboard filters to change the results displayed.",
	"components.insights-default-view-popup.expandDefaultCourseList": "Expand to see the courses included in your default view",
	"components.insights-default-view-popup.collapseDefaultCourseList": "Collapse the list of courses included in your default view",
	"components.insights-default-view-popup.buttonOk": "Ok"
};
