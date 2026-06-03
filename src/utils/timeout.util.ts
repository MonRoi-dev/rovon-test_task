//Утилита для рассчета таймаута
export function withTimeoutSignal<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  ms: number,
  errorMessage = 'Timeout exceeded'
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort(new Error(errorMessage));
  }, ms);

  return fn(controller.signal).finally(() => {
    clearTimeout(timeoutId);
  });
}
