export function toKeyValArray(json) {
  if (json === null || json === undefined) {
    return null;
  }
  return Object.keys(json).map(key => ({ key: key, value: json[key] }));
}

export function fromKeyValArray(keyValueArray) {
  if (keyValueArray === null || keyValueArray === undefined) {
    return null;
  }
  return keyValueArray.reduce((acc, ele) => {
    acc[ele.key] = ele.value;
    return acc;
  });
}
