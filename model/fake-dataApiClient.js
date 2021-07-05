export function parseHash() {
	if (!window.location.hash) return {};

	const hash = window.location.hash.substring(1);

	return hash.split('&')
		.map(s => ({ [s.split('=')[0]]: s.split('=')[1] }))
		.reduce((acc, val) => ({ ...acc, ...val }), {});
}

function getDelayFromUrlHash() {
	const hash = parseHash();
	return hash.delay;
}

// adding variables here to match signature of real LMS. The filters don't actually work though.
// eslint-disable-next-line no-unused-vars
export async function fetchData({ roleIds, semesterIds, orgUnitIds, defaultView = false }) {
	const demoData = {
		records: [
			[1, 100, 500, 1, 55, 1000, Date.now(), 0, 0, 0, null],
			[1, 200, 600, 0, 33, 2000, 1607528563207, 0, 0, 0, null],
			[1, 300, 500, 0, null, 1000, null, 0, 0, 0, null],
			[1, 400, 500, 0, 30, 5000, null, 0, 0, 0, null],
			[1, 500, 500, 0, 65, 5000, null, 2, 0, 40, null],
			[1, 500, 600, 0, 51, 4000, null, 0, 0, 0, 0.7],
			[2, 100, 500, 0, 60, 1100, null, 2, 4, 0, null],
			[2, 200, 700, 1, 38, 4000, null, 0, 0, 0, 0.8],
			[1, 200, 700, 1, 71, 4000, null, 0, 0, 0, null],
			[1, 100, 700, 1, 81, 1000, null, 3, 2, 1, null],
			[2, 100, 700, 1, 91, 1200, null, 1, 33, 1, null],
			[2, 300, 500, 0, 9, 7200, null, 1, 3, 5, null],
			[2, 300, 700, 0, 3, 0, 289298332, 0, 0, 0, null],
			[2, 400, 700, 0, 100, 7200, Date.now() - 432000001, 0, 0, 0, 0.9],
			[2, 500, 700, 0, 88, 4000, null, 4, 4, 1, null],
			[8, 200, 700, 0, null, 0, null, 55, 2, 3, null],
			[6, 600, 700, 0, 95, 2000, Date.now() - 8560938122, 0, 0, 0, null],
			[1, 400, 700, 1, 75, 2000, null, 2, 1, 4, null]
		],
		orgUnits: [
			{ Id:1, Name:'Course 1', Type:3, Parents:[3, 4], IsActive:false },
			{ Id:2, Name:'Course 2', Type:3, Parents:[3, 10], IsActive:true },
			{ Id:6, Name:'Course 3 has a surprisingly long name, but nonetheless this kind of thing is bound to happen sometimes and we do need to design for it. Is that not so?', Type:3, Parents:[7, 4], IsActive:true },
			{ Id:8, Name:'ZCourse 4', Type:3, Parents:[5], IsActive:false },
			{ Id:3, Name:'Department 1', Type:2, Parents:[5], IsActive:false },
			{ Id:7, Name:'Department 2 has a longer name', Type:2, Parents:[5], IsActive:false },
			{ Id:4, Name:'Semester 1', Type:25, Parents:[6606], IsActive:false },
			{ Id:10, Name:'Semester 2', Type:25, Parents:[6606], IsActive:false },
			{ Id:5, Name:'Faculty 1', Type:7, Parents:[6606], IsActive:false },
			{ Id:9, Name:'Faculty 2', Type:7, Parents:[6606, 10], IsActive:false },
			{ Id:6606, Name:'Dev', Type:1, Parents:[0], IsActive:false }
		],
		users: [ // some of which are out of order
			[100,  'ATest', 'AStudent', 'AStudent', 1601193037132, 5],
			[300,  'CTest', 'CStudent', 'CStudent', 1603193037132, 15],
			[200,  'BTest', 'BStudent', 'BStudent', 1607528565300, 25],
			[400,  'DTest', 'DStudent', 'DStudent', null, 25],
			[500,  'ETest', 'EStudent', 'EStudent', 1546318800000, 200],
			[600,  'GTest', 'GStudent', 'GStudent', 1589998800000, 27],
			[700,  'FTest', 'FStudent', 'FStudent', 1599998800000, 57],
			[800,  'HTest', 'HStudent', 'HStudent', 1600008800000, 8],
			[900,  'ITest', 'IStudent', 'IStudent', 1604558800000, 0],
			[1000, 'KTest', 'KStudent', 'KStudent', 1604958800000, 20],
			[1100, 'JTest', 'JStudent', 'JStudent', 1594958800000, 54]
		],
		semesterTypeId: 25,
		numDefaultSemesters: 4,
		selectedSemestersIds: semesterIds,
		selectedRolesIds: roleIds,
		selectedOrgUnitIds: orgUnitIds,
		defaultViewOrgUnitIds: defaultView ? [1, 2] : null,
		isDefaultView: defaultView,
		isStudentSuccessSys: true
	};
	return new Promise(resolve => setTimeout(() => resolve(demoData), getDelayFromUrlHash() || 10));
}

