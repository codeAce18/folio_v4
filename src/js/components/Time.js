import { mapEach } from "../utils/dom";
import Component from "../classes/Component";

export default class Time extends Component {
  constructor() {
    super({
      element: "body",
      elements: {
        hour: "[data-hour]",
        minute: "[data-minute]",
        period: "[data-period]", // Add period element
      },
    });

    this.updateTime();

    this.oldHour = this.formattedTime.hourValue;
    this.oldMinute = this.formattedTime.minuteValue;
    this.oldPeriod = this.formattedTime.period; // Track old period

    setInterval(this.updateTime.bind(this), 1000); // Bind `this` to the method
  }

  get currentTime() {
    const options = {
      hour: "numeric",
      minute: "numeric",
      // Enable AM/PM
      hour12: true, 
      // Lagos timezone
      timeZone: "Africa/Lagos",
    };

    const time = new Intl.DateTimeFormat([], options).format(new Date());

    return time;
  }

  get formattedTime() {
    const time = this.currentTime; // e.g., "2:30 PM"
    const [timePart, period] = time.split(" "); // Split into "2:30" and "PM"
    const [hourValue, minuteValue] = timePart.split(":"); // Split into "2" and "30"

    return {
      hourValue,
      minuteValue,
      period, // Include period (AM/PM)
    };
  }

  updateTime() {
    const { hour, minute, period } = this.elements; // Add period element
    const { hourValue, minuteValue, period: newPeriod } = this.formattedTime; // Destructure period

    mapEach(hour, (element) => {
      if (this.oldHour !== hourValue) {
        element.classList.add("flash");
        setTimeout(() => {
          element.innerHTML = hourValue;
        }, 500);

        setTimeout(() => {
          element.classList.remove("flash");
        }, 1000);
      }
    });

    mapEach(minute, (element) => {
      if (this.oldMinute !== minuteValue) {
        element.classList.add("flash");

        setTimeout(() => {
          element.innerHTML = String(minuteValue).slice(0, 2);
        }, 500);

        setTimeout(() => {
          element.classList.remove("flash");
        }, 1000);
      }
    });

    // Update the period (AM/PM)
    mapEach(period, (element) => {
      if (this.oldPeriod !== newPeriod) {
        element.classList.add("flash");

        setTimeout(() => {
          element.innerHTML = newPeriod;
        }, 500);

        setTimeout(() => {
          element.classList.remove("flash");
        }, 1000);
      }
    });

    this.oldHour = hourValue;
    this.oldMinute = minuteValue;
    this.oldPeriod = newPeriod; // Track the old period for comparison
  }
}