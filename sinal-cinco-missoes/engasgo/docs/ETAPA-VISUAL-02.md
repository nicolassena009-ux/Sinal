# Missão 01 — etapa visual 02

## Escopo e origem

Evolução do projeto existente, sem trocar Phaser, TypeScript, Vite, contrato React ou lógica clínica. A nova instrução de pixel art tem precedência sobre a direção anterior que excluía esse estilo. Somente a missão de engasgo permanece implementada.

O kit enviado foi lido e suas imagens inspecionadas. `refeitório_aprovado_dola.jpeg` definiu madeira cor de mel, piso quente, janelas iluminadas, bandeirolas, mobiliário escolar e detalhes acolhedores. A prancha técnica orientou a separação entre sala, móveis, decoração e áreas de passagem. Os avisos do kit foram respeitados: as pranchas não foram importadas como atlas finais e a proposta de Teddy não foi anunciada como arte oficial.

## Arquivos alterados e adicionados

| Arquivo | Alteração |
| --- | --- |
| `public/assets/pixel/cafeteria-room.png` | Sala vazia nova, baseada na referência, sem móveis pintados no chão |
| `public/assets/pixel/furniture.png` | Atlas novo de mesa, cadeira, buffet, planta, lixeira e bandeja, com alpha |
| `public/assets/pixel/characters-study.png` | Atlas provisório de Teddy, Marina, Rafa e Lia, quatro poses por personagem |
| `src/assets/art.ts` | Preload dos PNGs, filtro nearest e frames registrados manualmente |
| `src/world/cafeteriaMap.ts` | Configuração editável de móveis, escala, pivôs, colisões, spawns e pontos de atendimento |
| `src/world/cafeteria.ts` | Composição em camadas e objetos ordenados pelos pés |
| `src/core/movement.ts` | Subpassos de movimento e interseção contínua contra footprints expandidos |
| `src/core/navigation.ts` | Busca A*, validação e simplificação de rotas, seguidor com recálculo seguro |
| `src/characters/Actor.ts` | Sprite visual desacoplado do corpo físico, rotas e slots para arte oficial |
| `src/scenes/Cafeteria.ts` | Uso da navegação nos eventos; preparação do atendimento aguarda chegada por rotas reais |
| `src/core/camera.ts` | Limites abrangendo também a parede superior |
| `src/game.ts` | Renderização pixel art, nearest e arredondamento de pixels |
| `tests/navigation.test.ts` | Testes de rotas, obstáculos, quinas, corredor estreito, recálculo e spawns |
| `tests/browser/visual-v2.spec.ts` | Assets, profundidade, trajetória da professora e telas móveis |

O restante da missão, áudio, joystick, teclas, HUD, modo Kids/Teens, resultados e ponte de eventos foram reaproveitados.

## Camadas do cenário

1. **Piso:** frame inferior da imagem da sala, abaixo de todos os atores e objetos. Não contém mesas, plantas ou colisões implícitas.
2. **Arquitetura fixa:** frame superior com portas, janelas, lambris, relógio e murais. Os limites físicos são definidos explicitamente no mapa, não inferidos da imagem.
3. **Detalhes do chão:** tapete de entrada, sem colisão e abaixo dos pés.
4. **Mobiliário:** cada mesa, cadeira, buffet, vaso e lixeira é uma instância independente. Sua profundidade é o Y do ponto de apoio.
5. **Objetos pequenos:** bandejas são sprites independentes vinculados à superfície da mesa, herdando a profundidade do móvel.
6. **Primeiro plano:** vasos e outros objetos posicionados na frente continuam usando ordenação Y; não são uma imagem plana permanentemente acima de todos. Assim podem esconder parcialmente um ator atrás deles e permitir que ele apareça à frente quando passa.

O mapa conserva corredor central e caminhos laterais. Escalas e footprints ficam em um único arquivo declarativo; trocar uma textura não redefine automaticamente sua área sólida.

## Colisão e navegação

Os pés usam uma área de 28 × 28 unidades. O teste equivale a expandir os retângulos de obstáculo em 14 unidades. Mesas, cadeiras, balcão, vasos, lixeiras e paredes participam da mesma lista de sólidos, usada tanto por Teddy quanto pelos NPCs.

O jogador conserva normalização diagonal e deslizamento por eixos. Grandes deslocamentos são divididos em subpassos de até quatro unidades para evitar saltos através de barreiras finas.

