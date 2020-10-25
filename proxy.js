export function proxy(ui, mocks) {
  return new Proxy(ui, {
    get(obj, key) {
      return key in mocks ? mocks[key]() : obj[key];
    },
  });
}
