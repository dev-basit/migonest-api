class Utils {
  static generateCode(digits = 6) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < digits; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }

  static getTimeInUnixTimestamp() {
    return Math.floor(new Date().getTime() / 1000).toString();
  }

  static convertFromUnixTimeSeconds = (unixDate) => {
    const date = new Date(unixDate * 1000);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };
}

exports.Utils = Utils;
