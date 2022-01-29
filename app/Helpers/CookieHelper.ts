export default class CookieHelper {
  public static parseCookieString(string: string): { [key: string]: string } {
    const values = string
      .split(';')
      .map(v => v.split('='))
      .reduce((acc, value) => {
        const [key, ...rest] = value;
        acc[decodeURIComponent(key.trim())] = decodeURIComponent(rest.join('=').trim());
        return acc;
      }, {});

    return values;
  }
}
