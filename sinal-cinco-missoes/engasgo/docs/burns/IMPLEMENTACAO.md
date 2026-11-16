# Missão 02 — Queimaduras: Agir com Segurança

## Implementação

A missão `burns` está integrada ao motor existente e disponível junto de Engasgo no menu. A cena Kitchen deixou de herdar o protótipo escolar SupportScene. Usa a mesma montagem Phaser/React, o HUD, a navegação A*, a movimentação e os contratos existentes. Não foi criado outro projeto, canvas ou loop de jogo. As outras três missões não foram desenvolvidas nesta entrega; seus protótipos preexistentes e registro foram preservados.

O fluxo é `explore → incident → assess → secure → moveToSink → cooling → protection → seekHelp → complete`. A exploração pode disparar o acidente por interação; existe um fallback de 12 segundos. Eventos de chegada e conclusão de animação controlam as sequências. Ações fora de ordem não avançam a máquina de estados. O resultado só pode ser consultado depois da conclusão.

A mãe executa o controle do calor, abertura da torneira, proteção e encaminhamento. Teddy observa, chama, orienta e leva a cobertura. A irmã caminha, recua, protege o braço, participa do resfriamento e demonstra alívio. Não há teletransporte nas sequências de produção. O helper de posicionamento permanece restrito a DEV com `?test=1`; os testes completos novos utilizam as rotas reais, sem esse helper.

## Personagens e animações

Exatamente três atores: Teddy, irmã e mãe. Teddy permanece um urso caramelo com boné roxo, cruz branca, camiseta roxa e mochila amarela. Os sprites são independentes e transparentes, derivados das referências fornecidas. O atlas enviado pelo host React, quando presente, tem precedência.

- Teddy: idle/piscada, caminhada frente/costas e espelhamento lateral, interação, pensamento, apontar/auxiliar e comemoração.
- Irmã: caminhada, contato/recuo, dor sem lesão gráfica, proteção do braço, extensão do antebraço e alívio.
- Mãe: preparo, reação, agachamento/observação, caminhada, acolhimento, auxílio e fala.
- Estados explícitos compartilhados pela nova implementação: idle, walking, running, interacting, talking, alert, thinking, helping e celebrating. Running está disponível; o percurso normal utiliza caminhada.
- Animações finitas usam eventos Phaser `animationcomplete`; a caminhada usa 10 FPS e idle 4 FPS. O loop de renderização mantém o alvo de 60 FPS do projeto. Pausa interrompe individualmente os AnimationState dos três sprites, movimento, tempo simulado e áudio.

A cozinha possui piso, paredes, janela, armários, bancada, pia, fogão/panela/coifa, geladeira, mesa, quatro cadeiras, porta, relógio, decoração, plantas, utensílios, fruteira, kit e toalha. Móveis são objetos independentes, ordenados pela posição de base; atores usam a posição dos pés. O mapa tem dimensões de 1200 × 850 e limites próprios. Mesa, cadeiras e armário de apoio têm obstáculos explícitos; o limite superior impede atravessar bancadas e eletrodomésticos. O caminho de Teddy também considera os NPCs e o perímetro quente. Vapor e água são efeitos separados; vapor cessa após controle da fonte e água existe apenas durante o resfriamento.

## Controles, interface e integração

- Teclado WASD/setas, E, seleção por clique nos objetos/NPCs, Escape/pausa, reinício e saída.
- Joystick analógico, interação e captura por `pointerId`, incluindo uso simultâneo do botão. Eventos de outro ponteiro não cancelam o joystick.
- Câmera com limites próprios, acompanhamento de Teddy e enquadramento do acidente/atendimento; adaptação a landscape e portrait.
- Fullscreen solicitado por botão após ação do usuário; bloqueio de orientação é tentado com tratamento de rejeição. A missão continua na janela quando não há suporte.
- Diálogos em português, retratos, objetivo e progresso por etapa, falas recolhíveis, leitura por Web Speech e volume. A compreensão não depende do som. As fontes Baloo 2/Nunito são preferidas quando disponíveis, com fallback local.
- Efeitos leves via Web Audio e som de água em loop único, com controle de volume e descarregamento. O leitor depende das vozes disponíveis no sistema/navegador. Não foi implementada nem anunciada tradução em Libras.
- `phase-changed` complementa os eventos existentes de carregamento, início, objetivos e resultado. `sinal-missions:v1` salva registros por missão, sem sobrescrever `sinal-standalone-dev:v1` de Engasgo. Objetivos são deduplicados. Repetir uma missão não apaga conquistas anteriores.
- Falha de atlas produz mensagem, retry e retorno ao menu. Rotas bloqueadas dão feedback e devolvem controle. Desmontagem remove HUD, handlers, áudio, canvas e observação de resize.

## Conteúdo clínico

`clinicalReview: 'pending'` é mantido em todos os resultados e no registro persistido. A implementação técnica não equivale a validação clínica pela equipe de Enfermagem.

