import { parse, format, isValid } from 'date-fns';

export  default function formatDateRegionWise(dataDate, time = false, dateFormate = false , region = localStorage.getItem('fundRegion') ) {

    // const region = localStorage.getItem('fundRegion')
    // const region = 'united-states-of-america-(USA)';
    if (dateFormate) {
        return region === 'united-states-of-america-(USA)' ? 'm/d/Y' : 'd/m/Y';
    } else {
        if (dataDate) {
            const dateString = dataDate;
            const date = new Date(dateString);
            console.log(date, 'date date date')
            let formatString;

            if (time) {
                formatString = region === 'united-states-of-america-(USA)' ? 'MM/dd/yyyy hh:mm:ss a' : 'dd/MM/yyyy hh:mm:ss a';
            } else {
                formatString = region === 'united-states-of-america-(USA)' ? 'MM/dd/yyyy' : 'dd/MM/yyyy';
            }
            console.log(formatString, 'formatString')
            console.log(format(date, formatString), 'format(date, formatString)')

            return format(date, formatString);
        }
    }
}



export  function convertDateFormat  (dateString) {
  // Attempt to parse the date string assuming the format is dd/mm/yyyy
  const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
  
  // Check if the parsed date is valid
  if (isValid(parsedDate)) {
    // Format the parsed date to yyyy-mm-dd
    return format(parsedDate, 'yyyy-MM-dd');
  } else {
    // If the date is invalid, return the original date string
    return dateString;
  }
};

