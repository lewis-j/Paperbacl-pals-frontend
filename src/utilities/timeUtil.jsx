const differenceFromToday = (date) => {
  const _date = new Date(date);
  const today = new Date();
  const diffInMiliseconds = Math.abs(today.getTime() - _date.getTime());

  return {
    seconds: Math.floor(diffInMiliseconds / 1000),
    minutes: Math.floor(diffInMiliseconds / (1000 * 60)),
    hours: diffInMiliseconds / (1000 * 3600),
    days: diffInMiliseconds / (1000 * 3600 * 24),
  };
};
export const getTimeFromToday = (date) => {
  const { seconds, minutes, hours, days } = differenceFromToday(date);

  if (seconds < 60) return `${Math.floor(seconds)} seconds ago`;
  if (minutes < 60) return `${Math.floor(minutes)} minutes ago`;
  if (hours < 24) return `${Math.floor(hours)} hours ago`;
  if (days < 7) return `${Math.floor(days)} days ago`;

  const weeks = days / 7;
  if (weeks <= 4) return `${Math.floor(weeks)} weeks ago`;

  return dayMonthFormat(date);
};

export const dayMonthFormat = (date) => {
  let _date = date;
  if (typeof date === "string") {
    _date = new Date(date);
  }
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(_date);
};

export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";

  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      // Today - show time
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 48) {
      // Yesterday
      return "Yesterday";
    } else {
      // Show date
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
    }
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return "";
  }
};
