export default function getCookie(name: any): string {
  const cookieArr = document.cookie.split(";");

  for (let cookie of cookieArr) {
    const [cookieName, cookieValue] = cookie.trim().split("=");

    if (cookieName === name) {
      return cookieValue;
    }
  }

  return "";
}
