export const throttlersConfig = {
  throttlers: [
    {
      ttl: 120000, // Tempo de vida em milissegundos (2 minutos)
      limit: 10, // Máximo de 10 requisições por IP
    },
  ],
};
