/* eslint quotes: 0 */

export default {
	"dashboard:title": "Tableau de bord d’engagement",
	"dashboard:userView:title": "Tableau de bord d’engagement de l’apprenant",
	"dashboard:backToInsightsPortal": "Retour à Insights Portal",
	"dashboard:backToEngagementDashboard": "Retour au tableau de bord d’engagement",
	"dashboard:backLinkTextShort": "Retour",
	"dashboard:summaryHeading": "Vue résumée",
	"dashboard:resultsHeading": "Résultats",
	"dashboard:resultsReturned": "Utilisateurs obtenus dans les résultats.",
	"dashboard:overdueAssignments": "Les utilisateurs ont actuellement un ou plusieurs devoirs en retard.",
	"dashboard:overdueAssignmentsHeading": "Devoirs en retard",
	"dashboard:coursesInViewHeader": "Cours affichés",
	"coursesInView:CoursesReturned": "cours obtenus dans les résultats.",
	"dashboard:lastSystemAccessMessage": "Les utilisateurs n’ont pas accédé au système au cours des {thresholdDays} derniers jours.",
	"dashboard:lastSystemAccessMessageOneDay": "Les utilisateurs n’ont pas accédé au système au cours des derniers jours.",
	"dashboard:lastSystemAccessHeading": "Accès au système",
	"dashboard:tooManyResults": "Vos filtres renvoient trop de résultats. Veuillez affiner votre sélection.",
	"dashboard:learMore": "Plus d’informations",
	"dashboard:exportToCsv": "Exporter en CSV",
	"dashboard:saveDefaultView": "Définir cette vue comme vue par défaut",
	"dashboard:emailButtonAriaLabel": "Actions de tableau. Envoyer un e-mail aux utilisateurs sélectionnés dans une nouvelle fenêtre",
	"dashboard:emailButton": "E-mail",
	"dashboard:print": "Imprimer",
	"dashboard:noUsersSelectedDialogText": "Veuillez sélectionner un ou plusieurs utilisateurs auxquels envoyer l’e-mail.",
	"dashboard:noResultsAvailable": "Aucun résultat ne correspond aux filtres sélectionnés.",
	"dashboard:queryFailed": "Impossible de télécharger vos résultats. Si le problème persiste,",
	"dashboard:queryFailedLink": "contactez le service d’assistance de Desire2Learn.",
	"dashboard:undoLastAction": "Annuler la dernière action",

	"settings:roleListTitle": "Filtre des rôles",
	"settings:roleListDescription": "Définissez les rôles des apprenants à inclure dans les données de votre tableau de bord. Tous les autres rôles seront éliminés du filtrage.",

	"orgUnitFilter:nameAllSelected": "Unité organisationnelle : toutes",
	"orgUnitFilter:nameSomeSelected": "Unité organisationnelle : sélections appliquées",
	"orgUnitFilter:name": "Unité organisationnelle",

	"semesterFilter:name": "Semestre",
	"semesterFilter:semesterName": "{orgUnitName} (Identifiant : {orgUnitId})",

	"simpleFilter:searchLabel": "Rechercher",
	"simpleFilter:searchPlaceholder": "Rechercher...",
	"simpleFilter:dropdownAction": "Ouvrir le filtre {name}",

	"treeFilter:nodeName": "{orgUnitName} (Identifiant : {id})",
	"treeFilter:nodeName:root": "racine",
	"treeSelector:filterBy": "Filtrer par",
	"treeSelector:clearLabel": "Effacer",
	"treeSelector:searchLabel": "Rechercher",
	"treeSelector:loadMoreLabel": "Télécharger plus",
	"treeSelector:parentLoadMore:ariaLabel": "Charger plus d’unités organisationnelles secondaires",
	"treeSelector:searchLoadMore:ariaLabel": "Charger plus de résultats de recherche",
	"treeSelector:searchPlaceholder": "Rechercher...",
	"treeSelector:dropdownAction": "Ouvrir le filtre {name}",
	"treeSelector:arrowLabel:closed": "Développer {name} au niveau {level}, nœud secondaire de {parentName}",
	"treeSelector:arrowLabel:open": "Réduire {name} au niveau {level}, nœud secondaire de {parentName}",
	"treeSelector:node:ariaLabel": "{name}, nœud secondaire de {parentName},",

	"dropdownFilter:loadMore": "Télécharger plus",
	"dropdownFilter:openerTextAll": "{filterName} : tout",
	"dropdownFilter:openerTextMultiple": "{filterName} : {selectedCount} sélectionné(s)",
	"dropdownFilter:openerTextSingle": '{filterName} : {selectedItemName}',

	"usersTable:title": "Tableau Détails de l’utilisateur. Ce tableau présente la liste des utilisateurs qui correspondent aux critères de filtrage. Les actions qui peuvent être appliquées à plusieurs éléments sont disponibles dans les actions de tableau.",
	"usersTable:loadingPlaceholder": "Chargement en cours",
	"usersTable:lastFirstName": "Nom",
	"usersTable:openUserPage": "Ouvrir la page de l’utilisateur pour {userName}",
	"usersTable:lastAccessedSystem": "Dernier accès au système",
	"usersTable:courses": "Cours",
	"usersTable:avgGrade": "Note moyenne",
	"usersTable:avgTimeInContent": "Temps moyen passé sur le contenu (en minutes)",
	"usersTable:avgDiscussionActivity": "Activité moyenne de discussion",
	"usersTable:totalUsers": "Total des utilisateurs : {num}",
	"usersTable:lastAccessedSys" : "Dernier accès au système",
	"usersTable:null" : "NUL",
	"usersTable:selectorAriaLabel": "Sélectionnez {userLastFirstName}",
	"usersTable:noGrades": "Aucune note",

	"table:selectAll": "Tout sélectionner",

	"usersTableExport:lastName": "Nom de famille",
	"usersTableExport:FirstName": "Prénom",
	"usersTableExport:UserName": "Nom d’utilisateur",
	"usersTableExport:UserID": "ID d’utilisateur",

	"summaryCard:label": "{value} {message}",

	"timeInContentVsGradeCard:timeInContentVsGrade": "Temps passé dans le contenu par rapport à la note",
	"timeInContentVsGradeCard:currentGrade": "Note actuelle (%)",
	"timeInContentVsGradeCard:averageGrade": "La moyenne des inscriptions sélectionnées est de {avgGrade} pour cent",
	"timeInContentVsGradeCard:timeInContentLong": "Temps passé sur le contenu (en minutes)",
	"timeInContentVsGradeCard:averageTimeInContent": "La moyenne des inscriptions sélectionnées est de {avgTimeInContent} minutes",
	"timeInContentVsGradeCard:leftTop": "{numberOfUsers} utilisateurs inscrits obtiennent une note supérieure à la moyenne et passent moins de temps que la moyenne sur le contenu.",
	"timeInContentVsGradeCard:rightTop": "{numberOfUsers} utilisateurs inscrits obtiennent une note supérieure à la moyenne et passent plus de temps que la moyenne sur le contenu.",
	"timeInContentVsGradeCard:leftBottom": "{numberOfUsers} utilisateurs inscrits obtiennent une note inférieure à la moyenne et passent moins de temps que la moyenne sur le contenu.",
	"timeInContentVsGradeCard:rightBottom": "{numberOfUsers} utilisateurs inscrits obtiennent une note inférieure à la moyenne et passent plus de temps que la moyenne sur le contenu.",
	"timeInContentVsGradeCard:highTimeHighGrade": "temps élevé passé dans le contenu et note élevée",
	"timeInContentVsGradeCard:highTimeLowGrade": "temps élevé passé dans le contenu et note basse",
	"timeInContentVsGradeCard:lowTimeHighGrade": "peu de temps passé dans le contenu et note élevée",
	"timeInContentVsGradeCard:lowTimeLowGrade": "peu de temps passé dans le contenu et note basse",

	"currentFinalGradeCard:currentGrade": "Note actuelle",
	"currentFinalGradeCard:numberOfStudents": "Nombre d’utilisateurs",
	"currentFinalGradeCard:xAxisLabel": "Note actuelle (%)",
	"currentFinalGradeCard:textLabel": "Ce tableau affiche la note finale actuelle pour chaque utilisateur par cours",
	"currentFinalGradeCard:emptyMessage": "Aucun résultat ne correspond aux filtres sélectionnés.",
	"currentFinalGradeCard:gradeBetween": "{numberOfUsers} utilisateurs ont une note actuelle comprise entre {range}%",
	"currentFinalGradeCard:gradeBetweenSingleUser": "1 utilisateur a une note actuelle comprise entre {range}%",

	"courseLastAccessCard:courseAccess": "Accès au cours",
	"courseLastAccessCard:numberOfUsers": "Nombre d’utilisateurs",
	"courseLastAccessCard:textLabel": "Ce tableau affiche la note finale actuelle pour chaque utilisateur par cours",
	"courseLastAccessCard:lastDateSinceAccess": "Dernière date à laquelle un utilisateur a accédé à un cours",
	"courseLastAccessCard:never": "Jamais",
	"courseLastAccessCard:moreThanFourteenDaysAgo": "Il y a plus de 14 jours",
	"courseLastAccessCard:sevenToFourteenDaysAgo": "Il y a 7 à 14 jours",
	"courseLastAccessCard:fiveToSevenDaysAgo": "Il y a 5 à 7 jours",
	"courseLastAccessCard:threeToFiveDaysAgo": "Il y a 3 à 5 jours",
	"courseLastAccessCard:oneToThreeDaysAgo": "Il y a 1 à 3 jours",
	"courseLastAccessCard:lessThanOneDayAgo": "Il y a moins de 1 jour",
	"courseLastAccessCard:accessibilityLessThanOne": "Il y a moins de1 jour",
	"courseLastAccessCard:accessibilityMoreThanFourteenDaysAgo": "Il y a plus de 14 jours",
	"courseLastAccessCard:tooltipNeverAccessed": "{numberOfUsers} utilisateurs n’ont jamais accédé au cours.",
	"courseLastAccessCard:tooltipMoreThanFourteenDays": "{numberOfUsers} utilisateurs ont accédé au cours pour la dernière fois il y a plus de 14 jours.",
	"courseLastAccessCard:toolTipSevenToFourteenDays": "{numberOfUsers} utilisateurs ont accédé au cours pour la dernière fois il y a 7 à 14 jours.",
	"courseLastAccessCard:toolTipFiveToSevenDays": "{numberOfUsers} utilisateurs ont accédé au cours pour la dernière fois il y a 5 à 7 jours.",
	"courseLastAccessCard:toolTipThreeToFiveDays": "{numberOfUsers} utilisateurs ont accédé au cours pour la dernière fois il y a 3 à 5 jours.",
	"courseLastAccessCard:toolTipOneToThreeDays": "{numberOfUsers} utilisateurs ont accédé au cours pour la dernière fois il y a 1 à 3 jours.",
	"courseLastAccessCard:toolTipLessThanOneDay": "{numberOfUsers} utilisateurs ont accédé au cours pour la dernière fois il y a moins de 1 jour.",
	"courseLastAccessCard:tooltipNeverAccessedSingleUser": "1 utilisateur n’a jamais accédé au cours.",
	"courseLastAccessCard:tooltipMoreThanFourteenDaysSingleUser": "1 utilisateur a accédé au cours pour la dernière fois il y a plus de 14 jours.",
	"courseLastAccessCard:toolTipSevenToFourteenDaysSingleUser": "1 utilisateur a accédé au cours pour la dernière fois il y a 7 à 14 jours.",
	"courseLastAccessCard:toolTipFiveToSevenDaysSingleUser": "1 utilisateur a accédé au cours pour la dernière fois il y a 5 à 7 jours.",
	"courseLastAccessCard:toolTipThreeToFiveDaysSingleUser": "1 utilisateur a accédé au cours pour la dernière fois il y a 3 à 5 jours.",
	"courseLastAccessCard:toolTipOneToThreeDaysSingleUser": "1 utilisateur a accédé au cours pour la dernière fois il y a 1 à 3 jours.",
	"courseLastAccessCard:toolTipLessThanOneDaySingleUser": "1 utilisateur a accédé au cours pour la dernière fois il y a moins de 1 jour.",

	"contentViewHistogram:title": "Vue de contenu",
	"contentViewHistogram:textLabel": "Ce graphique affiche le nombre total de vues de contenu pour tous les utilisateurs des cours sélectionnés",
	"contentViewHistogram:contentViews": "Nombre de vues de sujets de contenu",
	"contentViewHistogram:userCount": "Nombre d’utilisateurs",
	"contentViewHistogram:usersInRange": "{numUsers} utilisateurs ont accédé au contenu {start} à {end} fois",
	"contentViewHistogram:userInRange": "1 utilisateur a accédé au contenu {start} à {end} fois",
	"contentViewHistogram:usersZeroTimes": "{numUsers} utilisateurs ont accédé au contenu 0 fois",
	"contentViewHistogram:userZeroTimes": "1 utilisateur a accédé au contenu 0 fois",
	"contentViewHistogram:usersGreaterTimes": "{numUsers} utilisateurs ont accédé au contenu plus de {start} fois",
	"contentViewHistogram:userGreaterTimes": "1 utilisateur a accédé au contenu plus de {start} fois",

	"discussionActivityCard:cardTitle": "Activité de discussions",
	"discussionActivityCard:threads": "Fils de discussion",
	"discussionActivityCard:replies": "Réponses",
	"discussionActivityCard:reads": "Lectures",
	"discussionActivityCard:textLabel": "Ce graphique affiche le nombre total de fils de discussion, de réponses et de lectures dans les forums de discussion, pour tous les utilisateurs des cours sélectionnés",
	"discussionActivityCard:toolTipThreads": "{numberOfUsers} fils de discussion ont été créés par les utilisateurs renvoyés",
	"discussionActivityCard:toolTipReplies": "{numberOfUsers} messages ont reçu une réponse des utilisateurs renvoyés",
	"discussionActivityCard:toolTipReads": "{numberOfUsers} publications ont été lues par les utilisateurs renvoyés",
	"discussionActivityCard:legendItem": "Activer/désactiver {itemName}",
	"discussionActivityCard:legendLabel": "Activer/désactiver le filtrage",

	"appliedFilters:clearAll": "Tout effacer",
	"appliedFilters:labelText": "Affiche uniquement :",

	"ariaLoadingProgress:loadingStart": "Chargement en cours.",
	"ariaLoadingProgress:loadingFinish": "Chargement terminé.",

	"defaultViewPopup:title": "Vue par défaut du tableau de bord d’engagement",
	"defaultViewPopup:resultsFromNRecentCourses": "Ce tableau de bord est conçu pour examiner certaines parties de l’engagement de votre organisation. Les résultats affichés proviennent de {numDefaultcourses} cours récemment consultés pour vous aider.",
	"defaultViewPopup:promptUseFilters": "Utilisez les filtres du tableau de bord pour modifier les résultats affichés.",
	"defaultViewPopup:emptyResultsFromNRecentSemesters": "Ce tableau de bord est conçu pour examiner certaines parties de l’engagement de votre organisation. Vous n’êtes pas autorisé à consulter les données d’un cours dans les semestres {numDefaultSemesters} les plus récemment créés.",
	"defaultViewPopup:expandDefaultCourseList": "Développer pour afficher les cours inclus dans votre vue par défaut",
	"defaultViewPopup:collapseDefaultCourseList": "Réduire la liste des cours inclus dans votre vue par défaut",
	"defaultViewPopup:buttonOk": "OK",

	"settings:title": "Paramètres",
	"settings:description": "Définissez les mesures qui s’affichent dans la section Résumé et détail des résultats du tableau de bord de l’engagement.",
	"settings:tabTitleSummaryMetrics": "Mesures récapitulatives",
	"settings:tabTitleResultsTableMetrics": "Métriques du tableau des résultats",
	"settings:tabTitleUserLevelMetrics": "Mesures du niveau de l’utilisateur",
	"settings:saveAndClose": "Enregistrer et fermer",
	"settings:save": "Enregistrer",
	"settings:cancel": "Annuler",

	"settings:currentGradeDesc": "La carte Note actuelle indique la note actuelle pour chaque inscription de l’utilisateur pour les cours filtrés.",
	"settings:courseAccessDesc": "La carte Accès aux cours indique le dernier accès à un cours pour chaque inscription de l’utilisateur pour les cours filtrés.",
	"settings:ticVsGradeDesc": "La carte Temps passé sur le contenu par rapport à la note indique le temps total passé sur un cours par rapport à la note actuelle pour chaque inscription de l’utilisateur pour les cours filtrés. Le graphique est divisé en quadrants en fonction de la note moyenne ou du temps passé par les utilisateurs dans la vue.",
	"settings:overdueAssignmentsDesc": "La carte Devoirs en retard indique le nombre d’utilisateurs qui ont un ou plusieurs devoirs en retard dans les cours filtrés.",
	"settings:systemAccessDesc": "La carte Accès au système affiche le dernier accès de l’utilisateur.",
	"settings:discActivityDesc": "La carte Activité de discussion montre l’engagement social passif et actif dans chaque cours filtré. Cette mesure indique si l’utilisateur crée un fil de discussion, répond à un message ou lit un message.",
	"settings:contentViewDesc": "The Content View card shows how many content topics have been viewed for each enrollment per user.",

	"settings:systemAccessEdit": "Afficher les utilisateurs qui n’ont pas accédé au système au cours des {num} derniers jours.",
	"settings:systemAccessEditLabel": "Modifier le seuil d’accès au système",

	"settings:avgGrade": "Note moyenne",
	"settings:avgGradeSummary": "Résumé de note moyenne",
	"settings:avgTimeInContent": "Temps moyen passé sur le contenu",
	"settings:avgDiscussionActivity": "Participation moyenne aux discussions",
	"settings:lastAccessedSystem": "Dernier accès au système",
	"settings:predictedGrade": "Note prévue",
	"settings:avgGradeDescription": "L’indicateur Note moyenne présente la note moyenne actuelle de l’utilisateur pour tous les cours inclus dans les filtres appliqués.",
	"settings:avgTimeInContentDescription": "L’indicateur Temps moyen passé sur le contenu indique le temps moyen passé sur le contenu par l’utilisateur, sous forme de moyenne du temps total par cours, pour tous les cours inclus dans les filtres appliqués. Cette mesure est indiquée en minutes.",
	"settings:avgDiscussionActivityDescription": "L’indicateur Participation moyenne aux discussions offre des statistiques sur la fréquence à laquelle l’utilisateur crée un fil de discussion, lit un message ou répond à un message pour tous les cours inclus dans les filtres appliqués. Cette mesure correspond à la moyenne du total par cours.",
	"settings:lastAccessedSystemDescription": "L’indicateur Dernier accès au système affiche l’horodatage, selon l’heure locale de Brightspace, de la dernière fois que l’utilisateur a accédé au système.",
	"settings:predictedGradeDescription": "L’indicateur Note prévue présente la note finale moyenne prévue pour l’utilisateur pour tous les cours inclus dans les filtres appliqués. Les données de cette mesure sont produites à partir du Student Success System.",
	"settings:invalidSystemAccessValueToast": "Vos paramètres n’ont pas pu être sauvegardés. Les seuils d’accès au système doivent être compris entre 1 et 30.",
	"settings:serverSideErrorToast": "Un problème est survenu. Vos paramètres n’ont pas pu être sauvegardés.",

	"settings:avgGradeSummaryDescription": "La carte Résumé de note moyenne présente les notes moyennes actuelles de l’apprenant pour les cours filtrés.",
	"settings:gradesOverTimeDescription": "La carte Notes au fil du temps montre comment les notes de l’apprenant ont évolué dans le temps.",
	"settings:accessOverTimeDescription": "La carte Accès au cours au fil du temps montre comment la fréquence d’accès au cours de l’apprenant a évolué dans le temps.",
	"settings:contentViewsOverTimeDescription": "La carte Vues de contenu au fil du temps montre comment le nombre de consultations de contenu a évolué dans le temps.",

	"userDrill:noUser": "Impossible de télécharger cet utilisateur. Accédez au tableau de bord de l’engagement pour afficher la liste des utilisateurs.",
	"userDrill:noData": "Aucune donnée dans les plages filtrées. Affinez votre sélection.",
	"userDrill:manyCoursesAlert": "Ce tableau de bord est plus utile lorsque le nombre de cours est inférieur à 10. Affinez les cours que vous avez sélectionnés pour une meilleure expérience.",
	"userDrill:summaryView": "Vue résumée",
	"userDrill:course": "Cours",
	"activeCoursesTable:title": "Cours disponibles",
	"activeCoursesTable:loadingPlaceholder": "Chargement en cours",
	"activeCoursesTable:course": "Nom du cours",
	"activeCoursesTable:currentGrade": "Note actuelle",
	"activeCoursesTable:grade": "Note",
	"activeCoursesTable:predictedGrade": "Note prévue",
	"activeCoursesTable:timeInContent": "Temps passé dans le contenu (en minutes)",
	"activeCoursesTable:discussions": "Activité de discussions",
	"activeCoursesTable:courseLastAccess": "Dernier accès au cours",
	"activeCoursesTable:noGrade": "Aucune note",
	"activeCoursesTable:noPredictedGrade": "Pas de note prévue",
	"activeCoursesTable:isActive": "Est un cours disponible",
	"activeCoursesTable:empty": "Aucune donnée de cours disponible dans les plages filtrées.",

	"inactiveCoursesTable:title": "Cours inactifs",
	"inactiveCoursesTable:course": "Nom du cours",
	"inactiveCoursesTable:grade": "Note finale",
	"inactiveCoursesTable:content": "Total du temps passé sur le contenu (en minutes)",
	"inactiveCoursesTable:discussions": "Activité de discussions",
	"inactiveCoursesTable:lastAccessedCourse": "Dernier accès au cours",
	"inactiveCoursesTable:loadingPlaceholder": "Chargement en cours",
	"inactiveCoursesTable:semester": "Semestre",
	"inactiveCoursesTable:empty": "Aucune donnée de cours inactif dans les plages filtrées.",

	"accessTrendCard:title": "Accès au cours sur une période",
	"accessTrendCard:xAxisTitle": "Date",
	"accessTrendCard:yAxisTitle": "Nombre d’accès au cours",

	"userOverdueAssignmentsCard:assignmentsCurrentlyOverdue": "devoirs sont actuellement en retard.",
	"averageGradeSummaryCard:averageGradeText" : "note moyenne des cours affichés.",
	"averageGradeSummaryCard:averageGradeTextLine1" : "la moyenne des notes obtenues",
	"averageGradeSummaryCard:averageGradeTextLine2" : "dans les cours dans la vue.",
	"averageGradeSummaryCard:averageGrade" : "Note moyenne",
	"averageGradeSummaryCard:noGradeInfoAvailable" : "Aucune information sur les notes disponible.",
	"userSysAccessCard:daysSinceLearnerHasLastAccessedSystem": "jours depuis le dernier accès de l’apprenant au système.",
	"userSysAccessCard:userHasNeverAccessedSystem": "L’utilisateur n’a jamais accédé au système.",

	"coursesLegend:coursesLegendFilter": "Cours",

	"contentViewsCard:contentViewOverTime": "Consultations du contenu sur une période",
	"contentViewsCard:viewCount": "Nombre de vues",
	"contentViewsCard:date": "Date",

	"gradesTrendCard:date": "Date",
	"gradesTrendCard:gradesOverTime": "Notes sur une période",
	"gradesTrendCard:currentGrade": "Note actuelle (%)",

	"chart:loading": "Chargement en cours...",
	"chart:resetZoom": "Réinitialiser le zoom",
	"chart:resetZoomTitle": "Réinitialiser le zoom niveau 1:1",

	"alert:updatedFilter" : "Filtre {chartName} mis à jour.",
	"alert:axeDescriptionRange" : "Affichage des apprenants avec {chartName} dans ces catégories",
	"alert:axeDescription" : "Affichage des apprenants avec",
	"alert:axeNotFiltering" : "Filtrage par {chartName} arrêté.",
	// this "to" that, and this "to" that <- translate the word "to" in this context
	"alert:this-To-That" : "à",
	"alert:greaterThanThis" : "greater than {num}",
	"alert:axeDescriptionCourses" : "Affichage des données de l’apprenant dans ces cours",
	"alert:axeDescriptionCoursesOff" : "Affichage des données de l’apprenant dans tous les cours."
};
