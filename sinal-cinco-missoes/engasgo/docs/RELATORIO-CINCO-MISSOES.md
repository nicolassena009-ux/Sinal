# Entrega — cinco missões integradas

## Escopo e preservação

Projeto derivado do Visual02, sem reescrever Phaser nem substituir os três PNGs aprovados. A missão anterior e seus documentos foram preservados. Checkpoint Git anterior à extração: `1e66501`, tag `stable-visual02-pre-five-missions`. O arquivo Git bundle acompanha a entrega para recuperação desse estado. O ZIP não depende da pasta node_modules desta máquina.

## Estado por missão

| Missão | Jogabilidade implementada | Arte / clínica / pendências |
|---|---|---|
| Engasgo | Exploração, conversa, piora, ajuda, chamada simulada, sequência existente e encerramento. Teddy não vai mais sozinho para uma posição distante. | Cenário Visual02 preservado; atlas provisório; caso e técnica aguardam revisão clínica. |
| Convulsão | Sala com carteiras, reconhecimento, professora, transporte de mochila, comunicação e acompanhamento. | Fundo original provisório; mochila representativa; pose no chão simplificada. Sem contenção, objetos na boca ou treino de técnica. |
| Parada cardíaca | Corredor, urgência, chamada simulada, adulto, transporte de DEA e acesso da equipe. | Fundo original provisório; equipamento simbólico; sem compressões, pás, choque ou alegação de recuperação. |
| Queimaduras | Cozinha supervisionada, reconhecimento de calor, adulto, sinalização, indicação da pia e relato. | Fundo original provisório; sinalização simbólica; sem técnica, duração ou receita de tratamento. |
| Trauma | Pátio, observação, adulto, retirada da bola, comunicação e proteção do acesso. | Fundo original provisório; bola representativa; sem mobilizar a vítima nem ensinar imobilização. |

Todas são protótipos jogáveis para avaliação de interação. Kids e Teens compartilham as ações ambientais nas quatro novas cenas; diferenciação clínica Teens ficará condicionada à revisão. Os resultados das cinco missões permanecem `clinicalReview: 'pending'`.

## Arquitetura e arquivos

- `src/integration/contract.ts`, `src/game.ts`, `src/scenes/registry.ts`: contrato de cinco IDs, validação de pares missão/fase, carregamento sob demanda e cancelamento de montagem tardia.
- `src/core/mission.ts`, `src/missions/catalog.ts`: interfaces WorldDefinition, MissionLogic, MissionPresentation e conclusão; apresentação injetada no HUD.
- `src/core/movement.ts`, `navigation.ts`, `camera.ts`: limites por mundo; colisão contínua, A* e câmera compartilhados.
- `src/ui/Hud.ts`: apresentação e conclusão genéricas; reset do joystick respeita o pointerId de origem.
- `src/missions/choking/presentation.ts`: apresentação específica do engasgo extraída do HUD.
- `src/scenes/Cafeteria.ts`: conversa/exploração como gatilho e preparação com professora navegando; Teddy conserva sua posição. Rota impossível devolve controle.
- `src/world/supportWorlds.ts`: quatro mapas, props, footprints, pontos de objetivo e dimensões distintas.
- `src/scenes/SupportScene.ts`: base compartilhada de exploração, interação por proximidade, transporte de recurso, eventos e encerramento. Classroom, Corridor, Kitchen e Courtyard registram cenas distintas.
- `src/missions/support.ts`: seis objetivos específicos e resultado de cada missão nova, sem quiz.
- `src/characters/Actor.ts`: mesmo ponto dos pés, controlador de animação e opção de atlas oficial; pose no chão local não desloca o ponto físico.
- `src/main.ts`: seleção das cinco missões sem editar código.
- `public/assets/worlds/`: quatro fundos novos originais em 1536×1024. Não são recortes ampliados dos conceitos enviados.
- `tests/`: cobertura unitária, browser e fixture React StrictMode.

## Camadas, colisão e navegação

Chão e arquitetura são frames separados do fundo. Mobiliário é independente; personagens e móveis ordenam profundidade pelo Y dos pés. Marcas de chão ficam atrás; seta e recurso carregado ficam na camada de interface. Os novos fundos mantêm a área navegável sem mobiliário pintado, evitando móveis sem colisão. Paredes são limites explícitos de cada mapa.

A* usa os mesmos footprints e raio de 14 unidades da movimentação. Cada segmento é validado; diagonais não cortam quinas. O seguidor verifica novamente os segmentos ao andar e recalcula quando necessário. Destino inválido não teleporta o NPC. Os mapas possuem passagens livres verificadas entre spawn, objetivos e pontos de assistência. Colisões são no plano dos pés, não na silhueta inteira do sprite.

