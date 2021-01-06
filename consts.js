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
	'#D3E24A',
	'#99CB5F',
	'#6CD36B',
	'#2CBA9A',
	'#14C5DB',
	'#4885DC',
	'#5D5BC0',
	'#86509E',
	'#D66DAC',
	'#E9428D',
	'#EE7030',
	'#FF9802',
	'#FFC102',
	'#FFEF48',
	'#60C46F',
	'#2DE2C0',
	'#00B4D9',
	'#D40067',
	'#F59036',
	'#9D1FD4',
	'#5211FA',
	'#004489',
	'#036A8A',
	'#00A490',
	'#2B8F44',
	'#8CDE8A',
	'#70FAE0',
	'#8FD1FF',
	'#E6ABFF',
	'#FF9EA0',
	'#FFDB8A',
	'#4A8F00',
	'#E1FFB5',
	'#A7FAE7',
	'#C7FDFF',
	'#E9E6FF',
	'#6900A0',
	'#990056',
	'#FFE2DB',
	'#FFAB61',
];

export function* UserTrendColorsIterator(start = 0, step = 1, end = 40) {
	for (let i = start; i < end; i += step) {
		yield USER_TREND_COLORS[i % USER_TREND_COLORS.length];
	}
}
