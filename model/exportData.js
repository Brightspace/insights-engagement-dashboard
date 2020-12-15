import exportFromJSON from 'export-from-json';
import { toJS } from 'mobx';

export class ExportData {
	static userDataToCsv(data, headers) {
		return this.exportToCsv(toJS(data), headers);
	}

	static exportToCsv(formattedData, headers) {
		const jsonArrayData = formattedData.map((data) => {
			return headers.reduce((acc, val, i) => ({ ...acc, [val]: data[i] }), {});
		});
		exportFromJSON({ data: jsonArrayData, fileName: 'engagement', exportType: exportFromJSON.types.csv });
	}
}