Nas novas cenas, Teddy nunca recebe goTo ao interagir. A professora navega até um ponto livre próximo da vítima. O encerramento requer sua proximidade; bloqueio de rota não prende o protagonista. No corredor, ela se aproxima desde o incidente. Isso não simula ou valida a qualidade do atendimento clínico.

## Teddy oficial

O contrato aceita `avatar.atlas.image` e `avatar.atlas.data`. Frames seguem `estado_direção_índice`, com fallback para idle; ancoragem inferior e animação local ficam separadas do movimento. A arte atual continua identificada como provisória. Escala do atlas oficial e acessórios finais precisam ser calibrados com arquivos reais. O atlas de estudo não representa oito direções completas nem gestos clínicos finais.

## Limitações e próxima etapa

1. Revisão formal da Enfermagem em todas as cinco missões; validar linguagem por faixa etária, narrativa e encaminhamento. Conteúdo novo não certifica competência.
2. Integrar atlas oficial do Teddy/NPCs, poses próprias de queda e atendimento, equipamentos e pequenos objetos finais. Alguns recursos ainda são símbolos com rótulo.
3. Polir mobiliário específico da sala, bancos do corredor/pátio e bancada da cozinha; atualmente reutilizam o kit coerente do refeitório.
4. Novas cenas ainda não têm trilha/efeitos dedicados. Câmera e HUD compartilhados funcionam, mas exigem avaliação em aparelhos físicos, especialmente celulares pequenos.
5. Testes browser usam Chromium e fixtures de aproximação para verificar toda a narrativa. Não substituem teste humano de cada percurso, ergonomia ou todas as combinações de avatar.
6. O pacote de conceitos das quatro cenas não foi recebido; os fundos foram produzidos a partir da direção textual e do estilo aprovado, sujeitos a aprovação visual.

## Referências de conteúdo para revisão

As fontes abaixo delimitam o conteúdo; não substituem aprovação da equipe clínica nem tornam o protótipo validado:

- CDC, primeiros cuidados em crises: https://www.cdc.gov/epilepsy/first-aid-for-seizures/
- AHA, suporte básico adulto 2025: https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-basic-life-support
- Cruz Vermelha, queimaduras: https://www.redcross.org/take-a-class/resources/learn-first-aid/burns
- Cruz Vermelha, primeiros cuidados: https://www.redcross.org/take-a-class/first-aid/performing-first-aid/first-aid-steps
- AHA/Red Cross, primeiros cuidados 2024: https://cpr.heart.org/en/resuscitation-science/2024-first-aid-guidelines
`avatar.atlas.height` permite calibrar altura (70–180 unidades); `avatar.accessoryImages` recebe URLs por chave de acessório. Cor customizada usa tint global provisório; recoloração seletiva da roupa depende da arte final. Configurações do HUD são copiadas na montagem, sem mutar o objeto de entrada do host.

## Validação executada em 13/11/2026

- `npm run build`: TypeScript e Vite passaram. Aviso remanescente: chunk da engine Phaser acima de 500 kB; carregado sob demanda.
- `npm test`: 49 testes unitários passaram (17 núcleo/missão, 11 navegação do refeitório, 21 contrato e novas missões).
- Playwright: 20 testes passaram na bateria principal; mais 4 testes passaram na bateria complementar de mobile das novas cenas. Total: 24 cenários de navegador aprovados.
- Cobertura: cinco missões, Kids/Teens, resultados únicos e IDs, Teddy sem deslocamento automático ao agir, preparação e rota impossível, colisões e caminhos, joystick com múltiplos ponteiros, retorno ao menu, React StrictMode com cinco trocas de input e desmontagem.
- Capturas: `docs/five-missions/`; resultados brutos: `docs/browser-report.json` e `docs/browser-mobile-report.json`.
- Os três PNGs de `public/assets/pixel` são idênticos ao checkpoint Visual02, verificados byte a byte.
- Uma execução anterior foi interrompida por recarregamento do Vite durante criação de fixture; a repetição sem edições passou integralmente. Essa falha não foi ocultada como sucesso.
- Mobile foi emulado em Chromium; não foram utilizados aparelhos físicos. As novas narrativas usam fixtures de aproximação para percorrer objetivos, combinadas com testes independentes de rotas e movimentação.

O checkpoint recuperável está no arquivo irmão `SINAL-Checkpoint-Visual02.bundle`. Pode ser clonado com `git clone SINAL-Checkpoint-Visual02.bundle destino` (tag estável disponível no clone). A lista de arquivos alterados/adicionados está em `docs/ARQUIVOS-MODIFICADOS.txt`.
