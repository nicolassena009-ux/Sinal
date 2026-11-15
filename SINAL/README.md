# SINAL — projeto independente

Esta é a cópia editável do projeto enviado em SINAL.zip, com React 19, TypeScript, Vite e TanStack Router. Não precisa de conta, editor, pacote ou hospedagem do Lovable para funcionar. A versão publicada anteriormente não foi alterada.

## Abrir e editar

Requisito: Node.js 22.12 ou superior (testado com 24.20).

Na pasta deste arquivo, abra o terminal e execute:

```sh
npm ci
npm run dev
```

Abra o endereço local mostrado no terminal. No Windows, também pode executar `INICIAR.cmd`. Para encerrar, use Ctrl+C no terminal.

- `src/routes`: páginas e navegação.
- `src/components`: interface, Teddy, áudio e jogos.
- `src/styles.css`: estilos, cores e adaptações de tela.
- `src/webgl/GalleryScene.ts`: galeria animada 3D.
- `src/systems/VirtualScroll.ts`: arraste e suavização da galeria.
- `src/assets`: imagens otimizadas em WebP.
- `public`: áudios, modelo 3D e imagens públicas.

O código continua em React/TypeScript para preservar as interações existentes. O comando de publicação gera HTML, CSS e JavaScript comuns. Não abra index.html por duplo clique: use o servidor local acima.

## Gerar e testar a publicação

```sh
npm run check
npm run build
npm run preview
```

O resultado fica em `dist/`. Essa pasta não exige Node.js no servidor: pode ser servida por uma hospedagem estática. Mais informações: https://vite.dev/guide/static-deploy.html

Configuração de hospedagem: comando de build `npm run build`, pasta de saída `dist`. Instalação reproduzível: `npm ci`.

Os caminhos das páginas precisam retornar `index.html` quando não forem arquivos reais. O pacote contém `_redirects` para hospedagens compatíveis e `vercel.json` na raiz para Vercel. Em outro servidor, configure o fallback de SPA. Os arquivos estão preparados para um domínio na raiz `/`; publicar dentro de uma subpasta exige adaptar base e URLs dos arquivos públicos.

## O que mudou

- Removidos o pacote/configuração de build e os ganchos de relatório de erro do Lovable.
- Substituída a estrutura de servidor por um aplicativo estático, sem backend necessário para os recursos encontrados neste ZIP.
- Rotas carregadas separadamente; jogos e outras páginas carregam sob demanda.
- 24 imagens convertidas para WebP: 5.907.696 para 1.511.636 bytes (74% a menos no conjunto convertido; não representa 74% de redução do site inteiro).
- Galeria móvel com cards de aproximadamente 94% da largura antes da perspectiva, arraste proporcional à tela, resposta mais rápida, captura do ponteiro e seleção baseada no toque atual.
- Botões anterior/próximo e link do tema central no celular; lista alternativa se a criação da galeria 3D falhar.
- Menu móvel, navegação com quebra de linha, títulos longos e painéis de minijogos ajustados para telas estreitas.
- Minijogos fora da tela ou em abas ocultas deixam de redesenhar continuamente.
- Visual, shaders e parâmetros da galeria para PC mantidos; modelo e animações do Teddy preservados.

## Dados e serviços

As imagens, áudios e o modelo 3D são locais. As fontes ainda são carregadas pelo Google Fonts, como no projeto original. Progresso e avatar são guardados no navegador; não há conta/banco de dados neste ZIP. Ao trocar o domínio, o progresso do domínio antigo não é transferido automaticamente. Nenhuma credencial é necessária para executar esta versão.

## Verificação e limites

Compilação de produção, TypeScript e teste do controle de arraste verificados. Conferidos no navegador: galeria, navegação para guia, início de minijogo e largura das páginas principais a 320/390 pixels, além da composição de desktop. O teste de arraste no navegador usa ponteiro; a validação de fluidez e gestos multitoque em Android/iPhone físico continua necessária. A aparência pode variar conforme a GPU e as preferências de redução de movimento.

Não foi feita revisão clínica do conteúdo educativo; textos e imagens de primeiros socorros foram preservados. O projeto original enviado continua intacto.
- Correção adicional: a sincronização entre narração e Teddy não registra/limpa o player a cada atualização de contexto; a página de jogos também passou a depender apenas da função estável de visibilidade. Isso elimina o ciclo de atualizações repetidas observado durante a validação.

## Jogos por exploração — atualização de 11/11/2026

A área `/jogos` agora tem seleção de cinco temas, duas fases por tema e três objetivos por fase. As URLs são `/jogos`, `/jogos?tema=engasgo` e `/jogos?tema=engasgo&fase=1`. Temas inválidos retornam à seleção inicial; fases inválidas retornam à seleção do tema. Apenas a fase selecionada fica montada.

As perguntas antigas, trilhas Kids/Teens, feedbacks, estrelas e certificado estão em `/missoes`. As perguntas das antigas minifases também estão nessa página, em painéis de revisão com alternativas e explicações. As páginas de guias continuam preservadas. Há links entre revisão e exploração.

### Jogar no Windows

