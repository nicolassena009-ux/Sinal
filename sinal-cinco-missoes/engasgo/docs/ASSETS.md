# Contrato de arte — etapa visual 02

O kit SINAL_Kit_Visual_01 foi recebido e usado como referência. Seus painéis são conceitos, não atlas prontos. O GLB oficial, sprites direcionais finais e sistema de acessórios do site continuam não fornecidos.

## Recursos em uso

- public/assets/pixel/cafeteria-room.png: 1536 × 1024, sala vazia opaca. A engine registra arquitetura em (0,0,1536,286) e piso em (0,286,1536,738), com geometria física definida separadamente.
- public/assets/pixel/furniture.png: 1536 × 1024, atlas novo com alpha, seis objetos. Os frames foram inspecionados e registrados manualmente em src/assets/art.ts. Não se recortaram objetos dos painéis enviados.
- public/assets/pixel/characters-study.png: 1536 × 1024, atlas provisório novo, 4 × 4 células de 384 × 256. Linhas: Teddy, Marina, Rafa, Lia. Colunas: repouso, passo A, passo B, preocupação/observação.

A origem dos estudos é (0.5,0.96), com dimensões visuais de célula 184 × 123 no mundo. O sprite inclui transparência lateral: a largura visível do personagem é menor que a célula. Duas poses alternam durante deslocamento real, sem deslocar o ponto físico dos pés. O espelhamento corrige a orientação lateral do segundo passo; ainda faltam vistas norte, diagonais e transições definitivas.

Texturas usam filtro nearest e a engine usa pixelArt/roundPixels. Os PNGs são carregados na entrada da missão e destruídos com a instância. Fonte, prompts e condição provisória estão em PROMPTS-VISUAL-02.md.

## Teddy oficial — contrato já preservado

A entrada aceita avatar.atlas = { image: '/assets/teddy.png', data: '/assets/teddy.json' }, em PNG transparente + JSON TexturePacker/Phaser hash.

- Frames sugeridos de 128 × 128, sem recorte variável, pé central inferior.
- Direções 0=N, 1=NE, 2=E, 3=SE, 4=S, 5=SO, 6=O, 7=NO.
- Nome de frame: idle_4_0, walk_4_0 etc., padrão {estado}_{direção}_{índice}.
- Estados: idle, walk, turn, interact, observe, concerned, prepare_assist, assist, celebrate.
- Walk: oito frames por direção, reprodução nominal 10 fps. Demais estados: até quatro frames, 4 fps no adaptador inicial.
- Busca: frame exato, direção cardinal mais próxima, idle da direção e idle sul.
- A configuração externa, origem dos pés e controlador permitem trocar o atlas sem mudar colisão ou roteamento.

O novo estudo mostra moletom roxo, mochila amarela, shorts jeans e tênis roxos/brancos, seguindo o figurino mencionado no kit. Isso não significa aprovação do Teddy definitivo.

## Acessórios

O rig visual aceita camadas pré-carregadas chamadas accessory-cap, accessory-vest, accessory-badge, accessory-glasses e accessory-cape, selecionadas pelo contrato existente. Elas seguem posição, animação e espelhamento do rig. Quando a textura não existe, o acessório não é desenhado; não se inventa vestuário geométrico em cima do estudo.

A entrega não contém arte oficial dessas camadas. Produzir e validar anchors por frame/direção e mapear os recursos do site continua pendente. As referências iniciais de anchor local são cabeça y=-90, óculos y=-70 e tronco y=-45, com origem nos pés.

## Pendências de produção

Atlas oficial completo, NPCs distintos para Bia e cantina, passos e expressões definitivos em oito orientações, poses clínicas revisadas, acessórios e animações de sentar/levantar. Os diagramas educativos da versão inicial foram preservados nesta etapa focada em cenário e navegação.

