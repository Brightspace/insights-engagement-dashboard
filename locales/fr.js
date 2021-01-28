/* eslint quotes: 0 */

export default {
	"dashboard:title": "Tableau de bord Engagement",
	"dashboard:userView:title": "Tableau de bord de l’Engagement de l’élève",
	"dashboard:backToInsightsPortal": "Retourner au Portail Insights",
	"dashboard:backToEngagementDashboard": "Retour au tableau de bord Engagement",
	"dashboard:backLinkTextShort": "Précédent",
	"dashboard:summaryHeading": "Vue Sommaire",
	"dashboard:resultsHeading": "Résultats",
	"dashboard:resultsReturned": "Utilisateurs trouvés dans les résultats.",
	"dashboard:overdueAssignments": "Des utilisateurs ont actuellement un ou plusieurs travaux en retard.",
	"dashboard:overdueAssignmentsHeading": "Travaux en retard",
	"dashboard:coursesInViewHeader": "Cours affichés",
	"coursesInView:CoursesReturned": "cours trouvés dans les résultats.",
	"dashboard:lastSystemAccessMessage": "Utilisateurs qui n’ont pas accédé au système dans les {thresholdDays} jours.",
	"dashboard:lastSystemAccessMessageOneDay": "Utilisateurs qui n’ont pas accédé au système dans le dernier jour.",
	"dashboard:lastSystemAccessHeading": "Accès au système",
	"dashboard:tooManyResults": "Il y a trop de résultats dans vos filtres. Veuillez préciser votre sélection.",
	"dashboard:learMore": "En savoir plus",
	"dashboard:exportToCsv": "Exporter vers un fichier CSV",
	"dashboard:saveDefaultView": "Faire de cet affichage ma vue par défaut",
	"dashboard:emailButtonAriaLabel": "Actions du tableau. Envoyer un courriel aux utilisateurs sélectionnés dans une nouvelle fenêtre",
	"dashboard:emailButton": "Courriel",
	"dashboard:print": "Imprimer",
	"dashboard:noUsersSelectedDialogText": "Veuillez sélectionner un ou plusieurs utilisateurs à qui envoyer un courriel.",
	"dashboard:noResultsAvailable": "Aucun résultat ne correspond à vos filtres.",
	"dashboard:queryFailed": "Impossible de charger vos résultats. Si le problème persiste, veuillez",
	"dashboard:queryFailedLink": "communiquer avec l’équipe de soutien de D2L.",
	"dashboard:undoLastAction": "Annuler la dernière action",

	"settings:roleListTitle": "Filtre des rôles",
	"settings:roleListDescription": "Définissez les rôles de l’élève à inclure dans les données de votre tableau de bord. Tous les autres rôles ne seront pas inclus dans le filtre.",

	"orgUnitFilter:nameAllSelected": "Unités organisationnelles : toutes",
	"orgUnitFilter:nameSomeSelected": "Unités organisationnelles : choix appliqués",

	"semesterFilter:name": "Semestre",
	"semesterFilter:semesterName": "{orgUnitName} (ID : {orgUnitId})",

	"simpleFilter:searchLabel": "Rechercher",
	"simpleFilter:searchPlaceholder": "Recherche…",
	"simpleFilter:dropdownAction": "Ouvrir le filtre {name}",

	"treeFilter:nodeName": "{orgUnitName} (ID : {id})",
	"treeFilter:nodeName:root": "Racine",
	"treeSelector:filterBy": "Filtrer par",
	"treeSelector:clearLabel": "Effacer",
	"treeSelector:searchLabel": "Rechercher",
	"treeSelector:loadMoreLabel": "En voir plus",
	"treeSelector:parentLoadMore:ariaLabel": "Charger plus d’unités organisationnelles enfants",
	"treeSelector:searchLoadMore:ariaLabel": "Charger plus de résultats de la recherche",
	"treeSelector:searchPlaceholder": "Recherche…",
	"treeSelector:dropdownAction": "Ouvrir le filtre {name}",
	"treeSelector:arrowLabel:closed": "Développer {name} au niveau {level}, enfant de {parentName}",
	"treeSelector:arrowLabel:open": "Réduire {name} au niveau {level}, enfant de {parentName}",
	"treeSelector:node:ariaLabel": "{name}, enfant de {parentName},",

	"dropdownFilter:loadMore": "En voir plus",
	"dropdownFilter:openerTextAll": "{filterName} : Tout",
	"dropdownFilter:openerTextMultiple": "{filterName}: {selectedCount} sélectionné(s)",
	"dropdownFilter:openerTextSingle": '{filterName} : {selectedItemName}',

	"usersTable:title": "Tableau de détails sur l’utilisateur Ce tableau présente la liste des utilisateurs qui correspondent aux critères de filtrage. Les actions pouvant être appliquées à plus d’un élément sont disponibles dans les actions du tableau.",
	"usersTable:loadingPlaceholder": "Chargement en cours",
	"usersTable:lastFirstName": "Nom",
	"usersTable:openUserPage": "Ouvrez la page de l’utilisateur pour {userName}",
	"usersTable:lastAccessedSystem": "Dernier accès au système",
	"usersTable:courses": "Cours",
	"usersTable:avgGrade": "Note d’appréciation moyenne",
	"usersTable:avgTimeInContent": "Temps moyen passé sur le contenu (minutes)",
	"usersTable:avgDiscussionActivity": "Activité de discussion moyenne",
	"usersTable:totalUsers": "Total des utilisateurs : {num}",
	"usersTable:lastAccessedSys" : "Dernier accès au système",
	"usersTable:null" : "NULL",
	"usersTable:selectorAriaLabel": "Sélectionner {userLastFirstName}",
	"usersTable:noGrades": "Aucune note",

	"table:selectAll": "Tout sélectionner",

	"usersTableExport:lastName": "Nom de famille",
	"usersTableExport:FirstName": "Prénom",
	"usersTableExport:UserName": "Nom d’utilisateur",
	"usersTableExport:UserID": "ID d’utilisateur",

	"summaryCard:label": "{value} {message}",

	"timeInContentVsGradeCard:timeInContentVsGrade": "Temps passé sur le contenu comparativement à la note d’appréciation",
	"timeInContentVsGradeCard:currentGrade": "Note d’appréciation actuelle (%)",
	"timeInContentVsGradeCard:averageGrade": "La moyenne des inscriptions sélectionnées est de {avgGrade} pour cent",
	"timeInContentVsGradeCard:timeInContentLong": "Temps passé sur le contenu (minutes)",
	"timeInContentVsGradeCard:averageTimeInContent": "La moyenne des inscriptions sélectionnées est de {avgTimeInContent} minutes",
	"timeInContentVsGradeCard:leftTop": "{numberOfUsers} utilisateurs inscrits reçoivent une note d’appréciation au-dessus de la moyenne et passent moins de temps que la moyenne sur le contenu.",
	"timeInContentVsGradeCard:rightTop": "{numberOfUsers} utilisateurs inscrits reçoivent une note d’appréciation au-dessus de la moyenne et passent plus de temps que la moyenne sur le contenu.",
	"timeInContentVsGradeCard:leftBottom": "{numberOfUsers} utilisateurs inscrits reçoivent une note d’appréciation sous la moyenne et passent moins de temps que la moyenne sur le contenu.",
	"timeInContentVsGradeCard:rightBottom": "{numberOfUsers} utilisateurs inscrits reçoivent une note d’appréciation sous la moyenne et passent plus de temps que la moyenne sur le contenu.",

	"currentFinalGradeCard:currentGrade": "Note d’appréciation actuelle",
	"currentFinalGradeCard:numberOfStudents": "Nombre d’utilisateurs",
	"currentFinalGradeCard:xAxisLabel": "Note d’appréciation actuelle (%)",
	"currentFinalGradeCard:textLabel": "Ce graphique affiche la note d’appréciation finale actuelle de chaque utilisateur par cours",
	"currentFinalGradeCard:emptyMessage": "Aucun résultat ne correspond à vos filtres.",
	"currentFinalGradeCard:gradeBetween": "{numberOfUsers} utilisateurs ont une note d’appréciation actuelle entre {range} %",
	"currentFinalGradeCard:gradeBetweenSingleUser": "1 utilisateur a une note d’appréciation actuelle entre {range} %",

	"courseLastAccessCard:courseAccess": "Accès aux cours",
	"courseLastAccessCard:numberOfUsers": "Nombre d’utilisateurs",
	"courseLastAccessCard:textLabel": "Ce graphique affiche la note d’appréciation finale actuelle de chaque utilisateur par cours",
	"courseLastAccessCard:lastDateSinceAccess": "Dernière fois qu’un utilisateur a accédé à un cours",
	"courseLastAccessCard:never": "Jamais",
	"courseLastAccessCard:moreThanFourteenDaysAgo": "Il y a plus de 14 jours",
	"courseLastAccessCard:sevenToFourteenDaysAgo": "Il y a 7 à 14 jours",
	"courseLastAccessCard:fiveToSevenDaysAgo": "Il y a 5 à 7 jours",
	"courseLastAccessCard:threeToFiveDaysAgo": "Il y a 3 à 5 jours",
	"courseLastAccessCard:oneToThreeDaysAgo": "Il y a 1 à 3 jours",
	"courseLastAccessCard:lessThanOneDayAgo": "Il y a moins de 1 jour",
	"courseLastAccessCard:accessibilityLessThanOne": "Il y a moins de 1 jour",
	"courseLastAccessCard:tooltipNeverAccessed": "{numberOfUsers} utilisateurs n’ont jamais accédé au cours",
	"courseLastAccessCard:tooltipMoreThanFourteenDays": "{numberOfUsers} utilisateurs ont accédé au cours il y a plus de 14 jours",
	"courseLastAccessCard:toolTipSevenToFourteenDays": "{numberOfUsers} utilisateurs ont accédé au cours il y a de 7 à 14 jours",
	"courseLastAccessCard:toolTipFiveToSevenDays": "{numberOfUsers} utilisateurs ont accédé au cours il y a de 5 à 7 jours",
	"courseLastAccessCard:toolTipThreeToFiveDays": "{numberOfUsers} utilisateurs ont accédé au cours il y a de 3 à 5 jours",
	"courseLastAccessCard:toolTipOneToThreeDays": "{numberOfUsers} utilisateurs ont accédé au cours il y a de 1 à 3 jours",
	"courseLastAccessCard:toolTipLessThanOneDay": "{numberOfUsers} utilisateurs ont accédé au cours il y a moins de 1 jour",
	"courseLastAccessCard:tooltipNeverAccessedSingleUser": "1 utilisateur n’a jamais accédé au cours",
	"courseLastAccessCard:tooltipMoreThanFourteenDaysSingleUser": "1 utilisateur a accédé au cours il y a plus de 14 jours",
	"courseLastAccessCard:toolTipSevenToFourteenDaysSingleUser": "1 utilisateur a accédé au cours il y a de 7 à 14 jours",
	"courseLastAccessCard:toolTipFiveToSevenDaysSingleUser": "1 utilisateur a accédé au cours il y a de 5 à 7 jours",
	"courseLastAccessCard:toolTipThreeToFiveDaysSingleUser": "1 utilisateur a accédé au cours il y a de 3 à 5 jours",
	"courseLastAccessCard:toolTipOneToThreeDaysSingleUser": "1 utilisateur a accédé au cours il y a de 1 à 3 jours",
	"courseLastAccessCard:toolTipLessThanOneDaySingleUser": "1 utilisateur a accédé au cours il y a moins de 1 jour",

	"discussionActivityCard:cardTitle": "Activité relative à la discussion",
	"discussionActivityCard:threads": "Fils de discussion",
	"discussionActivityCard:replies": "Réponses",
	"discussionActivityCard:reads": "Lectures",
	"discussionActivityCard:textLabel": "Ce graphique affiche le nombre total de fils de discussion, de réponses et de lectures dans les forums de discussion pour tous les utilisateurs des cours sélectionnés",
	"discussionActivityCard:toolTipThreads": "{numberOfUsers} fils de discussion ont été créés par les utilisateurs renvoyés",
	"discussionActivityCard:toolTipReplies": "{numberOfUsers} publications ont reçu une réponse des utilisateurs renvoyés",
	"discussionActivityCard:toolTipReads": "{numberOfUsers} publications ont été lues par les utilisateurs renvoyés",
	"discussionActivityCard:legendItem": "Basculer vers {itemName}",
	"discussionActivityCard:legendLabel": "Faire basculer le filtrage",

	"appliedFilters:clearAll": "Effacer tout",
	"appliedFilters:labelText": "Est affiché uniquement :",

	"ariaLoadingProgress:loadingStart": "Chargement en cours",
	"ariaLoadingProgress:loadingFinish": "Le chargement est terminé",

	"defaultViewPopup:title": "Affichage par défaut du tableau de bord de l’engagement",
	"defaultViewPopup:resultsFromNRecentCourses": "Ce tableau de bord est conçu de façon à vous permettre de consulter des portions de l’engagement de votre organisation. Les résultats affichés proviennent de {numDefaultCourses} cours récemment accédés pour vous permettre de commencer.",
	"defaultViewPopup:promptUseFilters": "Utilisez les filtres du tableau de bord pour changer les résultats affichés.",
	"defaultViewPopup:emptyResultsFromNRecentSemesters": "Ce tableau de bord est conçu de façon à vous permettre de consulter des portions de l’engagement de votre organisation. Vous n’êtes pas autorisé à examiner les données dans les cours dans les {numDefaultSemesters} semestres créés le plus récemment.",
	"defaultViewPopup:expandDefaultCourseList": "Développer la liste pour voir les cours inclus dans votre affichage par défaut",
	"defaultViewPopup:collapseDefaultCourseList": "Réduire la liste de cours de votre affichage par défaut",
	"defaultViewPopup:buttonOk": "OK",

	"settings:title": "Réglages",
	"settings:description": "Définissez les mesures qui s’affichent dans la section Sommaire et les détails des résultats du tableau de bord Engagement.",
	"settings:tabTitleSummaryMetrics": "Résumé des mesures",
	"settings:tabTitleResultsTableMetrics": "Mesures du tableau des résultats",
	"settings:saveAndClose": "Enregistrer et fermer",
	"settings:save": "Enregistrer",
	"settings:cancel": "Annuler",

	"settings:currentGradeDesc": "La carte de note d’appréciation actuelle affiche la note d’appréciation actuelle pour chaque cours filtré auquel l’utilisateur est inscrit.",
	"settings:courseAccessDesc": "La carte d’accès au cours affiche le dernier accès d’un cours pour chaque inscription par utilisateur pour les cours qui sont filtrés.",
	"settings:ticVsGradeDesc": "La carte Temps passé sur le contenu par rapport à la carte de note d’appréciation indique le temps total passé dans un cours par rapport à la note d’appréciation actuelle pour chaque utilisateur inscrit pour les cours qui sont filtrés. Le graphique est divisé en quadrants en fonction de la note d’appréciation moyenne ou du temps passé pour les utilisateurs affichés.",
	"settings:overdueAssignmentsDesc": "La carte Travaux en retard indique le nombre d’utilisateurs dont un ou plusieurs travaux sont en retard dans les cours qui sont filtrés.",
	"settings:systemAccessDesc": "La carte Accès au système indique la dernière fois que l’utilisateur a accédé au système.",
	"settings:discActivityDesc": "La carte activité relative à la discussion indique l’engagement social passif et actif dans chaque cours qui est filtré. Cette mesure indique lorsqu’un utilisateur crée un fil de discussion, répond à un message existant ou lit un message.",

	"settings:systemAccessEdit": "Afficher les utilisateurs qui n’ont pas accédé au système au cours des {num} derniers jours.",
	"settings:systemAccessEditLabel": "Modifier le seuil d’accès au système",

	"settings:avgGrade": "Note d’appréciation moyenne",
	"settings:avgTimeInContent": "Temps moyen passé sur le contenu",
	"settings:avgDiscussionActivity": "Participation moyenne aux discussions",
	"settings:lastAccessedSystem": "Dernier accès au système",
	"settings:avgGradeDescription": "L’indicateur de note d’appréciation moyenne présente la note d’appréciation moyenne actuelle de l’utilisateur pour tous les cours inclus dans les filtres appliqués.",
	"settings:avgTimeInContentDescription": "L’indicateur de temps moyen passé sur le contenu indique le temps moyen passé sur le contenu par l’utilisateur, par l’intermédiaire de la moyenne du temps total par cours, dans tous les cours inclus dans les filtres appliqués. Cette mesure est indiquée en minutes.",
	"settings:avgDiscussionActivityDescription": "L’indicateur de participation moyenne aux discussions présente les statistiques d’utilisateur sur la fréquence à laquelle celui-ci crée un fil de discussion, lit un message ou répond à un message dans tous les cours inclus dans les filtres appliqués. Cette mesure représente la moyenne d’occurences totales par cours.",
	"settings:lastAccessedSystemDescription": "L’indicateur Dernier accès au système affiche l’horodatage, à l’heure locale de Brightspace, de la dernière fois que l’utilisateur a accédé au système de quelque façon que ce soit.",
	"settings:invalidSystemAccessValueToast": "Vos réglages n’ont pu être enregistrés. Les seuils d’accès au système doivent se situer entre 1 et 30.",
	"settings:serverSideErrorToast": "Un problème est survenu. Vos réglages n’ont pu être enregistrés.",

	"userDrill:noUser": "Cet utilisateur n’a pu être chargé. Accédez au tableau de bord Engagement pour afficher la liste des utilisateurs.",
	"userDrill:noData": "Aucune donnée dans les plages filtrées. Affinez votre sélection.",
	"userDrill:manyCoursesAlert": "Ce tableau de bord est plus utile lorsque moins de 10 cours sont affichés. Pour une expérience optimale, veuillez affiner votre sélection de cours.",
	"userDrill:summaryView": "Vue Sommaire",
	"activeCoursesTable:title": "Cours actifs",
	"activeCoursesTable:loadingPlaceholder": "Chargement en cours",
	"activeCoursesTable:course": "Nom de cours",
	"activeCoursesTable:currentGrade": "Note d’appréciation actuelle",
	"activeCoursesTable:grade": "Note d’appréciation",
	"activeCoursesTable:predictedGrade": "Note d’appréciation prédite",
	"activeCoursesTable:timeInContent": "Temps passé sur le contenu (minutes)",
	"activeCoursesTable:discussions": "Activité relative à la discussion",
	"activeCoursesTable:courseLastAccess": "Dernier accès au cours",
	"activeCoursesTable:noGrade": "Aucune note d’appréciation",
	"activeCoursesTable:noPredictedGrade": "Aucune note d’appréciation prédite",
	"activeCoursesTable:isActive": "Est un cours actif",
	"activeCoursesTable:empty": "Aucune donnée de cours actif dans les plages filtrées.",

	"inactiveCoursesTable:title": "Cours inactifs",
	"inactiveCoursesTable:course": "Nom de cours",
	"inactiveCoursesTable:grade": "Note finale",
	"inactiveCoursesTable:content": "Temps total passé sur le contenu (minutes)",
	"inactiveCoursesTable:discussions": "Activité relative à la discussion",
	"inactiveCoursesTable:lastAccessedCourse": "Dernier accès au cours",
	"inactiveCoursesTable:loadingPlaceholder": "Chargement en cours",
	"inactiveCoursesTable:semester": "Semestre",
	"inactiveCoursesTable:empty": "Aucune donnée de cours inactif dans les plages filtrées.",

	"accessTrendCard:title": "Accès aux cours au fil du temps",
	"accessTrendCard:xAxisTitle": "Date",
	"accessTrendCard:yAxisTitle": "Nombre d'accès au cours",

	"userOverdueAssignmentsCard:assignmentsCurrentlyOverdue": "affectations sont actuellement en retard.",
	"averageGradeSummaryCard:averageGradeText" : "note d'appréciation moyenne des cours affichés.",
	"averageGradeSummaryCard:averageGrade" : "Note d'appréciation moyenne",
	"averageGradeSummaryCard:noGradeInfoAvailable" : "Aucune information disponible concernant la note d'appréciation.",
	"userSysAccessCard:daysSinceLearnerHasLastAccessedSystem": "jours depuis la dernière fois que l'élève a accédé au système.",
	"userSysAccessCard:userHasNeverAccessedSystem": "L'utilisateur n'a jamais accédé au système.",

	"coursesLegend:coursesLegendFilter": "Cours",

	"contentViewsCard:contentViewOverTime": "Affichage du contenu au fil du temps",
	"contentViewsCard:viewCount": "Nombre de consultations",
	"contentViewsCard:date": "Date",

	"gradesTrendCard:date": "Date",
	"gradesTrendCard:gradesOverTime": "Note d'appréciation au fil du temps",
	"gradesTrendCard:currentGrade": "Note d'appréciation actuelle (%)",

	"chart:loading": "Chargement…",
	"chart:decimalPoint": ".",
	"chart:resetZoom": "Réinitialiser le zoom",
	"chart:resetZoomTitle": "Reset zoom level 1:1",
	"chart:thousandsSeparator": " ",
};
