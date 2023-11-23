import { has, forEach, isArray, head, isObject } from 'lodash'

function removeObjectKey(object, key) {
	return {
		id: object.id,
		...object[key],
	};
}

/**
 * Modify the response body according to reponse transform settings
 *
 * @param {object} transforms
 * @param {boolean} transforms.removeAttributesKey
 * @param {boolean} transforms.removeDataKey
 * @param {object} data
 * @returns {object} transformed body data
 */
function modifyResponseBodyData(transforms, data, debug) {
    
	// removeAttributeKey specific transformations
	if (has(transforms, 'removeAttributesKey')) {
		// single
		if (has(data, 'attributes')) {
			return modifyResponseBodyData(transforms, removeObjectKey(data, 'attributes'), debug);
		}

		// collection
		if (isArray(data) && data.length && has(head(data), 'attributes')) {
			return data.map((e) => modifyResponseBodyData(transforms, e, debug));
		}
	}

	// fields
	forEach(data, (value, key) => {
		if (!value) {
			return;
		}

		// removeDataKey specific transformations
		if (has(transforms, 'removeDataKey')) {
			// single
            if (isObject(value)) {
                data[key] = modifyResponseBodyData(transforms, value, debug);
			// many
            } else if (isArray(value)) {
				data[key] = value.map((field) => modifyResponseBodyData(transforms, field, debug));
			}
		}

		// relation(s)
		if (has(value, 'data')) {
			let relation = null;
			// single
			if (isObject(value.data)) {
				relation = modifyResponseBodyData(transforms, value.data, debug);
			}

			// many
			if (isArray(value.data)) {
				relation = value.data.map((e) => modifyResponseBodyData(transforms, e, debug));
			}

			if (has(transforms, 'removeDataKey')) {
				data[key] = relation;
			} else {
				data[key]['data'] = relation;
			}
		}

		// single component
		if (has(value, 'id')) {
			data[key] = modifyResponseBodyData(transforms, value, debug);
		}

		// repeatable component & dynamic zone
		if (isArray(value) && has(head(value), 'id')) {
			data[key] = value.map((p) => modifyResponseBodyData(transforms, p, debug));
		}

		// single media
		if (has(value, 'provider')) {
			return;
		}

		// multi media
		if (isArray(value) && has(head(value), 'provider')) {
			return;
		}
	});
	if (data?.__typename === 'ChartResponseSeries' || data?.__typename === 'DetailedCostsOverviewWidgetDataResponse') data.data = JSON.parse(data.data);

	return data;
}

const sanitizeStrapiData = (data, debug) => {
    return JSON.parse(
        JSON.stringify(modifyResponseBodyData({ removeAttributesKey: true, removeDataKey: true }, JSON.parse(JSON.stringify(data))), (k, v) => k === '__typename' ? undefined : v)
            .replace(/{"id":"([0-9]+)"}/g, '$1')
    )
}

export default sanitizeStrapiData