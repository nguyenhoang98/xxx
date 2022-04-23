export const formatCurrency = value => {
  if (!value) {
    if (typeof value === 'number') return 0;
    return '';
  }

  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const isObj = obj => {
  return typeof obj === 'object' && obj !== null;
};

export const isEmptyObj = obj => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

export const convertFlatArray = (listCategory = [], newList = [], n = 0) => {
  listCategory.forEach(item => {
    // eslint-disable-next-line no-param-reassign
    item.level = n;
    newList.push(item);

    Object.keys(item).forEach(attr => {
      if (
        // eslint-disable-next-line no-prototype-builtins
        item.hasOwnProperty(attr) &&
        item[attr] !== null &&
        typeof item[attr] === 'object'
      ) {
        convertFlatArray(item[attr], newList, n + 1);
      }
    });
  });
  return newList;
};

export default function downloadFile(reportName, data) {
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${reportName}`);
  document.body.appendChild(link);
  link.click();
}
