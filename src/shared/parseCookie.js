let parseCookie = () => {
  let cookie = document.cookie;
  let parsedCookies = {};

  if (cookie.length > 0) {
    let cookies = cookie.split(";");

    for (let index in cookies) {
      let trimmed = cookies[index].trim();
      let parsedString = trimmed.split("=");
      parsedCookies[parsedString[0]] = parsedString[1];
    }

    return parsedCookies;
  } else {
    console.log("parseCookie: Cookie is empty");
  }
};

export default parseCookie;
