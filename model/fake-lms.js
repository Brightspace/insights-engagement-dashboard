// adding variables here to match signature of real LMS. The filters don't actually work though.
// eslint-disable-next-line no-unused-vars
export async function fetchData({ roleIds, semesterIds, orgUnitIds, defaultView = false }) {
	const demoData = {
		records: [
			[1, 100, 500, 1, 55, 1000, null],
			[1, 200, 600, 0, 33, 2000, Date.now() - 2093],
			[1, 300, 500, 0, null, 1000, null],
			[1, 400, 500, 0, 30, 5000, null],
			[2, 100, 500, 0, 60, 1100, null],
			[2, 200, 700, 1, 38, 4000, null],
			[2, 300, 700, 0, 3, 0, 289298332],
			[2, 400, 700, 0, 100, 7200, Date.now() - 432000001],
			[2, 500, 700, 0, 88, 4000, null],
			[8, 200, 700, 0, null, 0, null],
			[6, 600, 700, 0, 95, 2000, Date.now() - 8560938122],
			[1, 400, 700, 1, 75, 2000, null]
		],
		orgUnits: [
			[1, 'Course 1', 3, [3, 4]],
			[2, 'Course 2', 3, [3, 10]],
			[6, 'Course 3 has a surprisingly long name, but nonetheless this kind of thing is bound to happen sometimes and we do need to design for it. Is that not so?', 3, [7, 4]],
			[8, 'ZCourse 4', 3, [5]],
			[3, 'Department 1', 2, [5]],
			[7, 'Department 2 has a longer name', 2, [5]],
			[4, 'Semester 1', 25, [6606]],
			[10, 'Semester 2', 25, [6606]],
			[5, 'Faculty 1', 7, [6606]],
			[9, 'Faculty 2', 7, [6606, 10]],
			[6606, 'Dev', 1, [0]]
		],
		users: [ // some of which are out of order
			[100,  'ATest', 'AStudent'],
			[300,  'CTest', 'CStudent'],
			[200,  'BTest', 'BStudent'],
			[400,  'DTest', 'DStudent'],
			[500,  'ETest', 'EStudent'],
			[600,  'GTest', 'GStudent'],
			[700,  'FTest', 'FStudent'],
			[800,  'HTest', 'HStudent'],
			[900,  'ITest', 'IStudent'],
			[1000, 'KTest', 'KStudent'],
			[1100, 'JTest', 'JStudent']
		],
		semesterTypeId: 25,
		selectedSemestersIds: semesterIds,
		selectedRolesIds: roleIds,
		selectedOrgUnitIds: orgUnitIds,
		defaultViewOrgUnitIds: defaultView ? [1, 2] : null
	};
	return new Promise(resolve => setTimeout(() => resolve(demoData), 100));
}

/**
 * @returns {{Identifier: string, DisplayName: string, Code: string|null}[]}
 */
export async function fetchRoles() {
	const demoData = [
		{ Identifier: '500', DisplayName: 'Administrator' },
		{ Identifier: '600', DisplayName: 'Instructor' },
		{ Identifier: '700', DisplayName: 'Student' }
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

