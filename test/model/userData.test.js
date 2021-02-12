import { expect } from '@open-wc/testing';
import { UserData } from '../../model/userData.js';

const userData = {
	userGrades: [
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
	],
	userContent: 'some data',
	userCourseAccess: [{ any: 'data' }]
};

describe('UserData', () => {
	const fetchUserData = async() => ({
		...userData
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
			expect(sut.courseGrades).to.deep.equal(userData.userGrades);
		});
		it('should return contentViews', async() => {
			expect(sut.contentViews).to.deep.equal(userData.userContent);
		});
		it('should return courseAccess', async() => {
			expect(sut.courseAccess).to.deep.equal(userData.userCourseAccess);
		});
	});
});
