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


export const formatName = (firstName, lastName, nickname) => {
  return nickname == "" ? firstName + " " + lastName : firstName + ' "' + nickname + '" ' + lastName;
};