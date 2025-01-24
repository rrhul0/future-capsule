console.log('running cron job')

const now = new Date();
const currentHour = new Date(now.setMinutes(0, 0, 0));
const daysLater = new Date(currentHour.getTime() + 1*24 * 60 * 60 * 1000);

console.log(currentHour.toISOString(),daysLater.toISOString())