# Produção visual 02 — referências e prompts

Ferramenta: image_gen integrada, modo nativo. Não foi usada API paga via CLI, chave de API ou serviço adicional. Os três resultados selecionados foram copiados para public/assets/pixel; o jogo não depende da pasta interna de geração.

Referências fornecidas pelo usuário: referencias/refeitório_aprovado_dola.jpeg (direção principal), referencias/prancha_tecnica_02.png (organização e personagens), referencias/prancha_geral_01.png (contexto inspecionado). Os documentos internos foram tratados como guias do kit; o escopo foi definido pelo pedido do usuário.

## 1. Sala vazia — cafeteria-room.png

Production game background plate for SINAL school cafeteria based closely on the supplied approved warm detailed pixel-art references. Landscape 1536x1024. Cozy detailed crisp pixel art, golden honey wood wainscoting, cream plaster, sunny windows, pastel pennant strings, clock, school notice boards, double entrance doors. Elevated three-quarter orthographic RPG camera with horizontal back wall and narrow side walls. Empty walkable pale honey tiled floor, subtle pixel texture, warm window light. No tables, chairs, counters, plants, trash cans, people, bears or floor props. Fixed details on walls only. No UI, labels or watermark. The plate becomes separate floor and architecture frames in a 1600x1100 Phaser world.

Resultado: parede ocupou 286 pixels superiores; o corte foi inspecionado e registrado manualmente. A geometria caminhável foi desenhada no mapa, não inferida automaticamente da imagem.

## 2. Atlas de mobiliário — furniture.png

Single production spritesheet atlas, transparent alpha, 1536x1024, 3 columns by 2 rows of 512x512 cells. Six isolated complete sprites with transparent padding, no borders, text, labels or background scenery. Mandatory supplied SINAL cafeteria reference: detailed cozy pixel art, honey wood, warm outlines, pastel cushions, elevated near-front three-quarter view. Reading order: empty wooden table, matching chair with pink cushion, long wood buffet with two glass food guards and plate storage, lush tree in terracotta pot, teal recycling bin, purple tray with plate and cups. Shared upper-left light. Usable atlas for manual frame bounds, not a concept moodboard.

Resultado: alpha real preservado. Os frames específicos estão em FURNITURE_FRAMES. As sombras semitransparentes dos objetos também foram preservadas.

## 3. Estudo de personagens — characters-study.png

Production character animation spritesheet for SINAL using the supplied technical board as reference only. Transparent PNG, 1536x1024, exactly 4 columns by 4 rows. Full characters, aligned feet, consistent scale and padding. Cozy detailed pixel style with warm outlines. Columns: relaxed standing, left-step walk, right-step walk, concerned/observing with raised arm. Rows: temporary Teddy study in purple hoodie, yellow backpack, blue denim shorts, purple/white sneakers, no hat; teacher Marina with brown hair, glasses, lilac cardigan, cream blouse, navy trousers; student Rafa age15 with dark curly hair and white/purple school shirt; student Lia age15 with pink headband and purple school polo. No scenery, text, borders or other objects. Provisional study, not final official mascot art.

Resultado: atlas usado como estudo visual e duas poses de caminhada; não foi anunciado como animação final nem como todas as orientações oficiais. A origem dos pés foi ajustada por inspeção. Bia e a pessoa da cantina compartilham estudos existentes enquanto suas artes individuais não forem produzidas.

