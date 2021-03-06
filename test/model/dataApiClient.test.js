import {
	fetchCachedChildren, fetchData, fetchLastSearch, fetchRelevantChildren, fetchRoles, fetchUserData, getVisibleUsers, orgUnitSearch, saveSettings
} from '../../model/dataApiClient';
import { expect } from '@open-wc/testing';
import fetchMock from 'fetch-mock/esm/client';

const rolesEndpoint = '/d2l/api/ap/unstable/insights/data/roles';
const usersEndpoint = 'end:/d2l/api/ap/unstable/insights/data/engagement/users';
const mockLmsResponseData = {
	Items: [
		[101, 'name-1', 2, [102], true],
		[102, 'name-2', 4, [105, 106], false]
	]
};
const mockLmsResponseData2 = {
	Items: [
		[103, 'name-3', 5, [105], true],
		[104, 'name-4', 6, [106], false]
	]
};
const mockLmsExpectedData = {
	Items: [
		{ Id:101, Name:'name-1', Type:2, Parents:[102], IsActive:true },
		{ Id:102, Name:'name-2', Type:4, Parents:[105, 106], IsActive:false }
	]
};
const mockLmsExpectedData2 = {
	Items: [
		{ Id:103, Name:'name-3', Type:5, Parents:[105], IsActive:true },
		{ Id:104, Name:'name-4', Type:6, Parents:[106], IsActive:false }
	]
};

