import moment from 'moment';

// This function formats the date to a more readable form and also provides relative time.
export const formatDate = (date) => {
  if (!date) return "-";

  const formattedDate = moment(date).format('LLLL');

  const relativeTime = moment(date).fromNow();

  return `${formattedDate} (${relativeTime})`;
};




