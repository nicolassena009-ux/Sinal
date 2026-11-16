# Missão 03 — Convulsão: Proteja e Acolha

No menu do SINAL, selecione **03 · Convulsão** e escolha Kids ou Teens. Teddy visita a sala de aula, observa a alteração de consciência de Lucas e chama Helena. O jogador pode solicitar o SAMU 192 e iniciar o cronômetro logo que percebe a emergência. Helena simula a chamada e permanece junto de Lucas enquanto Teddy afasta a mochila, remove materiais e traz o casaco. A cena termina com Lucas alerta, acompanhado e aguardando avaliação.

## Integração e arte

A cena registrada com o identificador `seizure` usa o carregamento sob demanda, o contrato React/Phaser, o HUD, a navegação A*, a movimentação e o registro de progresso existentes. Teddy usa o mesmo controlador e os mesmos atlas de Queimaduras, com precedência para o avatar fornecido pelo host. Os arquivos das cenas Engasgo e Queimaduras foram preservados.

O cenário monta objetos independentes com profundidade pela base e colisão pelas áreas ocupadas no chão. Lucas passa de uma área de colisão vertical para uma horizontal ao ser acomodado. A mochila muda de posição e atualiza sua colisão durante o deslocamento. Os três personagens usam o mesmo mundo navegável. A professora caminha até Lucas antes de ajudá-lo. O controle de movimento reduzido mantém uma pose estável durante a crise.

Os estados de Lucas são normal, alerta inicial, perda de equilíbrio, descida assistida, crise, período pós-crise, recuperação e alerta pleno. As animações de Helena mostram percepção, aproximação, apoio, colocação do casaco, monitoramento, chamada, observação da respiração e acolhimento. A sequência usa chegada às rotas e eventos de animação. A pausa interrompe o movimento, a animação, o áudio e o relógio.

## Arquivos da entrega

- `src/scenes/Classroom.ts` integra a narrativa, o controle do jogador, o cronômetro e os eventos do host.
- `src/missions/seizure.ts` controla as pré-condições, os objetivos, o tempo observado e o resultado.
- `src/characters/ClassroomActor.ts` anima Lucas e Helena.
- `src/world/classroom.ts` e `src/world/classroomMap.ts` montam a sala, os móveis e os obstáculos.
- `public/assets/seizure/` contém os dois PNGs com transparência e seus atlas JSON.
- `src/ui/seizure.css`, `src/main.ts` e `src/missions/catalog.ts` integram a interface e o menu.
- Os testes específicos estão em `tests/seizure.test.ts`, `tests/browser/seizure.spec.ts` e `tests/browser/seizure-touch.spec.ts`. Os testes de escopo e de protótipos foram atualizados para a terceira missão jogável.

## Arte gerada

Foi usada a ferramenta integrada ImageGen. As referências fornecidas orientaram estilo, roupa, paleta e perspectiva. O pedido para o atlas de personagens especificou uma grade transparente 8 × 4, com Lucas em pé, caminhando de frente e de costas, perdendo o equilíbrio, deitado, de lado e sentado. Para Helena, especificou caminhada direcional, observação, agachamento, proteção, telefone e acolhimento. O pedido para mobiliário especificou uma grade transparente 4 × 4 contendo lousa, janela, porta, armário, carteiras, cadeiras, mesa docente, estante, planta, mochila, casaco, livros, lápis, relógio e quadro educativo. Os enquadramentos dos objetos foram ajustados no atlas. A arte integrada continua disponível para avaliação artística.

## Conteúdo e limitações

O cronômetro mostra segundos observados numa crise simulada de curta duração. A possível primeira crise permite pedir ajuda imediatamente. Nenhuma ligação é feita pelo jogo. A simulação mantém `clinicalReview: 'pending'` até a revisão do roteiro pela equipe de Enfermagem. As referências consultadas foram o [CDC](https://www.cdc.gov/epilepsy/first-aid-for-seizures/), a [Epilepsy Foundation](https://www.epilepsy.com/recognition/emergency-help) e o [Ministério da Saúde](https://www.gov.br/saude/pt-br/campanhas-da-saude/2025/samu-192).

O teste mobile usa emulação Chrome. A disponibilidade de voz, tela cheia e rotação depende do navegador. O build conserva o aviso de tamanho do pacote principal do Phaser. A versão testada é local.

## Evidências de execução

O build de produção passou. Foram aprovados 61 testes unitários e de integração, 33 testes na suíte de navegador e um teste adicional de multitoque, rotação e três desmontagens React com verificação do encerramento do áudio. A suíte percorreu Convulsão em Kids, Teens e celular emulado, Engasgo em Kids e Teens e Queimaduras em Kids, Teens e celular emulado.

[Resultados unitários](unit-report.json) · [Resultados do navegador](browser-report.json) · [Resultado do teste adicional](touch-results/.last-run.json) · [Sala em desktop](classroom-kids.png) · [Atendimento em celular](crisis-mobile.png) · [Recuperação](recovery-kids.png) · [Conclusão](complete-mobile.png)
