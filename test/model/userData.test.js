import { expect } from '@open-wc/testing';
import { UserData } from '../../model/userData.js';

const userData = {
	courseGradesData: [
		{
			courseId: 1,
			gradesData: [{ date: 0, grade: 0.5 }]
		},
		{
			courseId: 2,
			gradesData: [{ date: 0, grade: 0.5 }]
		},
		{
			courseId: 3,
			gradesData: [{ date: 0, grade: 0.5 }]
		}
	]
};

describe('UserData', () => {
	const serverData = {
		courseGradesData: userData
	};
	const fetchUserData = async() => ({
		...serverData
	});

	let sut;
	beforeEach(async() => {
		sut = new UserData({ fetchUserData });
		sut.loadData([1, 2, 3], 1);
		await new Promise(resolve => setTimeout(resolve, 0));
	});

	describe('constructor', () => {
		it('should get empty courseGrades', () => {
			expect(new UserData({ fetchUserData }).courseGrades)
				.to.deep.equal([]);
		});
	});

	describe('reload from server', () => {
		it('should return courseGrades', async() => {
			expect(sut.courseGrades).to.deep.equal(userData);
		});
	});
});
