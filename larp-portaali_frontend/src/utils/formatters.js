export const formatDateRange = (start_date, end_date) => {
  let start = new Date(start_date);
  let end = new Date(end_date);
  let dateString = "";
  if (start_date === end_date) {
    dateString = start.getDate().toString() + "." + start.getMonth().toString() + "." + start.getFullYear().toString();
  } else {
    dateString = start.getDate().toString() + ".";
    if (start.getMonth !== end.getMonth || start.getFullYear !== end.getFullYear) {
      dateString += (start.getMonth() + 1).toString() + ".";
    }
    if (start.getFullYear !== end.getFullYear) {
      dateString += start.getFullYear().toString();
    }
    dateString += "–" + end.getDate().toString() + "." + (end.getMonth() + 1).toString() + "." + end.getFullYear().toString();
  }
  return dateString;
};

export const formatDateTime = (timestamp) => {
  let dateTime = new Date(timestamp);
  return `${dateTime.getDate()}.${dateTime.getMonth()}.${dateTime.getFullYear()} ${dateTime.getHours()}:${dateTime.getMinutes()}`;
};

export const formatName = (firstName, lastName, nickname = "") => {
  return nickname == "" ? firstName + " " + lastName : firstName + ' "' + nickname + '" ' + lastName;
};

export const truncateString = (string, len) => {
  if (string.length <= len) {
    return string;
  } else {
    string = string.substring(0,len);
    while (string.substring(string.length-1, string.length) != " ") {
      string = string.substring(0, string.length-1);
    }
    return string.substring(0, string.length-1) + "... ";
  }
};