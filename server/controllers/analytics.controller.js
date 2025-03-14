import URLmodel from "../models/urls.model.js";

const months = [
  "Janurary",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
function formatData(data, category) {
  const total = data.totalVisits;
  return Object.entries(data[category]).map(([name, count]) => {
    const percentage = ((count / total) * 100).toFixed(2) + "%";
    return { name, views: percentage };
  });
}

function formatVisitCounts(visitCounts) {
  return Object.entries(visitCounts).map(([name, count]) => ({
    name: name,
    views: count,
  }));
}
class AnalyticsControllerClass {
  async fetchAnalytics(req, res) {
    try {
      const prismaAnalytics = await URLmodel.find({
        ownerId: req.user.id,
      }).populate("visits");
      // Initialize a data structure to store the counts
      const visitStats = {
        browsers: {},
        devices: {},
        os: {},
        totalVisits: 0, // This will track the total visits for the user
      };
      const visitCounts = {
        Janurary: 0,
        February: 0,
        March: 0,
        April: 0,
        May: 0,
        June: 0,
        July: 0,
        August: 0,
        September: 0,
        October: 0,
        November: 0,
        December: 0,
      };
      // Loop through the urls and visits to populate distinct counts and total visits
      const currentDate = new Date();
      prismaAnalytics.forEach((url) => {
        url.visits.forEach((visit) => {
          // Increase total visits count
          visitStats.totalVisits++;
          const date = new Date(visit.visitedAt);
          if (currentDate.getFullYear() === date.getFullYear()) {
            const monthYear = months[date.getMonth()];

            visitCounts[monthYear]++;
          }
          // Count visits by browser
          if (visit.browser) {
            if (visitStats.browsers[visit.browser]) {
              visitStats.browsers[visit.browser]++;
            } else {
              visitStats.browsers[visit.browser] = 1;
            }
          }

          // Count visits by device
          if (visit.device) {
            if (visitStats.devices[visit.device]) {
              visitStats.devices[visit.device]++;
            } else {
              visitStats.devices[visit.device] = 1;
            }
          }

          // Count visits by OS
          if (visit.os) {
            if (visitStats.os[visit.os]) {
              visitStats.os[visit.os]++;
            } else {
              visitStats.os[visit.os] = 1;
            }
          }
        });
      });
      const browser = formatData(visitStats, "browsers");
      const devices = formatData(visitStats, "devices");
      const os = formatData(visitStats, "os");
      const monthAnalytics = formatVisitCounts(visitCounts);
      return res.json({
        success: true,
        message: "Analytics is fetched",
        // data: prismaAnalytics,
        monthAnalytics,
        totalVisits: visitStats.totalVisits,
        browser,
        devices,
        os,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong", error });
    }
  }
}
const analyticsController = new AnalyticsControllerClass();
export default analyticsController;