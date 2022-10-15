export function deployTx(code: string, value = "0x0") {
  return {
    data: code,
    to: undefined,
    value,
  };
}