/**
 * @returns {{Identifier: string, DisplayName: string, Code: string|null}[]}
 */
export async function fetchRoles() {
	const demoData = [
		{ Identifier: '500', DisplayName: 'Administrator' },
		{ Identifier: '600', DisplayName: 'Instructor' },
		{ Identifier: '700', DisplayName: 'Student' },

		{ Identifier: '578', DisplayName: 'End User' },
		{ Identifier: '579', DisplayName: 'Resource Creator' },
		{ Identifier: '581', DisplayName: 'Blank Role' },
		{ Identifier: '582', DisplayName: 'Blank Role 2' },
		{ Identifier: '583', DisplayName: 'Admin (co)' },
		{ Identifier: '590', DisplayName: 'LR Admin' },
		{ Identifier: '591', DisplayName: 'LR Power User' },
		{ Identifier: '592', DisplayName: 'LR Contributor' },
		{ Identifier: '593', DisplayName: 'LR User' },
		{ Identifier: '594', DisplayName: 'LR Guest' },
		{ Identifier: '597', DisplayName: 'D2LMonitor' },
		{ Identifier: '952', DisplayName: 'SIS Integration' },
		{ Identifier: '953', DisplayName: 'AllSection AllGroup' },
		{ Identifier: '954', DisplayName: 'AllSection NoGroup' },
		{ Identifier: '955', DisplayName: 'NoSection AllGroup' },
		{ Identifier: '956', DisplayName: 'NoSection NoGroup' },
		{ Identifier: '9000', DisplayName: 'LYNC_TEST_PERSONAL' },
		{ Identifier: '11590', DisplayName: 'IPSCT_Student' },
		{ Identifier: '11591', DisplayName: 'IPSCT_Admin' },
		{ Identifier: '11598', DisplayName: 'IPSCT_Manage' },
		{ Identifier: '11599', DisplayName: 'IPSCT_Security' }
	];

	return new Promise(resolve =>	setTimeout(() => resolve(demoData), 100));
}

/**
 * @param pageSize
 * @param {string|null} bookmark - can be null
 * @param {string|null} search - can be null
 * @returns {{PagingInfo:{Bookmark: string, HasMoreItems: boolean}, Items: {orgUnitId: number, orgUnitName: string}[]}}
 */
export async function fetchSemesters(pageSize, bookmark, search) {
	const response = {
		PagingInfo: {
			Bookmark: '0',
			HasMoreItems: false
		},
		Items: [
			{
				orgUnitId: 4,
				orgUnitName: 'Semester 1'
			},
			{
				orgUnitId: 10,
				orgUnitName: 'Semester 2'
			},
			{
				orgUnitId: 10007,
				orgUnitName: 'IPSIS Semester New'
			},
			{
				orgUnitId: 121194,
				orgUnitName: 'Fall Test Semester'
			},
			{
				orgUnitId: 120127,
				orgUnitName: 'IPSIS Test Semester 1'
			},
			{
				orgUnitId: 120126,
				orgUnitName: 'IPSIS Test Semester 12'
			},
			{
				orgUnitId: 120125,
				orgUnitName: 'IPSIS Test Semester 123'
			},
			{
				orgUnitId: 120124,
				orgUnitName: 'IPSIS Test Semester 4'
			},
			{
				orgUnitId: 1201240,
				orgUnitName: 'IPSIS Test Semester 42'
			}
		]
	};

	response.Items = response.Items.map((item, index) => Object.assign(item, { index }));

	const index = parseInt(bookmark || '-1');
	response.Items = response.Items.slice(index + 1);

	if (search) {
		response.Items = response.Items
			.filter(item => item.orgUnitName.toLowerCase().includes(search.toLowerCase()));
	}
	response.PagingInfo.HasMoreItems = response.Items.length > pageSize;
	response.Items = response.Items.slice(0, pageSize);
	response.PagingInfo.Bookmark = response.Items[response.Items.length - 1].index.toString();

	return new Promise(resolve =>	setTimeout(() => resolve(response), 100));
}