describe('Lms', () => {
	afterEach(() => {
		fetchMock.reset();
	});

	describe('fetchRoles', () => {
		it('should fetch roles from LMS', async() => {
			const mockLmsResponseData = [
				{
					Identifier: '1',
					DisplayName: 'Role1',
					Code: null
				},
				{
					Identifier: '2',
					DisplayName: 'Role2',
					Code: null
				},
				{
					Identifier: '3',
					DisplayName: 'Role3',
					Code: null
				}
			];

			fetchMock.reset();
			fetchMock.get(rolesEndpoint, mockLmsResponseData);

			expect(await fetchRoles()).to.deep.equal(mockLmsResponseData);
		});
	});

	describe('fetchRelevantChildren', () => {
		it('should fetch children from the LMS without a semester filter', async() => {
			const responseData = { ...mockLmsResponseData,
				PagingInfo: { HashMoreItems: false, Bookmark: '9' }
			};

			const expectedData = { ...mockLmsExpectedData,
				PagingInfo: { HashMoreItems: false, Bookmark: '9' }
			};

			fetchMock.get('path:/d2l/api/ap/unstable/insights/data/orgunits/6612/children', responseData);

			expect(await fetchRelevantChildren(6612)).to.deep.equal(expectedData);
		});

		it('should fetch children from the LMS with a semester filter', async() => {
			const responseData = { ...mockLmsResponseData,
				PagingInfo: { HashMoreItems: true, Bookmark: '9' }
			};

			const expectedData = { ...mockLmsExpectedData,
				PagingInfo: { HashMoreItems: true, Bookmark: '9' }
			};

			fetchMock.get(
				'end:/d2l/api/ap/unstable/insights/data/orgunits/6612/children?selectedSemestersCsv=4%2C500%2C8',
				responseData
			);

			expect(await fetchRelevantChildren(6612, [4, 500, 8])).to.deep.equal(expectedData);
		});

		it('should cache by semester ids', async() => {
			fetchMock.get(
				'end:/d2l/api/ap/unstable/insights/data/orgunits/9619/children?selectedSemestersCsv=9%2C500%2C8',
				mockLmsResponseData
			);
			await fetchRelevantChildren(9619, [9, 500, 8]);

			fetchMock.get(
				'end:/d2l/api/ap/unstable/insights/data/orgunits/6612/children?selectedSemestersCsv=9%2C500%2C8',
				mockLmsResponseData2
			);
			await fetchRelevantChildren(6612, [9, 500, 8]);

			expect([...fetchCachedChildren([9, 500, 8])].sort((x, y) => x[0] - y[0])).to.deep.equal([
				[6612, mockLmsExpectedData2],
				[9619, mockLmsExpectedData]
			]);
		});

		it('should append to cache and update paging info', async() => {
			const responseData = { ...mockLmsResponseData,
				PagingInfo: { HasMoreItems: true, Bookmark: '9' }
			};
			const responseData2 = { ...mockLmsResponseData2,
				PagingInfo: { HasMoreItems: false, Bookmark: '100' }
			};

			fetchMock.get(
				'end:/d2l/api/ap/unstable/insights/data/orgunits/9619/children?selectedSemestersCsv=14%2C500%2C8',
				responseData
			);
			await fetchRelevantChildren(9619, [14, 500, 8]);

			fetchMock.get(
				'end:/d2l/api/ap/unstable/insights/data/orgunits/9619/children?selectedSemestersCsv=14%2C500%2C8&bookmark=9',
				responseData2
			);
			await fetchRelevantChildren(9619, [14, 500, 8], '9');

			expect([...fetchCachedChildren([14, 500, 8])]).to.deep.equal([
				[9619, {
					Items: [...mockLmsExpectedData.Items, ...mockLmsExpectedData2.Items],
					PagingInfo: responseData2.PagingInfo
				}]
			]);
		});

		it('should treat null as empty array in cache key', async() => {
			fetchMock.get(
				'end:/d2l/api/ap/unstable/insights/data/orgunits/6613/children?selectedSemestersCsv=',
				mockLmsResponseData
			);

			await fetchRelevantChildren(6613, []);

			expect(fetchCachedChildren(null).get(6613)).to.deep.equal(mockLmsExpectedData);
		});
	});

	describe('orgUnitSearch', () => {
		it('should search without a semester filter', async() => {
			fetchMock.get('end:/d2l/api/ap/unstable/insights/data/orgunits?search=asdf', mockLmsResponseData);

			expect(await orgUnitSearch('asdf')).to.deep.equal(mockLmsExpectedData);
		});

		it('should search with a semester filter', async() => {
			fetchMock.get(
				'end:/d2l/api/ap/unstable/insights/data/orgunits?search=c23&selectedSemestersCsv=4%2C500%2C8',
				mockLmsResponseData
			);

			expect(await orgUnitSearch('c23', [4, 500, 8])).to.deep.equal(mockLmsExpectedData);
		});

		it('should search with a semester filter and bookmark', async() => {
			fetchMock.get(
				'end:/d2l/api/ap/unstable/insights/data/orgunits?search=c23&selectedSemestersCsv=4%2C500%2C8&bookmark=234',
				mockLmsResponseData
			);

			expect(await orgUnitSearch('c23', [4, 500, 8], '234')).to.deep.equal(mockLmsExpectedData);
		});

		it('should cache result for matching semester filter', async() => {
			fetchMock.get(
				'end:/d2l/api/ap/unstable/insights/data/orgunits?search=new+search&selectedSemestersCsv=4%2C500%2C8',
				mockLmsResponseData
			);
			await orgUnitSearch('new search', [4, 500, 8]);

			expect(fetchLastSearch([4, 500, 8])).to.deep.equal(mockLmsExpectedData.Items);
		});

		it('should cache null for different semester filter', async() => {
			fetchMock.get(
				'end:/d2l/api/ap/unstable/insights/data/orgunits?search=new+search&selectedSemestersCsv=4%2C500%2C8',
				mockLmsResponseData
			);
			await orgUnitSearch('new search', [4, 500, 8]);

			expect(fetchLastSearch([1, 2, 3])).to.deep.equal(null);
		});

		it('should add pages from the same search to the cache', async() => {
			fetchMock.get(
				'end:/d2l/api/ap/unstable/insights/data/orgunits?search=paged+search&selectedSemestersCsv=4%2C500%2C8',
				mockLmsResponseData
			);
			await orgUnitSearch('paged search', [4, 500, 8]);

			fetchMock.get(
				'end:/d2l/api/ap/unstable/insights/data/orgunits?search=paged+search&selectedSemestersCsv=4%2C500%2C8&bookmark=9',
				mockLmsResponseData2
			);
			await orgUnitSearch('paged search', [4, 500, 8], '9');

			expect(fetchLastSearch([4, 500, 8])).to.deep.equal(
				[...mockLmsExpectedData.Items, ...mockLmsExpectedData2.Items]
			);
		});

		it('should refresh the cache when a new search begins', async() => {
			fetchMock.get(
				'end:/d2l/api/ap/unstable/insights/data/orgunits?search=first+search&selectedSemestersCsv=4%2C500%2C8',
				mockLmsResponseData
			);
			await orgUnitSearch('first search', [4, 500, 8]);

			fetchMock.get(
				'end:/d2l/api/ap/unstable/insights/data/orgunits?search=second+search&selectedSemestersCsv=4%2C500%2C8',
				mockLmsResponseData2
			);
			await orgUnitSearch('second search', [4, 500, 8]);

			expect(fetchLastSearch([4, 500, 8])).to.deep.equal(mockLmsExpectedData2.Items);
		});

		it('should refresh the cache when the semester filter changes', async() => {
			fetchMock.get(
				'end:/d2l/api/ap/unstable/insights/data/orgunits?search=same+search&selectedSemestersCsv=4%2C500%2C8',
				mockLmsResponseData
			);
			await orgUnitSearch('same search', [4, 500, 8]);

			fetchMock.get(
				'end:/d2l/api/ap/unstable/insights/data/orgunits?search=same+search&selectedSemestersCsv=1%2C2%2C3',
				mockLmsResponseData2
			);
			await orgUnitSearch('same search', [1, 2, 3]);

			expect(fetchLastSearch([4, 500, 8])).to.deep.equal(null);
			expect(fetchLastSearch([1, 2, 3])).to.deep.equal(mockLmsExpectedData2.Items);
		});
	});

	describe('saveSettings', () => {
		it('should throw if settings are missing', async() => {
			let didThrow = false;
			try {
				await saveSettings({ showOverdueCard: true });
			} catch (err) {
				didThrow = true;
			}
			expect(didThrow, 'didThrow').to.be.true;
		});

		it('should send the settings to the lms', async() => {
			const settings = {
				showResultsCard: true,
				showOverdueCard: true,
				showDiscussionsCard: true,
				showSystemAccessCard: false,
				showGradesCard: true,
				showTicGradesCard: true,
				showCourseAccessCard: false,
				showCoursesCol: true,
				showGradeCol: false,
				showTicCol: true,
				showDiscussionsCol: true,
				showLastAccessCol: true,
				showContentViewCard: true
			};
			window.localStorage.setItem('XSRF.Token', 'token');
			fetchMock.put(
				'end:/d2l/api/ap/unstable/insights/mysettings/engagement',
				200
			);

			await saveSettings(settings);

			const request = fetchMock.lastCall().request; // assumes fetch was called with a Request
			expect(request.method).to.equal('PUT');
			expect(request.headers.get('content-type')).to.equal('application/json');
			expect(request.headers.get('x-csrf-token')).to.equal('token');
			expect(await request.json()).to.deep.equal(settings);
		});
	});

	describe('fetchData', () => {
		it('should throw an error if the query fails', async() => {
			fetchMock.post('path:/d2l/lp/auth/oauth2/token', {
				'expires_at': Date.now() + 100000,
				'access_token': 't'
			});
			fetchMock.get('begin:https://data.example.com/unstable/insights/data/engagement', 403);
			let error;
			try {
				await fetchData({}, 'https://data.example.com');
			} catch (err) {
				error = err.toString();
			}
			expect(error).to.equal('Error: query-failure');
		});

		it('should poll for data', async() => {
			const dataUri = 'begin:https://data.example.com/unstable/insights/data/engagement';
			const expected = { the: 'data' };
			fetchMock.post('path:/d2l/lp/auth/oauth2/token', {
				'expires_at': Date.now() + 100000,
				'access_token': 't'
			});
			fetchMock.get(dataUri, 202, { repeat: 2 });
			fetchMock.get(dataUri, expected, { overwriteRoutes: false });

			const actual = await fetchData({}, 'https://data.example.com');

			expect(actual).to.deep.equal(expected);
		});
	});

	describe('fetchUserData', () => {
		it('should throw an error if the query fails', async() => {
			fetchMock.post('path:/d2l/lp/auth/oauth2/token', {});
			fetchMock.post('https://data.example.com/unstable/insights/data/userdrill', 403);
			let error;
			try {
				await fetchUserData([], 1234, 'https://data.example.com');
			} catch (err) {
				error = err.toString();
			}
			expect(error).to.equal('Error: query-failure');
		});

		it('should not add a redundant slash', async() => {
			fetchMock.post('path:/d2l/lp/auth/oauth2/token', {});
			fetchMock.post('https://data.example.com/unstable/insights/data/userdrill', { the: 'data' });
			// note trailing slash here
			const actual = await fetchUserData([], 1234, 'https://data.example.com/');
			expect(actual).to.deep.equal({ the: 'data' });
		});
	});

	describe('getVisibleUsers', () => {
		const mockLmsUserResponseData = {
			Items: [
				{
					Id: '1',
					FirstName: 'One',
					LastName: 'Learner',
					Username: null
				}, {
					Id: '1',
					FirstName: 'Two',
					LastName: 'Learner',
					Username: 'tlearner'
				}
			],
			PagingInfo: { HasMoreItems: false }
		};

		beforeEach(() => fetchMock.reset());

		it('should run the provided search', async() => {
			fetchMock.get(`${usersEndpoint}?search=search+string`, mockLmsUserResponseData);
			expect(await getVisibleUsers({ search: 'search string' })).to.deep.equal(mockLmsUserResponseData);
		});

		it('should not include a search parameter if none is provided', async() => {
			fetchMock.get(usersEndpoint, mockLmsUserResponseData);
			expect(await getVisibleUsers({})).to.deep.equal(mockLmsUserResponseData);
		});

		it('should not include a params other than allowed', async() => {
			fetchMock.get(`${usersEndpoint}?search=&desc=&bookmark=&sort=`, mockLmsUserResponseData);
			const options = {
				search: '',
				desc: '',
				bookmark: '',
				sort: '',
				foo: '' //is excluded?
			};
			expect(await getVisibleUsers(options)).to.deep.equal(mockLmsUserResponseData);
		});

		it('should place options in the correct param', async() => {
			fetchMock.get(`${usersEndpoint}?search=search&desc=true&bookmark=bookmark&sort=first`, mockLmsUserResponseData);
			const options = {
				search: 'search',
				desc: true,
				bookmark: 'bookmark',
				sort: 'first',
			};
			expect(await getVisibleUsers(options)).to.deep.equal(mockLmsUserResponseData);
		});

		it('should throw on error', async() => {
			fetchMock.get(usersEndpoint, 500);
			let error;
			try {
				await getVisibleUsers();
			} catch (err) {
				error = err.toString();
			}
			expect(error).to.exist;
		});
	});
});
