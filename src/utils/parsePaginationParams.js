export const parsePaginationParams = (query) => {
    const { page, perPage } = query;
  
    return {
      page: parseNumber(page, 1),
      perPage: parseNumber(perPage, 10),
    };
  };



const parseNumber = (number, defaultValue) => {
    const isString = typeof number === 'string';
    if (!isString) return defaultValue;
  
    const parsedNumber = parseInt(number);
    if (Number.isNaN(parsedNumber)) {
      return defaultValue;
    }
  
    if (parsedNumber < 1) {
      return defaultValue;
    }

    return parsedNumber;
  };
  