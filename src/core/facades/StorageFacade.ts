/**
 * Interface de abstração para operações de armazenamento persistente.
 * Permite trocar a implementação (AsyncStorage, SecureStore, etc) sem impactar o código que a utiliza.
 */
export interface StorageFacade {

  get(key: string): Promise<string | null>;

  set(key: string, value: string): Promise<void>;

  remove(key: string): Promise<void>;
}

