export const formatDateRange = (start_date, end_date) => {
  let start = new Date(start_date);
  console.log(start_date);
  let end = new Date(end_date);
  console.log(end_date);
  let dateString = start.getDate().toString() + ".";
  if (start.getMonth !== end.getMonth || start.getFullYear !== end.getFullYear) {
    dateString += (start.getMonth() + 1).toString() + ".";
  }
  if (start.getFullYear !== end.getFullYear) {
    dateString += start.getFullYear().toString();
  }
  dateString += "–" + end.getDate().toString() + "." + (end.getMonth() + 1).toString() + "." + end.getFullYear().toString();
  return dateString;
}
