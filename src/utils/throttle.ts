export const throttle = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number,
) => {
  const now = () => new Date().getTime();
  const resetStartTime = () => (startTime = now());
  let timeout: NodeJS.Timeout;
  let startTime: number = now() - waitFor;

  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise((resolve) => {
      const timeLeft = startTime + waitFor - now();
      if (timeout) {
        clearTimeout(timeout);
      }
      if (startTime + waitFor <= now()) {
        resetStartTime();
        resolve(func(...args));
      } else {
        timeout = setTimeout(() => {
          resetStartTime();
          resolve(func(...args));
        }, timeLeft);
      }
    });
};
