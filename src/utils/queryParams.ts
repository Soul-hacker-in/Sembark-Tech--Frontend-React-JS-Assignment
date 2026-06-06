export interface ParsedParams {
  categories: string[];
  sort: string;
  search: string;
}

export const parseQueryParams = (searchString: string): ParsedParams => {
  const params = new URLSearchParams(searchString);
  const categories: string[] = [];
  
  const categoryVals = params.getAll('category');
  if (categoryVals.length > 0) {
    categoryVals.forEach(val => {
      if (val) categories.push(val);
    });
  }

  const sort = params.get('sort') || 'default';
  const search = params.get('q') || '';

  return {
    categories,
    sort,
    search,
  };
};

export const stringifyQueryParams = (params: {
  categories: string[];
  sort: string;
  search?: string;
}): string => {
  const urlParams = new URLSearchParams();
  
  params.categories.forEach(cat => {
    urlParams.append('category', cat);
  });
  
  if (params.sort && params.sort !== 'default') {
    urlParams.set('sort', params.sort);
  }
  
  if (params.search) {
    urlParams.set('q', params.search);
  }

  const queryString = urlParams.toString();
  return queryString ? `?${queryString}` : '';
};
