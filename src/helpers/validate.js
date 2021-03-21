const shortData = (data) => {
  try {
    if (data === null || data === undefined) return null;
    const length = 20;
    const trimmedData = `${data.substring(0, length)}`;
    return trimmedData;
  } catch (error) {
    return error.toString();
  }
};

export { shortData };
