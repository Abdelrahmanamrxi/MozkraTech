export const getStartOfDay = (date) => {
  const d = new Date(date);
  // This one line sets hours, mins, secs, and ms to 0
  d.setHours(0, 0, 0, 0);
  return d;
};

export const getDayDifference = (dateA, dateB) => {
  const diffMs = getStartOfDay(dateA).getTime() - getStartOfDay(dateB).getTime();
  // Using Math.abs to ensure positive integers, though order usually matters here
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
};


  export const formatLocalDateTime = (date) => {
  const pad2 = (value) => String(value).padStart(2, "0")
  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}T${pad2(date.getUTCHours())}:${pad2(date.getUTCMinutes())}:${pad2(date.getUTCSeconds())}`
}
  export  const toLocalTime = (date,offsetMinutes) => new Date(date.getTime() - offsetMinutes * 60000)
  

  export const toLocalTimeForAI = (date, offsetMinutes) => 
  new Date(date.getTime() + offsetMinutes * 60000)