1. Extraia o novo ZIP em uma pasta própria; mantenha o ZIP original guardado.
2. Instale Node.js 22.12 ou superior. Abra o PowerShell na pasta que contém `package.json`.
3. Execute os comandos abaixo, um de cada vez:

```powershell
npm ci
npm test
npm run check
npm run build
npm run dev
```

Abra o endereço exibido pelo Vite e acrescente `/jogos`. Para testar o `dist` em vez do código de desenvolvimento, encerre com Ctrl+C e execute `npm run preview`.

- Setas/WASD movimentam; segure E ou Espaço perto do marcador para agir, sem andar.
- Direcional e AGIR aceitam ponteiro contínuo com captura. Soltar, cancelar ou perder a captura interrompe o comando.
- Mantenha o toque no chão para definir um destino em linha reta; solte para parar. Não há cálculo automático de caminho: contorne os móveis pelo direcional ou use pontos intermediários.
- Esc ou Pausar interrompem o jogo. Sair do foco do jogo, perder o foco da janela ou ocultar a aba também pausa. Retome explicitamente com Continuar jogo.
- Personalizar pausa o jogo. Esc fecha o modal, Tab permanece nele, e o foco volta ao controle de origem. Ao fechar, o jogo permanece pausado.
- Reiniciar limpa o progresso parcial da fase. Conclusões anteriores permanecem registradas.

### Implementação e persistência

- `src/data/gameplay.ts`: dez fases, objetivos, alvos, pessoas, objetos e obstáculos.
- `src/components/minigames/movement.ts`: velocidade de 52 pixels virtuais/s, normalização diagonal, limites e colisões. Mundo de 360 × 202; intervalo limitado a 50 ms para evitar saltos após travamentos.
- `MiniGameShell.tsx`: posição/comandos em refs, loop estável, proximidade de 23 pixels, ações contínuas, marcadores, pausa e conclusão.
- `PixelRenderer.ts`: cenários e pixel art com passos nas quatro direções, costas sem detalhes frontais e variações de roupas/calçados.
- `AvatarCustomizerModal.tsx`: quatro vistas, opções selecionadas, prévia e modal acessível com Radix Dialog.
- `src/lib/avatarStore.ts`: chave `sinal_avatar_custom_v2`; valida todos os campos. A chave antiga v1 não é reaproveitada. Dados incompletos ou inválidos usam o padrão.
- `src/lib/gameProgress.ts`: chave `sinal_gameplay_v1`, contendo identificadores válidos de tema e fase. Não salva progresso parcial.
- Armazenamento indisponível não impede jogar: mantém dados na sessão e mostra aviso de falha ao salvar a conclusão/aparência.
- TanStack Router gera `src/routeTree.gen.ts` pelo plugin normal do Vite. React 19, Fiber 9, Drei 10, TypeScript estrito e o único TeddyProvider global foram mantidos. Os componentes originais do Teddy não foram modificados; seu contêiner flutuante fica oculto em `/jogos`.

### Validação desta entrega

- `npm ci`, `npm run check`, `npm run build`: concluídos.
- `npm test`: 13 testes aprovados. Incluem 30/60/120/144 Hz, diagonal, quatro lados de colisão, deslizamento, limites, intervalo longo, chegada ao destino, configuração das dez fases, validação de avatar e persistência com armazenamento bloqueado.
- Navegador: conclusão efetiva das dez fases e dos 30 objetivos; seleção de tema/fase; avanço; retorno; 2/2 conclusões por tema após recarregar; URLs inválidas; ação distante bloqueada; E/Espaço, setas, direcional e AGIR por ponteiro; pausa por Esc e saída de foco; reinício; personalização persistida; Esc e restauração de foco; Tab/Shift+Tab contidos no modal; revisão antiga respondida com feedback.
- Layout conferido em desktop e larguras de 320 e 390 pixels, incluindo jogo e modal. Registros visuais em `docs/`.
- A verificação de toque usou eventos de ponteiro do navegador. Gestos multitoque, cancelamento por gestos do sistema, troca de aplicativos/abas em celulares e fluidez em aparelhos Android/iPhone físicos ainda precisam de homologação. As taxas de 30 a 144 Hz foram verificadas pelo cálculo de movimento, não por quatro monitores físicos.
- O build conserva o aviso de bundle principal acima de 500 kB associado às dependências existentes. A instalação reportou 9 alertas de dependências (7 moderados, 2 altos); não foi aplicado `npm audit fix --force` nem alterada a pilha exigida. Recomenda-se uma revisão de dependências separada antes de publicar.

### Limites educativos e entrega

Os tempos das barras são abreviados e não representam a duração de procedimentos reais. Esta versão é uma base de exploração e busca de ajuda; não implementa compressões ou outras manobras clínicas. Os textos novos seguem o roteiro solicitado e ainda exigem revisão responsável da Enfermagem antes de publicação. As perguntas antigas foram preservadas, sem revisão clínica nesta etapa.

O novo ZIP inclui código-fonte, recursos locais, testes, documentação e `dist` atualizado. Exclui `node_modules`, caches, arquivos temporários e credenciais. O ZIP original não foi sobrescrito. Nenhuma publicação foi realizada.
