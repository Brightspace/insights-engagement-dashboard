/* eslint quotes: 0 */

export default {
	"dashboard:title": "Engagement Dashboard",
	"dashboard:userView:title": "Learner Engagement Dashboard",
	"dashboard:backToInsightsPortal": "Back to Insights Portal",
	"dashboard:backToEngagementDashboard": "Back to Engagement Dashboard",
	"dashboard:backToUserSelector": "Select a Different User",
	"dashboard:backLinkTextShort": "Back",
	"dashboard:summaryHeading": "Summary View",
	"dashboard:resultsHeading": "Results",
	"dashboard:resultsReturned": "Users returned within results.",
	"dashboard:overdueAssignments": "Users currently have one or more overdue assignments.",
	"dashboard:overdueAssignmentsHeading": "Overdue Assignments",
	"dashboard:coursesInViewHeader": "Courses in View",
	"coursesInView:CoursesReturned": "courses returned within results.",
	"dashboard:lastSystemAccessMessage": "Users have no system access in the last {thresholdDays} days.",
	"dashboard:lastSystemAccessMessageOneDay": "Users have no system access in the last day.",
	"dashboard:lastSystemAccessHeading": "System Access",
	"dashboard:tooManyResults": "There are too many results in your filters. Please refine your selection.",
	"dashboard:learMore": "Learn More",
	"dashboard:exportToCsv": "Export to CSV",
	"dashboard:saveDefaultView": "Make this my default view",
	"dashboard:emailButtonAriaLabel": "Table actions. Email selected users in a new window",
	"dashboard:emailButton": "Email",
	"dashboard:print": "Print",
	"dashboard:noUsersSelectedDialogText": "Please select one or more users to email.",
	"dashboard:noResultsAvailable": "There are no results available that match your filters.",
	"dashboard:noRolesSelected": "We couldn't find any data because there are no selected user roles.",
	"dashboard:queryFailed": "Unable to load your results. If this problem persists, please ",
	"dashboard:queryFailedLink": "contact D2L Support.",
	"dashboard:undoLastAction": "Undo Last Action",
	"dashboard:goToSettings": "Go To Settings",

	"settings:roleListTitle": "Roles filter",
	"settings:roleListDescription": "Set which learner roles to include in your dashboard data. All other roles will be filtered out.",
	"settings:roleListError": "Role filter requires at least one selected role.",
	"settings:systemAccessError": "System access must be greater than 0 and less than 31.",

	"orgUnitFilter:name": "Org Unit",

	"semesterFilter:name": "Semester",
	"semesterFilter:semesterName": "{orgUnitName} (Id: {orgUnitId})",

	"simpleFilter:searchLabel": "Search",
	"simpleFilter:searchPlaceholder": "Search...",
	"simpleFilter:dropdownAction": "Open {name} filter",

	"treeFilter:nodeName": "{orgUnitName} (Id: {id})",
	"treeSelector:searchLabel": "Search",
	"treeSelector:loadMoreLabel": "Load More",
	"treeSelector:searchPlaceholder": "Search...",

	"dropdownFilter:loadMore": "Load More",
	"dropdownFilter:openerTextAll": "{filterName}: All",
	"dropdownFilter:openerTextMultiple": "{filterName}: {selectedCount} selected",
	"dropdownFilter:openerTextSingle": '{filterName}: {selectedItemName}',

	"usersTable:title": "User Details table. This table lists the Users that satisfy the filtering criteria. Actions that may be applied to multiple items are available in the table actions.",
	"usersTable:loadingPlaceholder": "Loading",
	"usersTable:lastFirstName": "Name",
	"usersTable:openUserPage": "Open user's page for {userName}",
	"usersTable:lastAccessedSystem": "Last Accessed System",
	"usersTable:courses": "Courses",
	"usersTable:avgGrade": "Average Grade",
	"usersTable:avgTimeInContent": "Average Time in Content (mins)",
	"usersTable:avgDiscussionActivity": "Average Discussion Activity",
	"usersTable:totalUsers": "Total Users: {num}",
	"usersTable:lastAccessedSys" : "Last Accessed System",
	"usersTable:null" : "NULL",
	"usersTable:selectorAriaLabel": "Select {userLastFirstName}",
	"usersTable:noGrades": "No grades",

	"table:selectAll": "Select all",
	"table:sortedAscending": "Sorted Ascending",
	"table:sortedDescending": "Sorted Descending",

	"usersTableExport:lastName": "Last Name",
	"usersTableExport:FirstName": "First Name",
	"usersTableExport:UserName": "User Name",
	"usersTableExport:UserID": "User ID",
	"usersTableExport:userListDescription": "This table is a list of learners that have more information in the dashboard. The top row lists last name, first name. Search criteria for this list can also include username and Org Defined ID. Select learner from list to look at learner specific information.",

	"summaryCard:label": "{value} {message}",

	"timeInContentVsGradeCard:timeInContentVsGrade": "Time in Content vs. Grade",
	"timeInContentVsGradeCard:currentGrade": "Current Grade (%)",
	"timeInContentVsGradeCard:averageGrade": "The average for selected enrollments is {avgGrade} percent",
	"timeInContentVsGradeCard:timeInContentLong": "Time in Content (minutes)",
	"timeInContentVsGradeCard:averageTimeInContent": "The average for selected enrollments is {avgTimeInContent} minutes",
	"timeInContentVsGradeCard:leftTop": "{numberOfUsers} user enrollments are getting an above average grade and spending below average time in content.",
	"timeInContentVsGradeCard:rightTop": " {numberOfUsers} user enrollments are getting an above average grade and spending above average time in content.",
	"timeInContentVsGradeCard:leftBottom": "{numberOfUsers} user enrollments are getting a below average grade and spending below average time in content.",
	"timeInContentVsGradeCard:rightBottom": "{numberOfUsers} user enrollments are getting a below average grade and spending above average time in content.",
	"timeInContentVsGradeCard:highTimeHighGrade": "High time and high grade.",
	"timeInContentVsGradeCard:highTimeLowGrade": "High time and low grade.",
	"timeInContentVsGradeCard:lowTimeHighGrade": "Low time and high grade.",
	"timeInContentVsGradeCard:lowTimeLowGrade": "Low time and low grade.",

	"currentFinalGradeCard:currentGrade": "Current Grade",
	"currentFinalGradeCard:numberOfStudents": "Number of Users",
	"currentFinalGradeCard:xAxisLabel": "Current Grade (%)",
	"currentFinalGradeCard:textLabel": "This chart displays the current final grade for each user per course",
	"currentFinalGradeCard:emptyMessage": "There are no results available that match your filters.",
	"currentFinalGradeCard:gradeBetween": "{numberOfUsers} users have a current grade between {range}%",
	"currentFinalGradeCard:gradeBetweenSingleUser": "1 user has a current grade between {range}%",

	"courseLastAccessCard:courseAccess": "Course Access",
	"courseLastAccessCard:numberOfUsers": "Number of Users",
	"courseLastAccessCard:textLabel": "This chart displays the current final grade for each user per course",
	"courseLastAccessCard:lastDateSinceAccess": "Last Time a User Accessed a Course",
	"courseLastAccessCard:never": "Never",
	"courseLastAccessCard:daysAgo": "days ago",
	"courseLastAccessCard:moreThanFourteenDaysAgo": "> 14 days ago",
	"courseLastAccessCard:sevenToFourteenDaysAgo": "7-14 days ago",
	"courseLastAccessCard:fiveToSevenDaysAgo": "5-7 days ago",
	"courseLastAccessCard:threeToFiveDaysAgo": "3-5 days ago",
	"courseLastAccessCard:oneToThreeDaysAgo": "1-3 days ago",
	"courseLastAccessCard:lessThanOneDayAgo": "< 1 day ago",
	"courseLastAccessCard:accessibilityLessThanOne": "Less than 1 day ago",
	"courseLastAccessCard:accessibilityMoreThanFourteenDaysAgo": "More than 14 days ago",
	"courseLastAccessCard:tooltipNeverAccessed": "{numberOfUsers} users have never accessed the course",
	"courseLastAccessCard:tooltipMoreThanFourteenDays": "{numberOfUsers} users last accessed the course more than 14 days ago",
	"courseLastAccessCard:toolTipSevenToFourteenDays": "{numberOfUsers} users last accessed the course 7 to 14 days ago",
	"courseLastAccessCard:toolTipFiveToSevenDays": "{numberOfUsers} users last accessed the course 5 to 7 days ago",
	"courseLastAccessCard:toolTipThreeToFiveDays": "{numberOfUsers} users last accessed the course 3 to 5 days ago",
	"courseLastAccessCard:toolTipOneToThreeDays": "{numberOfUsers} users last accessed the course 1 to 3 days ago",
	"courseLastAccessCard:toolTipLessThanOneDay": "{numberOfUsers} users last accessed the course less than 1 day ago",
	"courseLastAccessCard:tooltipNeverAccessedSingleUser": "1 user has never accessed the course",
	"courseLastAccessCard:tooltipMoreThanFourteenDaysSingleUser": "1 user last accessed the course more than 14 days ago",
	"courseLastAccessCard:toolTipSevenToFourteenDaysSingleUser": "1 user last accessed the course 7 to 14 days ago",
	"courseLastAccessCard:toolTipFiveToSevenDaysSingleUser": "1 user last accessed the course 5 to 7 days ago",
	"courseLastAccessCard:toolTipThreeToFiveDaysSingleUser": "1 user last accessed the course 3 to 5 days ago",
	"courseLastAccessCard:toolTipOneToThreeDaysSingleUser": "1 user last accessed the course 1 to 3 days ago",
	"courseLastAccessCard:toolTipLessThanOneDaySingleUser": "1 user last accessed the course less than 1 day ago",

	"contentViewHistogram:title": "Content View",
	"contentViewHistogram:textLabel": "This chart displays the total number of content views for all users in the selected courses",
	"contentViewHistogram:contentViews": "Number of Content Topic Views",
	"contentViewHistogram:userCount": "Number of Users",
	"contentViewHistogram:usersInRange": "{numUsers} users have accessed the content {start} to {end} times",
	"contentViewHistogram:userInRange": "1 user has accessed the content {start} to {end} times",
	"contentViewHistogram:usersZeroTimes": "{numUsers} users have accessed the content 0 times",
	"contentViewHistogram:userZeroTimes": "1 user has accessed the content 0 times",
	"contentViewHistogram:usersGreaterTimes": "{numUsers} users have accessed the content greater than {start} times",
	"contentViewHistogram:userGreaterTimes": "1 user has accessed the content greater than {start} times",
	"contentViewHistogram:views": "views",

	"discussionActivityCard:cardTitle": "Discussion Activity",
	"discussionActivityCard:threads": "Threads",
	"discussionActivityCard:replies": "Replies",
	"discussionActivityCard:reads": "Reads",
	"discussionActivityCard:textLabel": "This chart displays the total number of threads, replies, and reads in discussion forums for all users in the selected courses",
	"discussionActivityCard:toolTipThreads": "{numberOfUsers} threads have been created by the returned users",
	"discussionActivityCard:toolTipReplies": "{numberOfUsers} posts have been replied to by the returned users",
	"discussionActivityCard:toolTipReads": "{numberOfUsers} posts have been read by the returned users",
	"discussionActivityCard:legendItem": "Toggle {itemName}",
	"discussionActivityCard:legendLabel": "Toggle filtering",

	"appliedFilters:clearAll": "Clear all",
	"appliedFilters:showMore": "+{numHidden} more",
	"appliedFilters:hideExtra": "Collapse",
	"appliedFilters:labelText": "Showing only:",
	"appliedFilters:axeDescriptionCategories": "Filtering {chartName}, ",
	"appliedFilters:axeDescriptionApplied": "Filtering users with {chartName}",

	"ariaLoadingProgress:loadingStart": "Loading is in progress",
	"ariaLoadingProgress:loadingFinish": "Loading is finished",

	"defaultViewPopup:title": "Engagement Dashboard Default View",
	"defaultViewPopup:resultsFromNRecentCourses": "This dashboard is designed to look at portions of your organization's engagement. Results showing are from {numDefaultCourses} recently accessed courses to get you started.",
	"defaultViewPopup:promptUseFilters": "Use the dashboard filters to change the results displayed.",
	"defaultViewPopup:emptyResultsFromNRecentSemesters": "This dashboard is designed to look at portions of your organization's engagement. You do not have permission to review data in any courses in the most recently created {numDefaultSemesters} semesters.",
	"defaultViewPopup:expandDefaultCourseList": "Expand to see the courses included in your default view",
	"defaultViewPopup:collapseDefaultCourseList": "Collapse the list of courses included in your default view",
	"defaultViewPopup:buttonOk": "Ok",

	"settings:title": "Settings",
	"settings:description": "Set which metrics display in the Summary and Result Detail section of the Engagement Dashboard.",
	"settings:tabTitleSummaryMetrics": "Summary Metrics",
	"settings:tabTitleResultsTableMetrics": "Results Table Metrics",
	"settings:tabTitleUserLevelMetrics": "User Level Metrics",
	"settings:saveAndClose": "Save and Close",
	"settings:save": "Save",
	"settings:cancel": "Cancel",
	"settings:selectAll": "Select All",
	"settings:deselectAll": "Deselect All",
	"settings:errors": "The following errors were found in the submitted settings.",

	"settings:currentGradeDesc": "The Current Grade card shows the current grade for each enrollment per user for courses that are filtered on.",
	"settings:courseAccessDesc": "The Course Access card shows the last access in a course for each enrollment per user for courses that are filtered on.",
	"settings:ticVsGradeDesc": "The Time in Content versus Grade card shows the total time spent in a course relative to the current grade for each enrollment per user for courses that are filtered on. The chart is mapped into quadrants based on the average grade or time spent for the users in view.",
	"settings:overdueAssignmentsDesc": "The Overdue Assignments card shows the number of users who have one or more assignments overdue in the courses that are filtered on.",
	"settings:systemAccessDesc": "The System Access card shows the last access the user had in any way.",
	"settings:discActivityDesc": "The Discussion Activity card shows passive and active social engagement in each course that is filtered on. This metric reports when a user creates a thread, replies to an existing post, or reads a post.",
	"settings:contentViewDesc": "The Content View card shows how many content topics have been viewed for each enrollment per user.",

	"settings:systemAccessEdit": "Show users who have not accessed the system in the last {num} days.",
	"settings:systemAccessEditLabel": "Edit system access threshold",

	"settings:avgGrade": "Average Grade",
	"settings:avgGradeSummary": "Average Grade Summary",
	"settings:avgTimeInContent": "Average Time in Content",
	"settings:avgDiscussionActivity": "Average Discussion Participation",
	"settings:lastAccessedSystem": "System Last Access",
	"settings:predictedGrade": "Predicted Grade",
	"settings:avgGradeDescription": "The Average Grade indicator presents the current average grade for the user across all the courses included in the applied filters.",
	"settings:avgTimeInContentDescription": "The Average Time in Content indicator shows the average time spent in content, as an average of total time per course, for the user across all the courses included in the applied filters.  This metric is reported in minutes.",
	"settings:avgDiscussionActivityDescription": "The Average Discussion Participation indicator presents user statistics for how often the user creates a thread, reads a post or replies to a post across all the courses included in the applied filters.  This metric averages the total count per course.",
	"settings:lastAccessedSystemDescription": "The System Last Access indicator displays the timestamp, in Brightspace local time, of the last time the user accessed the system in any way.",
	"settings:predictedGradeDescription": "The Predicted Grade indicator presents the average predicted final grade for the user across all the courses included in the applied filters. Data for this metric is produced from the Student Success System.",
	"settings:invalidSystemAccessValueToast": "Your settings could not be saved. System Access thresholds need to be between 1 and 30.",
	"settings:serverSideErrorToast": "Something went wrong. Your settings could not be saved.",

	"settings:avgGradeSummaryDescription": "The Average Grade Summary card presents the current average grade for the student across courses that are filtered on.",
	"settings:gradesOverTimeDescription": "The Grades Over Time card shows how the learner's grades have changed over time.",
	"settings:accessOverTimeDescription": "The Course Access Over Time card shows how the learner's course access frequency has changed over time.",
	"settings:contentViewsOverTimeDescription": "The Content Views Over Time card shows how view counts for content have changed over time.",

	"userDrill:noUser": "This user could not be loaded. Go to the Engagement Dashboard to view the list of users.",
	"userDrill:noData": "No data in filtered ranges. Refine your selection.",
	"userDrill:manyCoursesAlert": "This dashboard is most useful with less than 10 courses. Please refine your selected courses for a better experience.",
	"userDrill:summaryView": "Summary View",
	"userDrill:course": "Course",
	"activeCoursesTable:title": "Active Courses",
	"activeCoursesTable:loadingPlaceholder": "Loading",
	"activeCoursesTable:course": "Course Name",
	"activeCoursesTable:currentGrade": "Current Grade",
	"activeCoursesTable:grade": "Grade",
	"activeCoursesTable:predictedGrade": "Predicted Grade",
	"activeCoursesTable:timeInContent": "Time in Content (mins)",
	"activeCoursesTable:discussions": "Discussion Activity",
	"activeCoursesTable:courseLastAccess": "Course Last Access",
	"activeCoursesTable:noGrade": "No grade",
	"activeCoursesTable:noPredictedGrade": "No predicted grade",
	"activeCoursesTable:isActive": "Is Active Course",
	"activeCoursesTable:empty": "No active course data in filtered ranges.",

	"inactiveCoursesTable:title": "Inactive Courses",
	"inactiveCoursesTable:course": "Course Name",
	"inactiveCoursesTable:grade": "Final Grade",
	"inactiveCoursesTable:content": "Total Time in Content (mins)",
	"inactiveCoursesTable:discussions": "Discussion Activity",
	"inactiveCoursesTable:lastAccessedCourse": "Course Last Access",
	"inactiveCoursesTable:loadingPlaceholder": "Loading",
	"inactiveCoursesTable:semester": "Semester",
	"inactiveCoursesTable:empty": "No inactive course data in filtered ranges.",

	"accessTrendCard:title": "Course Access Over Time",
	"accessTrendCard:xAxisTitle": "Date",
	"accessTrendCard:yAxisTitle": "Course Access Count",

	"userOverdueAssignmentsCard:assignmentsCurrentlyOverdue": "assignments are currently overdue.",
	"averageGradeSummaryCard:averageGradeText" : "grade averaged from the courses in view.",
	"averageGradeSummaryCard:averageGradeTextLine1" : "grade averaged from",
	"averageGradeSummaryCard:averageGradeTextLine2" : "the courses in view.",
	"averageGradeSummaryCard:averageGrade" : "Average Grade",
	"averageGradeSummaryCard:noGradeInfoAvailable" : "No grade information available.",
	"userSysAccessCard:daysSinceLearnerHasLastAccessedSystem": "days since the learner last accessed the system.",
	"userSysAccessCard:userHasNeverAccessedSystem": "User has never accessed the system.",

	"coursesLegend:coursesLegendFilter": "Courses",

	"contentViewsCard:contentViewOverTime": "Content Views Over Time",
	"contentViewsCard:viewCount": "View Count",
	"contentViewsCard:date": "Date",

	"gradesTrendCard:date": "Date",
	"gradesTrendCard:gradesOverTime": "Grades Over Time",
	"gradesTrendCard:currentGrade": "Current Grade (%)",

	"chart:loading": "Loading...",
	"chart:resetZoom": "Reset zoom",
	"chart:resetZoomTitle": "Reset zoom level 1:1",

	"alert:updatedFilter" : "{chartName} filter updated.",
	"alert:axeDescriptionRange" : "Viewing learners with {chartName} in these categories ",
	"alert:axeDescription" : "Viewing learners with {category}",
	"alert:axeNotFiltering" : "Stopped Filtering by {chartName}.",
	// this "to" that, and this "to" that <- translate the word "to" in this context
	"alert:this-To-That" : "to",
	"alert:greaterThanThis" : "greater than {num}",
	"alert:axeDescriptionCourses" : "Viewing learner data in these courses ",
	"alert:axeDescriptionCoursesOff" : "Viewing learner data in all courses."
};
