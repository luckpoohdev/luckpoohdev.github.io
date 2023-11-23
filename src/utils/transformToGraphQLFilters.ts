const apolloFilterMap = {
  '=': 'eq',
  '!=': 'ne',
  '<': 'lt',
  '<=': 'lte',
  '>': 'gt',
  '>=': 'gte',
  'equals': 'eq',
  'notEquals': 'ne',
  'lessThan': 'lt',
  'lessThanOrEqual': 'lte',
  'greaterThan': 'gt',
  'greaterThanOrEqual': 'gte',
  'isAnyOf': 'in',
  'notIsAnyOf': 'notIn',
  'contains': 'containsi', // Assuming case insensitive. Change to 'contains' for case sensitive.
  'notContains': 'notContainsi', // Assuming case insensitive. Change to 'notContains' for case sensitive.
  'startsWith': 'startsWith',
  'endsWith': 'endsWith',
  'isEmpty': 'null',
  'isNotEmpty': 'notNull',
  'is': 'dateEq',
  'not': 'dateNe',
  'after': 'dateGt',
  'onOrAfter': 'dateGte',
  'before': 'dateLt',
  'onOrBefore': 'dateLte',
};

function transformToGraphQLFilters(dataGridFilters) {
    // This will hold our filter structure for Apollo.
    let graphqlFilters = [];
  
    // Loop through all the DataGridPro filters.
    dataGridFilters.items.forEach(filter => {
      const field = filter.columnField;
      const operator = apolloFilterMap[filter.operatorValue];
  
      // Ensure operator exists in our map.
      if (!operator) {
        console.warn(`Unknown filter operator: ${filter.operatorValue}`);
        return;
      }
  
      const value = filter.value;
  
      // Create the individual filter object.
      const individualFilter = { [field]: { [operator]: value } };
  
      // Add it to our list.
      graphqlFilters.push(individualFilter);
    });
  
    // Use the linkOperator from DataGridPro filters to determine the logic type.
    const logicType = dataGridFilters.linkOperator;
  
    if (graphqlFilters.length === 1) {
      // If there's only one filter, we just use it directly.
      graphqlFilters = graphqlFilters[0];
    } else if (graphqlFilters.length > 1) {
      // If there are multiple filters, we wrap them in the logic type.
      graphqlFilters = { [logicType]: graphqlFilters };
    } else {
      // If no filters are applied, return an empty object.
      graphqlFilters = {};
    }
  
    if (graphqlFilters.length > 0) {
      graphqlFilters = [{ [logicType]: graphqlFilters }];
    }
    return graphqlFilters;
  }

  export default transformToGraphQLFilters;