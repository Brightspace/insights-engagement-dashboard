export const COURSE_OFFERING = 3;

export const RECORD = {
	ORG_UNIT_ID: 0,
	USER_ID: 1,
	ROLE_ID: 2,
	OVERDUE: 3,
	CURRENT_FINAL_GRADE: 4,
	TIME_IN_CONTENT: 5,
	COURSE_LAST_ACCESS: 6,
	DISCUSSION_ACTIVITY_THREADS: 7,
	DISCUSSION_ACTIVITY_REPLIES: 8,
	DISCUSSION_ACTIVITY_READS: 9,
	PREDICTED_GRADE: 10,
};
export const USER = {
	ID: 0,
	FIRST_NAME: 1,
	LAST_NAME: 2,
	USERNAME: 3,
	LAST_SYS_ACCESS: 4
};
export const ORG_UNIT = {
	ID: 0,
	NAME: 1,
	TYPE: 2,
	PARENTS: 3,
	IS_ACTIVE: 4
};

export const TiCVsGradesFilterId = 'd2l-insights-time-in-content-vs-grade-card';

export const USER_TREND_COLORS = [
	'#168FE6 ',
	'#8AD934',
	'#008EAB',
	'#E87511',
	'#9D1FD4',
	'#D40067',
	'#0057A3',
	'#8982FF',
	'#FFEF48',
	'#FF70B0',
	'#FFC102',
	'#E6ABFF',
	'#86509E',
	'#EE7030',
	'#D3E24A',
	'#2DE2C0',
	'#00B4D9',
	'#5D5BC0',
	'#F59036',
	'#99CB5F',
	'#5211FA',
	'#004489',
	'#00D2ED',
	'#00A490',
	'#2B8F44',
	'#8CDE8A',
	'#70FAE0',
	'#8FD1FF',
	'#2CBA9A',
	'#FF9EA0',
	'#FFDB8A',
	'#F5318F',
	'#E1FFB5',
	'#A7FAE7',
	'#C7FDFF',
	'#E9E6FF',
	'#6900A0',
	'#E9428D',
	'#FFE2DB',
	'#FFAB61',
];

export function* UserTrendColorsIterator(start = 0, step = 1, end = 40) {
	for (let i = start; i < end; i += step) {
		yield USER_TREND_COLORS[i % USER_TREND_COLORS.length];
	}
}