Para NPCs, a grade A* tem células de 20 unidades. Células e segmentos consideram a folga do corpo; diagonais não podem cortar quinas. A simplificação só remove waypoints quando a conexão é livre. A interseção contínua com os retângulos expandidos verifica cada segmento antes de seguir. Se uma rota ficar bloqueada, o ator para e tenta recalculá-la; se não houver caminho, permanece parado. Não há movimento em linha reta ignorando colisão nem teletransporte como alternativa a uma rota inválida.

A professora agora recebe uma rota do buffet até a vítima. Na preparação, Teddy e Marina caminham até pontos de apoio válidos e o procedimento só começa depois da chegada. Gestos e balanços de animação alteram apenas o rig visual local; não alteram as coordenadas físicas do ator. A pausa interrompe também o avanço das rotas.

## Arte final versus provisória

**Implementado nesta etapa:** refeitório em pixel art baseado no kit; assets de cenário com alpha; separação de camadas; mapa jogável; colisão compartilhada; navegação com desvio de obstáculos; integração preservada; renderização desktop/mobile.

**Ainda provisório:** Teddy e NPCs são estudos com quatro poses, não animações finais em oito orientações. Bia compartilha o estudo de Lia; a pessoa da cantina compartilha o estudo de Marina. As poses são suficientes para visualizar caminhada e expressões nesta etapa, mas não equivalem ao conjunto final de animações. A sala e os móveis novos precisam de aceite artístico do usuário; não se presume que a geração seja automaticamente aprovada.

**Pronto para receber Teddy:** origem nos pés, controlador independente do FPS, oito índices de direção, busca por frames de atlas oficial, fallback cardinal, rig de acessórios e troca do recurso sem substituir a movimentação. Faltam o atlas oficial e os desenhos/anchors por pose dos acessórios. O estudo respeita o figurino indicado pelo kit, mas não substitui a identidade final aprovada.

## Limitações e próxima etapa

- Não há navegação dinâmica entre os corpos dos personagens; eles podem se sobrepor entre si. As colisões de móveis e paredes são obrigatórias e compartilhadas.
- Cadeiras são obstáculos estáticos. Sentar/levantar, ocupação e arrastar cadeiras ficam para uma etapa própria; não foram anunciados como implementados.
- Não há nova sequência clínica, outras missões, integração com stores reais ou mudança de armazenamento do site.
- Diagramas clínicos anteriores não foram redesenhados; sua revisão pela Enfermagem continua pendente.
- Não houve teste em aparelho físico nem promessa de 60 FPS. O controle foi exercitado em emulação Chromium.
- Próximo trabalho: aceite visual, Teddy/NPCs definitivos com direções e poses completas, animação de sentar/levantar se aprovada, integração dos acessórios oficiais e refinamento clínico com Enfermagem.

## Capturas

As imagens em `visual-v2/` são capturas reais do Phaser no navegador. `refeitorio-desktop.png` mostra a visão geral; `profundidade-atras.png` e `profundidade-frente.png` registram a sobreposição; as duas capturas mobile mostram horizontal e vertical.

## Validação executada

Em 12/11/2026, `npm test` aprovou **26 testes**: os 15 anteriores e 11 casos novos de navegação. Foram verificados os pontos narrativos, rota da professora em 15/30/60 atualizações por segundo, impedimento de atalhos em quinas, corredor estreito, destinos inválidos, recálculo, barreiras sem caminho e colisão contra obstáculo fino. Todos os spawns alcançam a área de apoio.

`npm run test:browser` aprovou **7 cenários em Chromium** em uma execução completa: movimento/pausa/saída; conclusão Teens; conclusão Kids; joystick e multitoque; percurso real até Rafa e gesto; assets/camadas/trajetória da professora; horizontal e vertical mobile. A trajetória foi amostrada em cada atualização para confirmar que os pés permaneciam livres e que o percurso era maior que a linha reta bloqueada. Os testes de conclusão também passaram após remover o reposicionamento instantâneo da preparação.

TypeScript estrito e build Vite passaram. O Vite mantém o aviso de chunk Phaser acima de 500 kB: cerca de 1,245 MB, 346 kB gzip, carregado sob demanda. Os PNGs novos são carregados apenas ao entrar na cena. Capturas foram inspecionadas visualmente; testes automatizados não substituem aparelho físico nem aceite artístico do usuário.

O JSON da execução está em `visual-v2/browser-results.json`. Prompts e origem dos recursos estão em `PROMPTS-VISUAL-02.md` e `ASSETS.md`.
