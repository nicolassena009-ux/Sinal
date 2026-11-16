> Escopo atual (13/11/2026): somente Missão 01 — Engasgo está disponível no lançador. As outras quatro missões, recursos, contrato e registro modular permanecem preservados para etapas futuras. O texto abaixo registra a entrega anterior.

# SINAL — cinco missões / protótipo integrado

A versão atual preserva a Missão 01 e acrescenta quatro protótipos em um único projeto Phaser 3 + TypeScript, com ponte React. Selecione a missão e Kids ou Teens no menu.

## Executar

```sh
npm ci
npm run dev -- --port 5190
```

Abra http://127.0.0.1:5190. Para produção: `npm run build`; sirva `dist/` por HTTP. Não abra via file://. Não há serviço externo obrigatório em runtime. Dependências e instalação dos navegadores de teste exigem download inicial.

Controles: WASD/setas ou joystick; E/Espaço/botão para conversar e interagir; Esc para pausa. Aproxime-se do objeto indicado, leia a ação e confirme. Nas novas missões, recolha recursos e caminhe até o destino para entregá-los.

## Integração

```tsx
import {SinalGame} from './src/integration/SinalGame';
import {defaults} from './src/integration/contract';
const input = defaults('kids', 'seizure'); // mantenha a referência estável no React
<SinalGame input={input} onEvent={event => console.log(event)} />
```

O host é dono do avatar e do progresso. Objetivos recebidos em `progress` não pulam automaticamente etapas de uma nova tentativa. O adaptador standalone mantém somente um resultado de desenvolvimento no localStorage. O componente não grava progresso do site.

| missionId | phaseId |
|---|---|
| choking | cafeteria |
| seizure | classroom |
| cardiac_arrest | corridor |
| burns | kitchen |
| trauma | courtyard |

Eventos versão 1: loaded, mission-started, objective-completed, educational-result, mission-completed, return-menu, recoverable-error. Todos incluem o missionId correto; resultados incluem `clinicalReview: 'pending'`.

## Validação e entrega

```sh
npm test
npm run build
npx playwright install chromium
npm run test:browser
```

Veja [RELATORIO-CINCO-MISSOES.md](docs/RELATORIO-CINCO-MISSOES.md) para arquitetura, testes, limitações e próximos passos. Documentos Visual02 são históricos e não certificam a versão atual. Personagens, recursos e novas cenas são provisórios. Nenhuma missão recebeu aprovação clínica final.