// eslint-disable-next-line no-unused-vars
export async function fetchUserData(orgUnitIds = [], userId = 0) {
	const demoData = {
		userGrades: [
			{
				courseId: 1,
				gradesData: [
					{ date: Date.UTC(2020, 1, 1), grade: 0.5 },
					{ date: Date.UTC(2020, 1, 7), grade: 0.60 },
					{ date: Date.UTC(2020, 1, 14), grade: 0.45 },
					{ date: Date.UTC(2020, 1, 21), grade: 0.65 },
					{ date: Date.UTC(2020, 1, 28), grade: 0.70 },
					{ date: Date.UTC(2020, 2, 4), grade: 0.65 }
				]
			}, {
				courseId: 2,
				gradesData: [
					{ date: Date.UTC(2020, 1, 1), grade: 0.30 },
					{ date: Date.UTC(2020, 1, 7), grade: 0.50 },
					{ date: Date.UTC(2020, 1, 14), grade: 0.35 },
					{ date: Date.UTC(2020, 1, 21), grade: 0.50 },
					{ date: Date.UTC(2020, 1, 28), grade: 0.65 },
					{ date: Date.UTC(2020, 2, 4), grade: 0.40 }
				]
			}, {
				courseId: 8,
				gradesData: [
					{ date: Date.UTC(2020, 1, 1), grade: 0.10 },
					{ date: Date.UTC(2020, 1, 7), grade: 0.30 },
					{ date: Date.UTC(2020, 1, 14), grade: 0.25 },
					{ date: Date.UTC(2020, 1, 21), grade: 0.40 },
					{ date: Date.UTC(2020, 1, 28), grade: 0.55 },
					{ date: Date.UTC(2020, 2, 4), grade: 0.25 }
				]
			}
		],
		userContent: [{
			//test data
			orgUnitId: 1,
			data: [
				[Date.UTC(2020, 1, 1), 50],
				[Date.UTC(2020, 1, 7), 60],
				[Date.UTC(2020, 1, 14), 45],
				[Date.UTC(2020, 1, 21), 65],
				[Date.UTC(2020, 1, 28), 70],
				[Date.UTC(2020, 2, 4), 65]
			]
		}, {
			orgUnitId: 2,
			data: [
				[Date.UTC(2020, 1, 1), 30],
				[Date.UTC(2020, 1, 7), 50],
				[Date.UTC(2020, 1, 14), 35],
				[Date.UTC(2020, 1, 21), 50],
				[Date.UTC(2020, 1, 28), 65],
				[Date.UTC(2020, 2, 4), 40]
			]
		}, {
			orgUnitId: 8,
			data: [
				[Date.UTC(2020, 1, 1), 10],
				[Date.UTC(2020, 1, 7), 30],
				[Date.UTC(2020, 1, 14), 25],
				[Date.UTC(2020, 1, 21), 40],
				[Date.UTC(2020, 1, 28), 55],
				[Date.UTC(2020, 2, 4), 25]
			]
		}],
		userCourseAccess: [{
			orgUnitId: 1,
			data: [
				{ x: Date.UTC(2020, 1, 3), y: 0 },
				{ x: Date.UTC(2020, 1, 10), y: 3 },
				{ x: Date.UTC(2020, 1, 17), y: 4 },
				{ x: Date.UTC(2020, 1, 24), y: 5 },
				{ x: Date.UTC(2020, 1, 31), y: 3 },
				{ x: Date.UTC(2020, 2, 7), y: 7 },
				{ x: Date.UTC(2020, 2, 14), y: 7 },
				{ x: Date.UTC(2020, 2, 21), y: 6 }
			]
		}, {
			orgUnitId: 2,
			data: [
				{ x: Date.UTC(2020, 1, 3), y: 0 },
				{ x: Date.UTC(2020, 1, 10), y: 2 },
				{ x: Date.UTC(2020, 1, 17), y: 3 },
				{ x: Date.UTC(2020, 1, 24), y: 4 },
				{ x: Date.UTC(2020, 1, 31), y: 1 },
				{ x: Date.UTC(2020, 2, 7), y: 4 },
				{ x: Date.UTC(2020, 2, 14), y: 4 },
				{ x: Date.UTC(2020, 2, 21), y: 6 }
			]
		}, {
			orgUnitId: 8,
			data: [
				{ x: Date.UTC(2020, 1, 3), y: 0 },
				{ x: Date.UTC(2020, 1, 10), y: 1 },
				{ x: Date.UTC(2020, 1, 17), y: 2 },
				{ x: Date.UTC(2020, 1, 24), y: 3 },
				{ x: Date.UTC(2020, 1, 31), y: 0 },
				{ x: Date.UTC(2020, 2, 7), y: 2 },
				{ x: Date.UTC(2020, 2, 14), y: 2 },
				{ x: Date.UTC(2020, 2, 21), y: 4 }
			]
		}]
	};

	return new Promise(resolve => setTimeout(() => resolve(demoData), 100));
}