A narrativa adota o protocolo provisório solicitado: 20 minutos de água corrente fresca, representados por 20 segundos e identificados como tempo simulado. O material não apresenta gelo nem receitas caseiras como cuidado; não manda estourar bolhas, remover tecido aderido ou tocar repetidamente a área. A mãe protege sem apertar e procura avaliação de saúde para a criança. A conclusão não afirma cura.

Referências consultadas para apoiar a revisão: [NHS — burns and scalds](https://www.nhs.uk/conditions/burns-and-scalds/), [British Red Cross — burns in children](https://www.redcross.org.uk/first-aid/learn-first-aid-for-babies-and-children/burns), [Ministério da Saúde — SAMU 192](https://www.gov.br/saude/pt-br/campanhas-da-saude/2025/samu-192). O SAMU é citado para situações graves no Brasil; o jogo não realiza chamadas.

## Arquivos

Criados: `src/missions/burns.ts`, `src/characters/KitchenActor.ts`, `src/world/kitchenMap.ts`, `src/world/kitchen.ts`, `src/core/kitchenAudio.ts`, `src/ui/burns.css`, `src/integration/progress.ts`, três PNGs e três atlas JSON em `public/assets/burns/`, `public/sinal.svg`, `playwright.local.config.ts`, testes unitários/integrados de burns e progress e os testes de navegador burns, burns-mobile e burns-resilience.

Modificados: `src/scenes/Kitchen.ts`, `src/game.ts`, `src/main.ts`, `src/missions/catalog.ts`, `src/integration/contract.ts`, `index.html`, testes de seleção e a lista do teste genérico de suporte (o antigo roteiro de burns foi substituído pelos testes completos da nova missão).

Em Engasgo, uma correção pontual em `src/scenes/Cafeteria.ts` sincroniza a mudança para a fase de atendimento ao chegar a professora. Isso impede que uma atualização posterior sobrescreva a animação do primeiro gesto aceito. Não foram mudados mapa, gráficos, regras clínicas, controles ou sequência de Engasgo.

O encerramento compartilhado em `src/game.ts` agora para as cenas antes de destruir o Phaser. A auditoria identificou que `destroy` sozinho não dispara `shutdown`, evento usado pelo projeto para liberar áudio e handlers. O teste novo verifica explicitamente `AudioContext.state === 'closed'` após cada uma de três desmontagens React; o teste existente de cinco missões também foi repetido após a correção.

As alterações locais anteriores foram preservadas. Existe cópia anterior de código, testes e manifests em `../environment-check/before-burns/`, relativa à raiz do projeto engasgo. Testes existentes também atualizaram suas capturas de evidência nos diretórios já usados pelo projeto. Não foram instaladas novas dependências.

## Validação e reprodução

Comandos, executados em `engasgo`:

```powershell
npm.cmd test
npm.cmd run build
node node_modules/playwright/cli.js test --config playwright.local.config.ts
```

`playwright.local.config.ts` reutiliza o Chrome instalado e a configuração existente, com Vite em 127.0.0.1:5191. O ambiente Windows exigiu executar navegador/servidor fora do sandbox restrito. Não foi necessário instalar outro navegador.

Os testes cobrem fluxo completo Kids/Teens/mobile, navegação real, colisão, autores dos cuidados, conclusão única, pausa, reinício, retorno a Engasgo, toque simultâneo, troca de orientação, seleção pelo canvas, carregamento sob demanda, recuperação de asset e montagem/desmontagem React. A regressão inclui as missões completas Kids/Teens de Engasgo e seus testes de preparação, navegação, joystick e camadas visuais. Os resultados finais estão em `validation.json`.

Capturas de execução: `kitchen-*.png`, `cooling-*.png`, `complete-*.png`, `mobile-incident.png`, `mobile-portrait.png`, `landscape.png` e `portrait.png`. A inspeção adicional via Playwright MCP está em `mcp-live.png` e `mcp-console.txt`. O Context7 MCP também respondeu à consulta de documentação de animações do Phaser 3.90.

O build mantém o aviso de tamanho do bundle principal Phaser (~1,21 MB bruto / 333 kB gzip), já presente na arquitetura. Kitchen é carregada separadamente (~27 kB de JS bruto) e seus atlas não são solicitados em Engasgo. Não há garantia de 60 FPS em qualquer dispositivo; os testes mobile são emulação Chrome, não uma certificação em aparelhos físicos.

Os assets usados e prompts estão em [ASSETS.md](ASSETS.md). São a versão integrada desta entrega, não uma declaração de aprovação artística externa. A pendência de revisão clínica permanece explícita.

## Resultado final verificado

- Testes unitários: 55 aprovados, zero falhas.
- Testes de navegador: 31 aprovados, zero falhas, zero ignorados e zero instáveis.
- Build de produção: aprovado; permanece o aviso de tamanho do bundle Phaser descrito acima.
- Playwright MCP e Context7 MCP: chamadas reais verificadas, sem instalações adicionais nesta implementação.
- Engasgo: percursos completos Kids e Teens e regressões aprovados.

Evidências estruturadas: [validation.json](validation.json), [browser-report.json](browser-report.json), [unit-report.json](unit-report.json) e [build.log](build.log).
