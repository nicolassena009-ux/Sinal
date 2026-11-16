# Assets de Queimaduras

Os três PNGs e seus atlas estão em `public/assets/burns/`. Foram produzidos pela ferramenta integrada ImageGen a partir das referências do usuário, em 13/11/2026. Não são recortes dos personagens de uma ilustração composta. Os quadros independentes têm canal alfa; o empacotamento JSON apenas registra os limites dos sprites, sem transformar as imagens.

| Arquivo | Organização | Uso |
| --- | --- | --- |
| characters.png / characters.json | 8 colunas × 3 linhas; 1536 × 1024 | Teddy, irmã e mãe: frente, costas, caminhada, interação e reação |
| furniture.png / furniture.json | 4 colunas × 3 linhas; 1536 × 1024 | Mesa, cadeira, fogão, geladeira, armários, pia, coifa, janela, planta, kit e toalha |
| actions.png / actions.json | 6 colunas × 3 linhas; 1774 × 887 | Piscada, fala, pensamento, apontar, agachar, comemorar, recuo, proteção do braço, acolhimento e alívio |

O cenário compõe estes objetos em profundidades independentes. Piso, paredes, molduras e efeitos são geometria Phaser; não há outro canvas ou loop de jogo. Não se reutiliza mobiliário escolar na cozinha. Os três atlas são carregados apenas pela cena Kitchen.

## Prompts utilizados

### Personagens

Production game sprite sheet based on reference identities, NOT a poster. Transparent PNG 1536x1024, exactly 8 equal columns x 3 equal rows, generous transparent margins inside EACH cell, no borders labels background shadows or props. Full-body consistent-scale sprites. Row 1 Teddy caramel BEAR purple cap white cross, purple heartbeat t-shirt yellow backpack; row 2 sister ponytail pink bow white purple t-shirt jeans sneakers; row 3 mother brown bun round glasses cream shirt purple apron dark pants. Preserve EXACT identity/style of reference. Each row eight poses left to right: 1 front three-quarter idle; 2 front walking left foot; 3 front walking right foot; 4 BACK idle showing backpack/hair; 5 BACK walking left foot; 6 BACK walking right foot; 7 side facing right reaching both arms forward (mother slightly bends, sister extends bare forearm, Teddy points); 8 front emotional pose (Teddy cheerful raised hand, sister recoiling and holding arm mildly upset NO wound/gore, mother comforting outstretched hand). Every sprite fully contained in its uniform cell with aligned feet near lower margin and identical body proportions across row. True pixel art crisp stair-step edges warm vibrant palette dark outlines, matching reference. No human replacement for bear. Independent transparent animation asset, not cropped illustration.

### Móveis

Production transparent sprite atlas for 2.5D PIXEL ART residential kitchen matching this reference. EXACT 4 columns x 3 rows regular grid 1536x1024. Each object isolated fully within one cell with 25px transparent margin, NO BACKGROUND, NO frames, NO labels, NO purple sheet. ALL ALPHA TRANSPARENT empty space, NO gradient. Row 1: wooden kitchen TABLE alone; wooden CHAIR with pink cushion alone; kitchen STOVE and OVEN with a small purple pot on top NO steam; silver REFRIGERATOR. Row 2: orange lower kitchen CABINET with pale countertop; same cabinet with SINK and tall silver TAP; orange wall CABINET; silver extractor HOOD. Row 3: WINDOW with green garden beyond inside frame only; leafy potted PLANT; white FIRST AID KIT; folded clean purple-white TOWEL. Warm orange wood beige cream counters vibrant purple accents. Consistent three-quarter front-right view matching reference, sharp pixel art, dark outlines, not photoreal. Table/chair full including legs. No characters. Center each independent sprite exactly in its uniform cell.

### Ações

Supplemental animation sprite atlas matching these EXACT three characters and pixel-art rendering. Transparent PNG no backdrop. Exactly 6 columns x 3 rows uniform grid, each full-body sprite isolated centered with aligned feet and generous empty margins. No shadows, borders, writing or other objects. Row1 Teddy caramel bear purple cap white cross purple heartbeat shirt yellow backpack: 1 eyes closed blinking idle, 2 talking mouth open gently, 3 thinking hand at chin, 4 pointing right with straight arm, 5 crouching to retrieve supplies, 6 happy BOTH arms raised celebration. Row2 sister brown ponytail pink bow white purple shirt jeans: 1 blinking idle, 2 says ow mouth open, 3 recoiling pulling right arm back, 4 cradling forearm gently distressed no injury gore, 5 facing right extending forearm HORIZONTALLY to running water (do not draw water or sink), 6 relieved gentle smile. Row3 mother brown bun round glasses cream blouse purple apron dark trousers: 1 cooking hands working in front with no utensils, 2 turning head concerned, 3 kneeling looking right, 4 leaning forward comforting with outstretched hands, 5 reaching to support daughter's forearm with both hands no other character, 6 relaxed smiling thumbs up. Stable proportions outfit face same across all columns. Independent sprites not an illustration. Coherent three-quarter front right view crisp pixel edges.

## Personalização

O contrato de avatar recebido do React continua aceito. Um atlas fornecido pelo host tem precedência sobre o Teddy gerado. O adaptador procura nomes como `idle_4_0`, `walk_4_0`, `assist_4_0` e equivalentes direcionais. Imagens de acessórios são sobrepostas quando fornecidas. A cor personalizada aparece como detalhe de identificação, preservando a pelagem caramelo e a roupa roxa do personagem.

Estes assets são a versão integrada e testável desta entrega, derivados das referências. Não representam uma aprovação artística externa ou um atlas oficial fornecido separadamente pelo usuário.
