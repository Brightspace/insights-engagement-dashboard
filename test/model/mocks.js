export const mockOuTypes = {
	organization: 0,
	department: 1,
	course: 2,
	courseOffering: 3,
	semester: 5
};

export const mockRoleIds = {
	admin: 100,
	instructor: 200,
	student: 300
};

export const records = [
	[6606, 100, mockRoleIds.student, 0, 22, 2000, 10293819283, 0, 0, 0], // this user has a cascading admin role on dept and sem levels
	[6606, 200, mockRoleIds.student, 0, 33, 2500, 10293819283, 0, 0, 0],
	[6606, 300, mockRoleIds.student, 0, 44, 4000, 10293819283, 1, 17, 20],
	[6606, 400, mockRoleIds.student, 0, 55, 4500, 10293819283, 4, 8, 1], // this user has a cascading admin role on dept and sem levels

	// semesters
	[11, 100, mockRoleIds.admin, 0, null, 0, null, 0, 0, 0],
	[12, 100, mockRoleIds.admin, 0, null, 0, null, 0, 0, 0],
	[13, 100, mockRoleIds.admin, 0, null, 0, null, 0, 0, 0],

	[11, 200, mockRoleIds.student, 0, 33, 0, null, 0, 0, 0],
	[12, 200, mockRoleIds.instructor, 0, null, 0, null, 0, 0, 0],

	[11, 300, mockRoleIds.student, 0, 100, 0, null, 0, 0, 0],
	[12, 300, mockRoleIds.student, 0, 100, 0, null, 2, 18, 12],
	[13, 300, mockRoleIds.student, 0, 100, 0, null, 0, 0, 0],

	[11, 400, mockRoleIds.admin, 0, null, 0, 12392838182, 0, 0, 0],
	[12, 400, mockRoleIds.admin, 0, null, 0, 12392838182, 0, 0, 0],
	[13, 400, mockRoleIds.admin, 0, null, 0, null, 0, 0, 0],

	// dept 1
	[1001, 100, mockRoleIds.admin, 0, null, 0, null, 0, 0, 0],
	[1001, 200, mockRoleIds.student, 0, 73, 0, null, 0, 0, 0],
	[1001, 300, mockRoleIds.student, 0, 73, 0, null, 0, 0, 0],
	// courses
	[1, 100, mockRoleIds.admin, 0, null, 0, null, 17, 18, 19],
	[1, 200, mockRoleIds.instructor, 0, null, 0, null, 0, 0, 0],
	[1, 300, mockRoleIds.student, 1, 41, 3500, null, 2, 106, 0],
	[2, 100, mockRoleIds.admin, 0, null, 0, null, 0, 0, 0],
	[2, 200, mockRoleIds.student, 0, 55, 5000, null, 0, 0, 0],
	[2, 300, mockRoleIds.student, 0, 39, 3000, null, 0, 0, 0],
	// course 1 offerings
	[111, 100, mockRoleIds.admin, 0, null, 0, null, 0, 0, 0],
	[111, 200, mockRoleIds.student, 1, 93, 7000, null, 0, 0, 0],
	[112, 100, mockRoleIds.admin, 0, null, 0, null, 0, 0, 0],
	[112, 200, mockRoleIds.instructor, 0, null, 0, null, 0, 0, 0], // this person was promoted from student to instructor
	[113, 100, mockRoleIds.admin, 0, null, 0, null, 0, 0, 0],
	[113, 300, mockRoleIds.student, 0, 75, 6000, Date.now() - 352800000, 0, 12, 44],
	// course 2 offerings
	[212, 100, mockRoleIds.admin, 0, null, 0, null, 0, 0, 0],
	[212, 200, mockRoleIds.student, 0, 84, 4000, null, 0, 0, 0],
	[212, 300, mockRoleIds.instructor, 0, null, 0, null, 0, 0, 0],

	// dept 2
	[1002, 200, mockRoleIds.student, 0, 98, 0, null, 0, 0, 0],
	[1002, 300, mockRoleIds.student, 0, 89, 0, null, 2, 2, 2],
	[1002, 400, mockRoleIds.admin, 0, null, 0, null, 1, 7, 2],
	[3, 200, mockRoleIds.student, 0, 98, 0, Date.now() - 299, 0, 0, 0],
	[3, 300, mockRoleIds.student, 0, 88, 0, Date.now() - 86500000, 0, 0, 0],
	[3, 400, mockRoleIds.admin, 0, null, 0, null, 0, 0, 0],
	[311, 200, mockRoleIds.student, 0, 99, 0, null, 0, 0, 0],
	[311, 300, mockRoleIds.student, 0, 42, 0, null, 0, 209, 0],
	[311, 400, mockRoleIds.admin, 0, null, 0, null, 3, 61, 22],
	[313, 300, mockRoleIds.student, 0, 66, 0, null, 0, 29, 1],
	[313, 400, mockRoleIds.admin, 0, null, 0, null, 0, 22, 6],
	[6606, 100, mockRoleIds.student, 0, null, 0, null, 0, 0, 0], // this user has a cascading admin role on dept and sem levels
	[6606, 200, mockRoleIds.student, 0, null, 0, null, 0, 0, 0],
	[6606, 300, mockRoleIds.student, 0, null, 0, null, 0, 0, 0],
	[6606, 400, mockRoleIds.student, 0, null, 0, null, 0, 0, 0], // this user has a cascading admin role on dept and sem levels
];
