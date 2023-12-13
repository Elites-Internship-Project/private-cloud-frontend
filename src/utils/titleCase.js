export const titleCase = (text) => {
  if (text !== "") {
    let charCode = text.charCodeAt(0);
    if (charCode > 96 && charCode < 123) charCode = charCode - 32;
    const titleStr = String.fromCharCode(charCode) + text.substring(1);
    return titleStr;
  }
};
