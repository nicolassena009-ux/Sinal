# Missão 04 — Cada Segundo Importa

Selecione **04 · Parada cardiorrespiratória** e entre em Kids ou Teens. O jogador leva Teddy até Rafael, ao telefone e ao suporte do DEA. Ana verifica a resposta e a respiração do adulto e inicia a RCP enquanto Teddy providencia ajuda. A simulação termina quando a equipe especializada assume o atendimento.

## Implementação

O registro existente carrega a cena de forma assíncrona em `src/scenes/Corridor.ts`. A lógica de objetivos, cadência, análise e choque está em `src/missions/cardiac.ts`. A seleção e os títulos estão em `src/main.ts` e `src/missions/catalog.ts`. A cena reutiliza Keyboard/Pointer do Phaser, KitchenActor para o avatar e acessórios do host, NavigationGrid, RouteFollower, o HUD com joystick, o áudio e o contrato de progresso React. O CSS específico está em `src/ui/gym.css`. Não houve instalação de dependências.

A exploração leva ao colapso, reconhecimento, resposta de emergência, RCP, DEA, continuidade e transferência. A chamada e a busca do aparelho podem acontecer em paralelo com as compressões. A cadência automática é de 110/min. O jogador acompanha por Espaço, clique, toque ou confirmação de observação. Batidas rápidas não concedem progresso. A duração mostrada é a da simulação. O DEA tem estados fechado, aberto, ligado, eletrodos aplicados, análise, orientação e retomada. A condição do ritmo é escolhida pela simulação. O comando de choque verifica indicação e afastamento. Rafael permanece deitado ao final.

## Arte e controles

`public/assets/cardiac/gym.png` usa a referência vazia fornecida como camada de fundo, com obstáculos definidos em coordenadas do mapa. `actors.png` é um atlas criado com ImageGen. O pedido de geração especificou doze recortes transparentes em grade 4 × 3, com Rafael adulto em pé, mal-estar, queda e decúbito, Ana em uniforme verde e roxo em pé, caminhando, avaliando, comprimindo e liberando, mais DEA aberto com cabos e eletrodos e estojo fechado. Teddy usa os atlas existentes e respeita a personalização fornecida pelo host. Os personagens e o DEA são objetos independentes. A arte está integrada e disponível para revisão.

Use WASD, setas ou joystick para caminhar, E para interagir, Espaço para o ritmo e Escape para pausar. As ações também estão no painel de diálogo. A leitura em voz alta depende das vozes do navegador. O aparelho aberto e as posições dos eletrodos aparecem durante a demonstração.

## Validação e revisão

Testes adicionados em `tests/cardiac.test.ts` e `tests/browser/cardiac.spec.ts`. A seleção e o teste genérico dos protótipos foram atualizados em `scope.spec.ts` e `five.spec.ts`. Os dois percursos de PCR terminam com um único evento de conclusão. A execução adicional validou tela pequena e ordem alternativa das tarefas. O build passou com o aviso existente de tamanho do pacote Phaser.

[Resultados unitários](unit.json) · [Rodada inicial de navegador](browser-first.json) · [RCP](rcp.png) · [Análise do DEA](analise.png)

A revisão de Enfermagem permanece pendente. O roteiro usa suporte básico de vida adulto e a chamada fictícia ao 192. A prática em teclado ou tela não mede a profundidade real da compressão. Referências: [American Heart Association, suporte básico de vida adulto de 2025](https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-basic-life-support) e [Ministério da Saúde, SAMU 192](https://www.gov.br/saude/pt-br/campanhas-da-saude/2025/samu-192).

O ginásio usa enquadramento amplo fixo e a camada de fundo incorpora os móveis. As poses de RCP são uma demonstração estilizada. A homologação em aparelhos físicos e a avaliação clínica e artística não foram realizadas.
Resultado final: 64 testes unitários aprovados. Dos 34 casos de navegador, 31 passaram na primeira execução e os três restantes passaram na [reexecução](browser-rerun.json). Os dois percursos finais do DEA também passaram após os ajustes, incluindo a apresentação em tela pequena.
