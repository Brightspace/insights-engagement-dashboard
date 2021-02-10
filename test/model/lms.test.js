import { fetchCachedChildren, fetchData, fetchLastSearch, fetchRelevantChildren, fetchRoles, fetchUserData, orgUnitSearch, saveSettings } from '../../model/lms';
import { expect } from '@open-wc/testing';
import fetchMock from 'fetch-mock/esm/client';

const rolesEndpoint = '/d2l/api/ap/unstable/insights/data/roles';

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
			const mockLmsResponseData = {
				Items: [2, 4, 7, 8, 9], // not representative; just for matching
				PagingInfo: { HashMoreItems: false, Bookmark: '9' }
			};

			fetchMock.get('path:/d2l/api/ap/unstable/insights/data/orgunits/6612/children', mockLmsResponseData);

			expect(await fetchRelevantChildren(6612)).to.deep.equal(mockLmsResponseData);
		});

		it('should fetch children from the LMS with a semester filter', async() => {
			const mockLmsResponseData = {
				Items: [2, 4, 7, 8, 9], // not representative; just for matching
				PagingInfo: { HashMoreItems: true, Bookmark: '9' }
			};

			fetchMock.get(
				'end:/d2l/api/ap/unstable/insights/data/orgunits/6612/children?selectedSemestersCsv=4%2C500%2C8',
				mockLmsResponseData
			);

			expect(await fetchRelevantChildren(6612, [4, 500, 8])).to.deep.equal(mockLmsResponseData);
		});

		it('should cache by semester ids', async() => {
			const mockLmsResponseData1 = {
				Items: [2, 4, 7, 8, 9] // not representative; just for matching
			};
			const mockLmsResponseData2 = {
				Items: [10, 11, 100] // not representative; just for matching
			};

			fetchMock.get(
				'end:/d2l/api/ap/unstable/insights/data/orgunits/9619/children?selectedSemestersCsv=9%2C500%2C8',
				mockLmsResponseData1
			);
			await fetchRelevantChildren(9619, [9, 500, 8]);

			fetchMock.get(
				'end:/d2l/api/ap/unstable/insights/data/orgunits/6612/children?selectedSemestersCsv=9%2C500%2C8',
				mockLmsResponseData2
			);
			await fetchRelevantChildren(6612, [9, 500, 8]);

			expect([...fetchCachedChildren([9, 500, 8])].sort((x, y) => x[0] - y[0])).to.deep.equal([
				[6612, mockLmsResponseData2],
				[9619, mockLmsResponseData1]
			]);
		});

		it('should append to cache and update paging info', async() => {
			const mockLmsResponseData1 = {
				Items: [2, 4, 7, 8, 9], // not representative; just for matching
				PagingInfo: { HasMoreItems: true, Bookmark: '9' }
			};
			const mockLmsResponseData2 = {
				Items: [10, 11, 100], // not representative; just for matching
				PagingInfo: { HasMoreItems: false, Bookmark: '100' }
			};

			fetchMock.get(
				'end:/d2l/api/ap/unstable/insights/data/orgunits/9619/children?selectedSemestersCsv=14%2C500%2C8',
				mockLmsResponseData1
			);
			await fetchRelevantChildren(9619, [14, 500, 8]);

			fetchMock.get(
				'end:/d2l/api/ap/unstable/insights/data/orgunits/9619/children?selectedSemestersCsv=14%2C500%2C8&bookmark=9',
				mockLmsResponseData2
			);
			await fetchRelevantChildren(9619, [14, 500, 8], '9');

			expect([...fetchCachedChildren([14, 500, 8])]).to.deep.equal([
				[9619, {
					Items: [...mockLmsResponseData1.Items, ...mockLmsResponseData2.Items],
					PagingInfo: mockLmsResponseData2.PagingInfo
				}]
			]);
		});

		it('should treat null as empty array in cache key', async() => {
			const mockLmsResponseData = {
				Items: [2, 4, 7, 8, 9] // not representative; just for matching
			};

			fetchMock.get(
				'end:/d2l/api/ap/unstable/insights/data/orgunits/6613/children?selectedSemestersCsv=',
				mockLmsResponseData
			);

			await fetchRelevantChildren(6613, []);

			expect(fetchCachedChildren(null).get(6613)).to.deep.equal(mockLmsResponseData);
		});
	});

	describe('orgUnitSearch', () => {
		it('should search without a semester filter', async() => {
			const mockLmsResponseData = {
				Items: [2, 4, 7, 8, 9] // not representative; just for matching
			};

			fetchMock.get('end:/d2l/api/ap/unstable/insights/data/orgunits?search=asdf', mockLmsResponseData);

			expect(await orgUnitSearch('asdf')).to.deep.equal(mockLmsResponseData);
		});

		it('should search with a semester filter', async() => {
			const mockLmsResponseData = {
				Items: [2, 4, 7, 8, 9] // not representative; just for matching
			};

			fetchMock.get(
				'end:/d2l/api/ap/unstable/insights/data/orgunits?search=c23&selectedSemestersCsv=4%2C500%2C8',
				mockLmsResponseData
			);

			expect(await orgUnitSearch('c23', [4, 500, 8])).to.deep.equal(mockLmsResponseData);
		});

		it('should search with a semester filter and bookmark', async() => {
			const mockLmsResponseData = {
				Items: [2, 4, 7, 8, 9] // not representative; just for matching
			};

			fetchMock.get(
				'end:/d2l/api/ap/unstable/insights/data/orgunits?search=c23&selectedSemestersCsv=4%2C500%2C8&bookmark=234',
				mockLmsResponseData
			);

			expect(await orgUnitSearch('c23', [4, 500, 8], '234')).to.deep.equal(mockLmsResponseData);
		});

		it('should cache result for matching semester filter', async() => {
			const mockLmsResponseData = {
				Items: [2, 4, 7, 8, 9] // not representative; just for matching
			};

			fetchMock.get(
				'end:/d2l/api/ap/unstable/insights/data/orgunits?search=new+search&selectedSemestersCsv=4%2C500%2C8',
				mockLmsResponseData
			);
			await orgUnitSearch('new search', [4, 500, 8]);

			expect(fetchLastSearch([4, 500, 8])).to.deep.equal(mockLmsResponseData.Items);
		});

		it('should cache null for different semester filter', async() => {
			const mockLmsResponseData = {
				Items: [2, 4, 7, 8, 9] // not representative; just for matching
			};

			fetchMock.get(
				'end:/d2l/api/ap/unstable/insights/data/orgunits?search=new+search&selectedSemestersCsv=4%2C500%2C8',
				mockLmsResponseData
			);
			await orgUnitSearch('new search', [4, 500, 8]);

			expect(fetchLastSearch([1, 2, 3])).to.deep.equal(null);
		});

		it('should add pages from the same search to the cache', async() => {
			const mockLmsResponseData1 = {
				Items: [2, 4, 7, 8, 9] // not representative; just for matching
			};
			const mockLmsResponseData2 = {
				Items: [12, 14, 17, 18, 19] // not representative; just for matching
			};

			fetchMock.get(
				'end:/d2l/api/ap/unstable/insights/data/orgunits?search=paged+search&selectedSemestersCsv=4%2C500%2C8',
				mockLmsResponseData1
			);
			await orgUnitSearch('paged search', [4, 500, 8]);

			fetchMock.get(
				'end:/d2l/api/ap/unstable/insights/data/orgunits?search=paged+search&selectedSemestersCsv=4%2C500%2C8&bookmark=9',
				mockLmsResponseData2
			);
			await orgUnitSearch('paged search', [4, 500, 8], '9');

			expect(fetchLastSearch([4, 500, 8])).to.deep.equal(
				[...mockLmsResponseData1.Items, ...mockLmsResponseData2.Items]
			);
		});

		it('should refresh the cache when a new search begins', async() => {
			const mockLmsResponseData1 = {
				Items: [2, 4, 7, 8, 9] // not representative; just for matching
			};
			const mockLmsResponseData2 = {
				Items: [12, 14, 17, 18, 19] // not representative; just for matching
			};

			fetchMock.get(
				'end:/d2l/api/ap/unstable/insights/data/orgunits?search=first+search&selectedSemestersCsv=4%2C500%2C8',
				mockLmsResponseData1
			);
			await orgUnitSearch('first search', [4, 500, 8]);

			fetchMock.get(
				'end:/d2l/api/ap/unstable/insights/data/orgunits?search=second+search&selectedSemestersCsv=4%2C500%2C8',
				mockLmsResponseData2
			);
			await orgUnitSearch('second search', [4, 500, 8]);

			expect(fetchLastSearch([4, 500, 8])).to.deep.equal(mockLmsResponseData2.Items);
		});

		it('should refresh the cache when the semester filter changes', async() => {
			const mockLmsResponseData1 = {
				Items: [2, 4, 7, 8, 9] // not representative; just for matching
			};
			const mockLmsResponseData2 = {
				Items: [12, 14, 17, 18, 19] // not representative; just for matching
			};

			fetchMock.get(
				'end:/d2l/api/ap/unstable/insights/data/orgunits?search=same+search&selectedSemestersCsv=4%2C500%2C8',
				mockLmsResponseData1
			);
			await orgUnitSearch('same search', [4, 500, 8]);

			fetchMock.get(
				'end:/d2l/api/ap/unstable/insights/data/orgunits?search=same+search&selectedSemestersCsv=1%2C2%2C3',
				mockLmsResponseData2
			);
			await orgUnitSearch('same search', [1, 2, 3]);

			expect(fetchLastSearch([4, 500, 8])).to.deep.equal(null);
			expect(fetchLastSearch([1, 2, 3])).to.deep.equal(mockLmsResponseData2.Items);
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
				showLastAccessCol: true
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
			fetchMock.get('', 403);
			let error;
			try {
				await fetchData({});
			} catch (err) {
				error = err.toString();
			}
			expect(error).to.equal('Error: query-failure');
		});
	});

	describe('fetchUserData', () => {
		it('should throw an error if the query fails', async() => {
			fetchMock.post('', 403);
			let error;
			try {
				await fetchUserData([], 1234, 'https://data.example.com');
			} catch (err) {
				error = err.toString();
			}
			expect(error).to.exist;
		});
	});
});
