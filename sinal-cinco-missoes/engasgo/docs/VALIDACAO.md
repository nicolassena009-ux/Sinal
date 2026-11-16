# Registro de validação — 12/11/2026

**Registro histórico da versão inicial.** A etapa visual 02 acrescenta assets pixel art e navegação A*. Consulte `ETAPA-VISUAL-02.md` para o estado atual e resultados adicionais.

## Executado

| Verificação | Resultado |
| --- | --- |
| `npm test` / Vitest | 15 testes aprovados |
| TypeScript estrito (`tsc --noEmit`) | aprovado |
| `npm run build` / Vite | aprovado; `dist/` gerado |
| Playwright / Chromium Headless Shell 158 | cinco cenários aprovados, considerando a repetição isolada do teste mobile |
| Inspeção de imagens | menu, exploração, procedimento Teens, resultado e retrato mobile inspecionados |

Os quatro cenários de navegador de desktop/progressão passaram na última execução completa. O teste mobile inicialmente falhou porque a automação encerrava o toque do joystick em vez do toque do botão. A lista de pontos encerrados no comando CDP foi corrigida; a repetição isolada passou. Não se alterou a implementação do joystick para acomodar o teste. Não há teste conhecido pendente de falha na versão entregue.

### Quinze testes de lógica

Direções e término de animações não repetitivas; reprodução por tempo em 30/60 atualizações; objetos dentro/fora do alcance; normalização diagonal; zona morta e velocidade analógica; colisão e deslizamento; limites/delta; proximidade de NPCs; conclusão Kids; conclusão Teens; bloqueio de manobras na tosse eficaz e de saltos na sequência; proteção contra ações sobrepostas; correção de água/varredura cega na máquina de estados; interrupção por inconsciência; validação da versão do contrato.

### Cinco cenários de navegador

1. Menu → deslocamento real por teclado → pausa sem avanço da missão → resize 844 × 390 → retorno, sem canvas ou HUD remanescentes.
2. Teens: tosse, observação, incentivo, sinais graves, professora, delegação de socorro, preparo por teclado, dez ações, recuperação, tela final, seis eventos de objetivos, uma conclusão e reinício com uma única instância.
3. Kids: mesma progressão, com ações explicitamente atribuídas à professora. Estados da vítima e observação do avatar verificados.
4. Mobile emulado: joystick proporcional, retorno ao centro, dois toques simultâneos, liberação do segundo toque sem zerar o primeiro e aviso em retrato 390 × 844.
5. Percurso real da entrada até Rafa sem teletransporte, inspeção da entrada, ausência de penetração nos móveis, início natural da emergência, progressão e gesto de arrasto nas costas.

Nos cenários 2 e 3, o relógio da abertura é adiantado e o avatar é reposicionado perto dos NPCs para testar a sequência de forma determinística. No cenário 5, o percurso inicial é realizado por teclado; depois, reposicionamentos aceleram a validação do gesto. O gancho `sinalTest` só existe em desenvolvimento, com `?test=1`; o build de produção não o instala.

## Recursos e desempenho

Build final: JavaScript de lançamento aproximadamente 5,6 kB e chunk do jogo/Phaser aproximadamente 1,24 MB (345 kB gzip). O Vite emitiu aviso de chunk acima de 500 kB. Esse chunk é carregado sob demanda; o aviso não foi ocultado. Não foi medida taxa sustentada de quadros ou consumo de memória em aparelhos reais. Descarregamento foi verificado funcionalmente, não com análise de heap.

O Edge instalado no sistema não iniciou no ambiente restrito. Os testes efetivos usaram uma cópia isolada do Chromium baixada pelo Playwright; nenhuma sessão pessoal do navegador foi usada.

## Não validado

Assets e personalização oficiais do Teddy; vídeo da Enfermagem; integração com stores reais do Sinal; React dentro do site existente; mobile físico e Safari/iOS; tela cheia em todos os navegadores; acessibilidade por leitor de tela; domínio clínico ou aprendizagem dos alunos; duração humana de 4–7 minutos. A meta de duração depende de playtest, leitura e exploração, e não foi declarada atingida.

O parecer acadêmico deve revisar especialmente as ilustrações esquemáticas, o papel do avatar no modo Teens, o roteiro de piora da tosse, as orientações posteriores e o encaminhamento em caso de inconsciência. A aprovação técnica dos testes não substitui esse parecer.

## Imagens

As imagens em `screenshots/` são capturas reais do navegador, não mockups. Demonstram o estágio visual provisório desta entrega.
