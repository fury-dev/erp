import moment = require("moment");

const generateTimestamp = () => moment().utc().format("YYYY:MM:DDTHH:mm:ss");

export { generateTimestamp };
