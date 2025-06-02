import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

import { CustomThrottlerGuard } from './guards/custom-throttler/custom-throttler.guard';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 120000, // Tempo de vida em milissegundos (2 minutos)
          limit: 10, // Máximo de 10 requisições por IP
        },
      ],
    }),
    HealthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}

// Resultado:
// Se você configurar ttl: 60 e limit: 10, o cliente
// poderá fazer até 10 requisições por minuto (60 segundos).
// Após atingir o limite, ele precisará esperar até o final do
// período de 60 segundos para que o contador seja resetado.
