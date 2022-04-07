export const epochConverter = (epoch) => {
  var d = new Date();
  var currentEpoch = Math.floor(d.getTime() / 1000);
  var seconds = currentEpoch - epoch;

  if (seconds > 2 * 24 * 3600) {
    return "A few days ago";
  }

  if (seconds > 24 * 3600) {
    return "Yesterday";
  }

  if (seconds > 3600) {
    return "A few hours ago";
  }
  if (seconds > 1800) {
    return "Half an hour ago";
  }
  if (seconds > 60) {
    return Math.floor(seconds / 60) + " minutes ago";
  } else {
    return "A few seconds ago";
  }
};
