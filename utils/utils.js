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
}

exports.Utils = Utils;
