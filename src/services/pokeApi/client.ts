export async function fetcher<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro na API HTTP: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Falha ao buscar dados: ${error.message}`);
    }
    throw new Error('Ocorreu um erro desconhecido na requisição');
  }
}
