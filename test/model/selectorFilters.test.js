import { disableUrlStateForTesting, enableUrlState, setStateForTesting } from '../../model/urlState';
import { OrgUnitSelectorFilter, RoleSelectorFilter, SemesterSelectorFilter } from '../../model/selectorFilters';
import { expect } from '@open-wc/testing';
import { observable } from 'mobx';

describe('selectorFilters', () => {
	before(() => {
		disableUrlStateForTesting();
	});
	after(() => {
		enableUrlState();
	});

	describe('RoleSelectorFilter', () => {
		describe('shouldInclude', () => {
			it('should return true if the filter has no selected ids', () => {
				const record = [1, 1, 1]; // doesn't matter what the ids are here
				const sut = new RoleSelectorFilter({ serverData: { selectedRolesIds: [], isRecordsTruncated: false } });
				expect(sut.shouldInclude(record)).to.be.true;
			});

			it('should return true if the record role id is in the selected ids', () => {
				const record = [1, 1, 1];
				const sut = new RoleSelectorFilter({ serverData: { selectedRolesIds: [1, 3, 5], isRecordsTruncated: false } });
				expect(sut.shouldInclude(record)).to.be.true;
			});

			it('should return false if the record role id is not in the selected ids', () => {
				const record = [1, 1, 2];
				const sut = new RoleSelectorFilter({ serverData: { selectedRolesIds: [1, 3, 5], isRecordsTruncated: false } });
				expect(sut.shouldInclude(record)).to.be.false;
			});
		});

		describe('shouldReloadFromServer', () => {
			it('should return true if records are truncated', () => {
				const newRoleIds = [1, 3]; // a list that otherwise wouldn't trigger a server reload
				const sut = new RoleSelectorFilter({ serverData: { selectedRolesIds: [1, 3, 5], isRecordsTruncated: true } });
				expect(sut.shouldReloadFromServer(newRoleIds)).to.be.true;
			});

			it('should return true if the existing server query has items and the new list has no items', () => {
				// i.e. the filter was cleared
				const newRoleIds = [ /* empty */ ];
				const sut = new RoleSelectorFilter({ serverData: { selectedRolesIds: [1, 3, 5], isRecordsTruncated: false } });
				expect(sut.shouldReloadFromServer(newRoleIds)).to.be.true;
			});

			it('should return true if the new role ids list has an id that is not in the existing server query', () => {
				const newRoleIds = [1, 2, 5];
				const sut = new RoleSelectorFilter({ serverData: { selectedRolesIds: [1, 3, 5], isRecordsTruncated: false } });
				expect(sut.shouldReloadFromServer(newRoleIds)).to.be.true;
			});

			it('should return false if no filters were applied originally and data was not truncated', () => {
				const newRoleIds = [1, 3, 5];
				const sut = new RoleSelectorFilter({ serverData: { selectedRolesIds: null, isRecordsTruncated: false } });
				expect(sut.shouldReloadFromServer(newRoleIds)).to.be.false;

				// apply local changes - make sure it won't reload from server if it doesn't need to
				sut.selected = [1, 3, 5];
				expect(sut.shouldReloadFromServer([1, 3, 5])).to.be.false;
				expect(sut.shouldReloadFromServer([1, 3, 5, 7])).to.be.false;
				expect(sut.shouldReloadFromServer([])).to.be.false;
			});

			it('should return false if the new list is the same as the server query', () => {
				// added an explicit test for this because it could potentially happen often
				const newRoleIds = [1, 3, 5];
				const sut = new RoleSelectorFilter({ serverData: { selectedRolesIds: [1, 3, 5], isRecordsTruncated: false } });
				expect(sut.shouldReloadFromServer(newRoleIds)).to.be.false;
			});

			it('should return false if the new list is a subset of the server query', () => {
				const newRoleIds = [1, 3];
				const sut = new RoleSelectorFilter({ serverData: { selectedRolesIds: [1, 3, 5], isRecordsTruncated: false } });
				expect(sut.shouldReloadFromServer(newRoleIds)).to.be.false;
			});

			it('should use the server query ids to determine reload instead of the local ids', () => {
				const sut = new RoleSelectorFilter({ serverData: { selectedRolesIds: [1, 3, 5], isRecordsTruncated: false } });

				// apply local changes
				sut.selected = [1, 3];
				expect(sut.shouldReloadFromServer([1, 3])).to.be.false;
				// if it were using the newly applied local selection, this next line would be true
				expect(sut.shouldReloadFromServer([1, 3, 5])).to.be.false;
				expect(sut.shouldReloadFromServer([1, 3, 5, 6])).to.be.true;
			});
		});
	});

	describe('SemesterSelectorFilter', () => {
		describe('shouldInclude', () => {
			it('should return true if the filter has no selected ids', () => {
				const record = [1, 1, 1]; // doesn't matter what the ids are here
				const sut = new SemesterSelectorFilter({ serverData: {
					selectedSemestersIds: [],
					isRecordsTruncated: false,
					isOrgUnitsTruncated: false
				} });
				expect(sut.shouldInclude(record)).to.be.true;
			});

			it('should return true if the record orgUnit id has a selected semester id as one of its ancestors', () => {
				const record = [1, 1, 1]; // doesn't matter what the ids are here
				const sut = new SemesterSelectorFilter(
					{
						serverData:
						{
							selectedSemestersIds: [11, 12],
							isRecordsTruncated: false,
							isOrgUnitsTruncated: false,
						},
						orgUnitTree: { hasAncestorsInList: () => true },
					});

				expect(sut.shouldInclude(record)).to.be.true;
			});

			it('should return false if the record orgUnitId has no ancestors in the selected ids', () => {
				const record = [1, 1, 1]; // doesn't matter what the ids are here
				const sut = new SemesterSelectorFilter(
					{
						serverData:
						{
							selectedSemestersIds: [12, 13],
							isRecordsTruncated: false,
							isOrgUnitsTruncated: false,
						},
						orgUnitTree: { hasAncestorsInList: () => false },
					});

				expect(sut.shouldInclude(record)).to.be.false;
			});
		});

		describe('shouldReloadFromServer', () => {
			it('should return true if records are truncated', () => {
				const newSemesterIds = [1, 3]; // a list that otherwise wouldn't trigger a server reload
				const sut = new SemesterSelectorFilter({ serverData: {
					selectedSemestersIds: [1, 3, 5],
					isRecordsTruncated: true,
					isOrgUnitsTruncated: false
				} });
				expect(sut.shouldReloadFromServer(newSemesterIds)).to.be.true;
			});

			it('should return true if orgUnits are truncated', () => {
				const newSemesterIds = [1, 3]; // a list that otherwise wouldn't trigger a server reload
				const sut = new SemesterSelectorFilter({ serverData: {
					selectedSemestersIds: [1, 3, 5],
					isRecordsTruncated: false,
					isOrgUnitsTruncated: true
				} });
				expect(sut.shouldReloadFromServer(newSemesterIds)).to.be.true;
			});

			it('should return true if the existing server query has items and the new list has no items', () => {
				// i.e. the filter was cleared
				const newSemesterIds = [ /* empty */ ];
				const sut = new SemesterSelectorFilter({ serverData: {
					selectedSemestersIds: [1, 3, 5],
					isRecordsTruncated: false,
					isOrgUnitsTruncated: false
				} });
				expect(sut.shouldReloadFromServer(newSemesterIds)).to.be.true;
			});

			it('should return true if the new semester ids list has an id that is not in the existing server query', () => {
				const newSemesterIds = [1, 2, 5];
				const sut = new SemesterSelectorFilter({ serverData: {
					selectedSemestersIds: [1, 3, 5],
					isRecordsTruncated: false,
					isOrgUnitsTruncated: false
				} });
				expect(sut.shouldReloadFromServer(newSemesterIds)).to.be.true;
			});

			it('should return false if no filters were applied originally and data was not truncated', () => {
				const newSemesterIds = [1, 3, 5];
				const sut = new SemesterSelectorFilter({ serverData: {
					selectedSemestersIds: null,
					isRecordsTruncated: false,
					isOrgUnitsTruncated: false
				} });
				expect(sut.shouldReloadFromServer(newSemesterIds)).to.be.false;

				// apply local changes - make sure it won't reload from server if it doesn't need to
				sut.selected = [1, 3, 5];
				expect(sut.shouldReloadFromServer([1, 3, 5])).to.be.false;
				expect(sut.shouldReloadFromServer([1, 3, 5, 7])).to.be.false;
				expect(sut.shouldReloadFromServer([])).to.be.false;
			});

			it('should return false if the new list is the same as the old server query', () => {
				// added an explicit test for this because it could potentially happen often
				const newSemesterIds = [1, 3, 5];
				const sut = new SemesterSelectorFilter({ serverData: {
					selectedSemestersIds: [1, 3, 5],
					isRecordsTruncated: false,
					isOrgUnitsTruncated: false
				} });
				expect(sut.shouldReloadFromServer(newSemesterIds)).to.be.false;
			});

			it('should return false if the new list is a subset of the old server query', () => {
				const newSemesterIds = [1, 3];
				const sut = new SemesterSelectorFilter({ serverData: {
					selectedSemestersIds: [1, 3, 5],
					isRecordsTruncated: false,
					isOrgUnitsTruncated: false
				} });
				expect(sut.shouldReloadFromServer(newSemesterIds)).to.be.false;
			});

			it('should use the server query ids to determine reload instead of the local ids', () => {
				const sut = new SemesterSelectorFilter({ serverData: {
					selectedSemestersIds: [1, 3, 5],
					isRecordsTruncated: false,
					isOrgUnitsTruncated: false
				} });

				// apply local changes
				sut.selected = [1, 3];
				expect(sut.shouldReloadFromServer([1, 3])).to.be.false;
				// if it were using the newly applied local selection, this next line would be true
				expect(sut.shouldReloadFromServer([1, 3, 5])).to.be.false;
				expect(sut.shouldReloadFromServer([1, 3, 5, 6])).to.be.true;
			});
		});

		describe('urlState', () => {

			const key = new SemesterSelectorFilter({ serverData: {} }).persistenceKey;
			before(() => {
				enableUrlState();
			});
			after(() => disableUrlStateForTesting());

			it('should load the filter from the url state then save to it', async() => {

				setStateForTesting(key, '1,3,5');

				const sut = new SemesterSelectorFilter({ serverData: {
					selectedSemestersIds: null,
					isRecordsTruncated: false,
					isOrgUnitsTruncated: false
				} });

				expect(sut.selected).eqls([1, 3, 5]);

				sut.selected = [1];

				const params = new URLSearchParams(window.location.search);
				const values = params.get(sut.persistenceKey);

				expect(values).equals('1');
			});
		});
	});

	describe('OrgUnitSelectorFilter', () => {
		describe('shouldInclude', () => {
			it('should return true if the filter has no selected ids', () => {
				const record = [1, 1, 1]; // doesn't matter what the ids are here
				const sut = new OrgUnitSelectorFilter({ orgUnitTree: { selected: [] } });
				expect(sut.shouldInclude(record)).to.be.true;
			});

			it('should return true if the record orgUnit id has an ancestor in the selected orgUnit list', () => {
				const mockOrgUnitTree = {
					hasAncestorsInList: (/* any */) => true
				};
				const record = [1, 5, 5]; // doesn't matter what the ids are here
				const sut = new OrgUnitSelectorFilter({ orgUnitTree: mockOrgUnitTree });

				expect(sut.shouldInclude(record)).to.be.true;
			});

			it('should return false if the record orgUnitId has no ancestors in the selected ids', () => {
				const mockOrgUnitTree = {
					selected: [1, 2],
					hasAncestorsInList: (/* any */) => false
				};
				const record = [10, 5, 5]; // doesn't matter what the ids are here
				const sut = new OrgUnitSelectorFilter({ orgUnitTree: mockOrgUnitTree });

				expect(sut.shouldInclude(record)).to.be.false;
			});
		});

		describe('shouldReloadFromServer', () => {
			it('should return true if records are truncated', () => {
				const newOrgUnitIds = [1, 3]; // a list that otherwise wouldn't trigger a server reload
				const sut = new OrgUnitSelectorFilter({ serverData: {
					selectedOrgUnitIds: [1, 3, 5],
					isRecordsTruncated: true
				} });
				expect(sut.shouldReloadFromServer(newOrgUnitIds)).to.be.true;
			});

			it('should return true if ou tree is truncated', () => {
				const newOrgUnitIds = [1, 3]; // a list that otherwise wouldn't trigger a server reload
				const sut = new OrgUnitSelectorFilter({ serverData: {
					selectedOrgUnitIds: [1, 3, 5],
					isOrgUnitsTruncated: true
				} });
				expect(sut.shouldReloadFromServer(newOrgUnitIds)).to.be.true;
			});

			it('should return true if the existing selected list has items and the new list has no items', () => {
				// i.e. the filter was cleared
				const newOrgUnitIds = [/* empty */];
				const sut = new OrgUnitSelectorFilter({ serverData: {
					selectedOrgUnitIds: [1, 3, 5],
					isRecordsTruncated: false
				} });
				expect(sut.shouldReloadFromServer(newOrgUnitIds)).to.be.true;
			});

			it('should return true if the new orgUnitIds list has any id that has no ancestors in the existing list', () => {
				const mockOrgUnitTree = {
					// pretend 3 has no ancestors in the list
					hasAncestorsInList: (orgUnitId) => orgUnitId !== 3
				};

				const newOrgUnitIds = [1, 2, 3];
				const sut = new OrgUnitSelectorFilter({
					serverData: {
						selectedOrgUnitIds: [1, 2],
						isRecordsTruncated: false
					},
					orgUnitTree: mockOrgUnitTree
				});
				expect(sut.shouldReloadFromServer(newOrgUnitIds)).to.be.true;
			});

			it('should return false if no filters were applied originally and data was not truncated', () => {
				const newOrgUnitIds = [1, 2, 3];
				const mockOrgUnitTree = { selected: [] };
				const sut = new OrgUnitSelectorFilter({
					serverData: {
						selectedOrgUnitIds: null,
						isRecordsTruncated: false
					},
					orgUnitTree: mockOrgUnitTree
				});
				expect(sut.shouldReloadFromServer(newOrgUnitIds)).to.be.false;

				// apply local changes - make sure it won't reload from server if it doesn't need to
				mockOrgUnitTree.selected = [1, 3, 5];
				expect(sut.shouldReloadFromServer([1, 3, 5])).to.be.false;
				expect(sut.shouldReloadFromServer([1, 3, 5, 7])).to.be.false;
				expect(sut.shouldReloadFromServer([])).to.be.false;
			});

			it('should return false if the new list has only ids that had ancestors in the old list', () => {
				const mockOrgUnitTree = {
					hasAncestorsInList: (/* any */) => true
				};

				const newOrgUnitIds = [1, 2, 3];
				const sut = new OrgUnitSelectorFilter({
					serverData: {
						selectedOrgUnitIds: [1, 2],
						isRecordsTruncated: false
					},
					orgUnitTree: mockOrgUnitTree
				});
				expect(sut.shouldReloadFromServer(newOrgUnitIds)).to.be.false;
			});

			it('should use the server query ids to determine reload instead of the local ids', () => {
				const mockOrgUnitTree = {
					selected: [1, 3, 5],
					hasAncestorsInList: (orgUnitId, list) => list.includes(orgUnitId)
				};

				const sut = new OrgUnitSelectorFilter({
					serverData: {
						selectedOrgUnitIds: [1, 3, 5],
						isRecordsTruncated: false
					},
					orgUnitTree: mockOrgUnitTree
				});

				// apply local changes
				mockOrgUnitTree.selected = [1, 3];
				expect(sut.shouldReloadFromServer([1, 3])).to.be.false;
				// if it were using the newly applied local selection, this next line would be true
				expect(sut.shouldReloadFromServer([1, 3, 5])).to.be.false;
				expect(sut.shouldReloadFromServer([1, 3, 5, 6])).to.be.true;
			});
		});

		describe('urlState', () => {

			const key = new OrgUnitSelectorFilter({ serverData: {}, orgUnitTree: { selected : null } }).persistenceKey;
			before(() => {
				enableUrlState();
			});
			after(() => disableUrlStateForTesting());

			it('should load the filter from the url state then save to it', async() => {

				setStateForTesting(key, '1,3,5');

				const data = observable({ serverData: {
					selectedOrgUnitIds: [1, 3, 5],
					isRecordsTruncated: true
				},
				orgUnitTree: { selected : null }
				});
				const sut = new OrgUnitSelectorFilter(data);

				expect(sut.selected).to.eql([1, 3, 5]);

				data.orgUnitTree.selected = [1];

				const params = new URLSearchParams(window.location.search);
				const values = params.get(sut.persistenceKey);

				expect(values).equals('1');
			});
		});
	});
});
