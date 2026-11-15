# RELATÓRIO INTERMEDIÁRIO — ETAPA 02.1
## Correção Complementar de Estabilidade: Resolução de Bloqueio em Trauma e Validação de Regressões

**Data/Hora:** 15/11/2026  
**Status da Etapa:** CONCLUÍDA COM SUCESSO

---

### 1. Diagnóstico e Causa Raiz (Prioridade 1 — Trauma)
Durante a análise técnica aprofundada da cena do Pátio Esportivo (`Courtyard.ts`), constatou-se que:
1. **Espaçamento e Hitbox da Bicicleta Caída:**
   - O footprint original da bicicleta caída em `src/missions/trauma.ts` media 156px de largura e 38px de altura, estendendo-se por quase todo o canal entre Sofia caída e a professora.
   - Sofia parava em `x = 751` e a bicicleta em `x = 899`, gerando um vão livre de apenas 10px entre as caixas de colisão.
   - Com diâmetro de colisão de 28px para os personagens (raio de 14px), a passagem física era matematicamente impossível.
2. **Destino da Professora e Rota no Grid de Navegação:**
   - Na fase de avaliação (`initialAssessment`), o destino solicitado para Clara era `{ x: 798, y: 650 }`, que ficava sobreposto à hitbox de Sofia caída (`x` de 699 a 803), tornando `walkable(goal)` falso e cancelando a rota da professora com status `blocked`.
   - O grid de navegação da professora (`this.teacher.grid.obstacles`) não era sincronizado dinamicamente com os obstáculos reais no `update()`.
3. **Resiliência do Watchdog:**
   - O watchdog anterior de `busy && t > 18` simplesmente limpava a flag `busy` sem resolver a transição de estado, causando softlock silencioso caso qualquer diálogo ou movimentação ultrapassasse o tempo limite.

---

### 2. Correções Estruturais Implementadas
1. **Recalibração do Footprint e Posicionamento da Queda:**
   - `bikeFootprint` ajustado para `{ w: 120, h: 26 }` caído, refletindo fielmente a linha de contato no chão em 2.5D.
   - Sofia pousa em `x = 740, y = 650` e a bicicleta desliza para `x = 890, y = 650`. O vão livre resultante é de 54px (largamente superior aos 28px necessários).
2. **Navegação Inteligente e Desvio da Professora:**
   - Destino de Clara na queda ajustado para `{ x: 780, y: 575 }` (visão frontal ampla e desimpedida).
   - Destino de atendimento de Clara calibrado para `{ x: 740, y: 605 }` (posição de socorrista ao lado do tronco de Sofia, 100% walkable).
   - Inclusão de `teacherObstacles()` sincronizado no `update()`.
   - Detecção de chegada inclusiva (`claraArrived`), considerando proximidade clínica a Sofia mesmo se Teddy estiver nas imediações.
3. **Watchdog Protetor de Estado:**
   - Watchdog expandido para 25 segundos, assegurando avanço seguro das fases clínicas sem interrupção abrupta de cutscenes legítimas.

---

### 3. Verificações e Testes Executados
- **Testes Unitários:** 112 testes passando (`vitest run`).
  - `tests/trauma.test.ts`: 7 testes (incluindo testes de vão mínimo de 40px, navegação de Clara e resiliência com Teddy em 4 posições arbitrárias).
  - `tests/stability-step02.test.ts`: 41 testes de não-regressão de colisão, paredes e deslizamento (todos verdes).
- **Testes Reais em Navegador (Google Chrome):**
  - `tests/browser/trauma.spec.ts`: 2 testes de ponta a ponta (Desktop 1365x900 e Mobile 844x390 touch).
  - Ambas as suítes passaram sem erros de console (`0 page errors`).
  - 13 capturas de tela atualizadas em `docs/trauma/`.
- **Compilação e Tipagem:** `tsc --noEmit && vite build` concluído com sucesso em 3.8s.

---

### 4. Arquivos Modificados
- `sinal-cinco-missoes/engasgo/src/missions/trauma.ts`
- `sinal-cinco-missoes/engasgo/src/scenes/Courtyard.ts`
- `sinal-cinco-missoes/engasgo/tests/trauma.test.ts`

---

### 5. Ponto de Restauração
- Alterações validadas e prontas para commit atômico no controle de versão local.
- Prosseguindo automaticamente para a **ETAPA 03**.
