# Missão 05 — Trauma: Proteger, Acolher e Cuidar

No menu local, selecione **05 · Trauma** e **Entrar no pátio**. O adaptador fornece a modalidade exigida pelo contrato legado. O jogador recebe uma única história. As quatro missões anteriores conservam seus controles de entrada.

## Arquivos e integração

A entrada `trauma` do registro carrega `src/scenes/Courtyard.ts` sob demanda. A cena usa o motor Phaser, o controlador KitchenActor com os atlas existentes de Teddy e a personalização do host. Usa o HUD, joystick por ponteiro, áudio, roteamento A* e movimentação com raio dos pés já existentes. A cena emite eventos de fase, objetivo e resultado pelo contrato React/Phaser. O adaptador local grava o progresso em `sinal-missions:v1`.

`src/missions/trauma.ts` implementa pré-condições, ordem e alcance inclusivo de interação. `src/world/traumaYard.ts` monta piso, marcações, parede, cerca, móveis, plantas e objetos em camadas. `src/ui/trauma.css` controla o painel compacto da missão. `src/main.ts` e `src/missions/catalog.ts` integram o quinto botão e a apresentação. A pasta `public/assets/trauma/` contém os dois novos atlas. O ponto de restauração está no diretório irmão `environment-check/before-trauma-*`.

## Arte e narrativa

As referências orientaram composição, paleta, personagens e equipamentos do pátio. ImageGen produziu dois atlas transparentes com 16 elementos cada. Para pessoas, o pedido especificou Sofia de capacete, duas poses de pedalada, perda de equilíbrio, dor, avaliação e alívio, além de Clara andando, avaliando, preparando o kit e usando gaze. Para objetos, especificou bicicleta roxa, cones, kit fechado e aberto, árvore, banco, bicicletário, trave, mochila, bola, canteiro, bebedouro, escada, porta, janela e cerca. São os assets integrados desta versão. A aceitação artística fica a cargo do projeto.

A história passa por exploração, acidente de bicicleta, segurança, avaliação inicial, busca do kit, cuidado do ferimento, acolhimento e conclusão. A bicicleta se desloca, inclina e muda a área ocupada no chão. Clara caminha até Sofia. A mudança para a pose sentada só ocorre após observação de consciência, respiração, relato de impacto, dor, deformidade e sangramento. Teddy sinaliza com o cone e leva o kit. Clara demonstra o cuidado e comunica o ocorrido à família.

A câmera acompanha Teddy e muda o foco para Sofia na queda e no atendimento. WASD, setas e joystick controlam movimento. E ou clique interagem com os alvos. A navegação testa pontos livres ao redor do alvo e dispensa deslocamento quando Teddy já está ao alcance. Pausa, reinício e retorno usam o HUD compartilhado. O objetivo pode ser recolhido e o diálogo pode ser fechado ou lido em voz alta.

## Revisão e publicação

O conteúdo trata da escoriação superficial específica da narrativa. A revisão de Enfermagem permanece registrada internamente como `clinicalReview: pending`. Referência complementar de limpeza e cobertura: [NHS, Cuts and grazes](https://www.nhs.uk/conditions/cuts-and-grazes/).

A integração é local. Não houve publicação no site hospedado. Os testes de celular usam Chrome emulado. Voz e tela cheia dependem do navegador. O build conserva o aviso do tamanho do pacote principal do Phaser.

## Validação

O build passou. Foram aprovados 67 testes unitários e de integração e os 34 casos da suíte de navegador, incluindo regressão de Engasgo, Queimaduras, Convulsão e PCR. Após o ajuste da posição de observação de Teddy e da bicicleta caída, os dois percursos completos de Trauma passaram novamente, em desktop e celular emulado. A captura de cenário vazio usa a mesma cena com personagens e HUD ocultos para inspeção.

[Resultados unitários](unit.json) · [Suíte de navegador](browser.json) · [Reexecução final](final-check/.last-run.json) · [Cenário](cenario.png) · [Início](inicio.png) · [Pedalada](pedalando.png) · [Queda](queda.png) · [Limpeza](limpeza.png) · [Curativo](curativo.png) · [Conclusão mobile](conclusao-mobile.png)

Testes específicos em `tests/trauma.test.ts` e `tests/browser/trauma.spec.ts`. O teste genérico do antigo protótipo foi substituído pelo percurso integral. A seleção passou a verificar cinco opções.
