// Para links montados à mão (fora do <Link>, que já põe o basePath sozinho).
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function caminho(p: string): string {
  return `${BASE_PATH}${p}`;
}
