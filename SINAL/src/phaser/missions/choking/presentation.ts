import type {Hud} from '../../ui/Hud';
import type {ChokingMission} from '../choking';

export function showChokingProcedure(hud:Hud, m:ChokingMission){
  const back = m.phase === 'back';
  const kids = m.mode === 'kids';

  const title = back ? 'Golpes nas costas (região dorsal)' : 'Compressões abdominais (manobra de Heimlich)';
  const instruction = kids
    ? 'A professora Marina realiza a manobra. Acompanhe a ação e ajude a contar cada impulso.'
    : back
      ? 'Vítima inclinada para a frente. Aplique golpes firmes com o calcanhar da mão entre as escápulas.'
      : 'Posicione o punho fechado acima do umbigo e abaixo do esterno. Puxe firme para dentro e para cima (em "J").';

  const actionLabel = kids ? 'Acompanhar ação da professora' : 'Praticar movimento · E';

  const svgContent = back
    ? `
      <svg viewBox="0 0 320 180" role="img" aria-label="Diagrama anatômico de golpes nas costas entre as escápulas">
        <defs>
          <linearGradient id="gradBack" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#6d3fc3" stop-opacity="0.15"/>
            <stop offset="100%" stop-color="#53c6b6" stop-opacity="0.2"/>
          </linearGradient>
        </defs>
        <rect x="8" y="8" width="304" height="164" rx="14" fill="url(#gradBack)" stroke="#6d3fc3" stroke-width="1.5" stroke-dasharray="4 3"/>
        <g transform="translate(45, 10)">
          <!-- Silhueta da vítima inclinada para frente -->
          <ellipse cx="110" cy="148" rx="60" ry="7" fill="#243e3b" opacity="0.12"/>
          <!-- Tronco e pernas inclinados -->
          <path d="M 85 135 L 75 145 M 105 135 L 115 145" stroke="#2e7dd1" stroke-width="14" stroke-linecap="round"/>
          <path d="M 88 125 L 125 78 L 155 88 L 125 130 Z" fill="#ffc044" stroke="#d49b28" stroke-width="2"/>
          <circle cx="168" cy="74" r="16" fill="#e7b592"/>
          <!-- Zona de impacto interescapular -->
          <circle cx="118" cy="88" r="15" fill="#ff60a7" fill-opacity="0.3" stroke="#ff60a7" stroke-width="2" stroke-dasharray="3 3"/>
          <circle cx="118" cy="88" r="6" fill="#ff60a7"/>
          <!-- Mão socorrista com impulso -->
          <path class="assist-hand" d="M 60 72 L 105 84" fill="none" stroke="#6d3fc3" stroke-width="10" stroke-linecap="round"/>
          <path d="M 102 78 L 116 85 L 103 93 Z" fill="#6d3fc3"/>
          <text x="180" y="45" fill="#6d3fc3" font-size="12" font-weight="bold">Entre as escápulas</text>
          <text x="180" y="62" fill="#594233" font-size="10">Base da mão espalmada</text>
          <text x="210" y="105" fill="#6d3fc3" font-size="34" font-weight="bold">→</text>
        </g>
      </svg>
    `
    : `
      <svg viewBox="0 0 320 180" role="img" aria-label="Diagrama anatômico de compressões abdominais em J">
        <defs>
          <linearGradient id="gradAbdomen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#2e7dd1" stop-opacity="0.15"/>
            <stop offset="100%" stop-color="#ff60a7" stop-opacity="0.2"/>
          </linearGradient>
        </defs>
        <rect x="8" y="8" width="304" height="164" rx="14" fill="url(#gradAbdomen)" stroke="#2e7dd1" stroke-width="1.5" stroke-dasharray="4 3"/>
        <g transform="translate(45, 10)">
          <ellipse cx="110" cy="148" rx="55" ry="7" fill="#243e3b" opacity="0.12"/>
          <!-- Vítima de pé -->
          <path d="M 98 120 L 92 145 M 122 120 L 128 145" stroke="#2e7dd1" stroke-width="14" stroke-linecap="round"/>
          <rect x="90" y="62" width="40" height="62" rx="12" fill="#ffc044" stroke="#d49b28" stroke-width="2"/>
          <circle cx="110" cy="46" r="16" fill="#e7b592"/>
          <!-- Posicionamento do punho acima do umbigo -->
          <circle cx="110" cy="94" r="12" fill="#ff60a7" fill-opacity="0.35" stroke="#ff60a7" stroke-width="2" stroke-dasharray="3 3"/>
          <circle cx="110" cy="94" r="5" fill="#ff60a7"/>
          <!-- Mãos e seta em curva (em J: para dentro e para cima) -->
          <path class="assist-hand" d="M 68 102 C 90 102, 102 100, 108 92" fill="none" stroke="#6d3fc3" stroke-width="10" stroke-linecap="round"/>
          <path d="M 103 84 L 112 88 L 114 78 Z" fill="#6d3fc3"/>
          <text x="165" y="45" fill="#2e7dd1" font-size="12" font-weight="bold">Acima do umbigo</text>
          <text x="165" y="62" fill="#594233" font-size="10">Abaixo do osso esterno</text>
          <text x="165" y="78" fill="#6d3fc3" font-size="10" font-weight="bold">Movimento em "J" (↑)</text>
          <text x="210" y="115" fill="#ff60a7" font-size="34" font-weight="bold">↑</text>
        </g>
      </svg>
    `;

  hud.show(
    title,
    instruction,
    [
      { label: actionLabel, action: 'gesture' },
      { label: 'Reavaliar respiração e sinais', action: 'check' }
    ],
    `<div class="sinal-procedure-art" data-gesture="${back ? 'back' : 'abdomen'}">
       ${svgContent}
       <span>${kids ? 'A PROFESSORA EXECUTA · OBSERVE A AÇÃO' : back ? 'ARRASTE → OU PRESSIONE E' : 'ARRASTE ↑ OU PRESSIONE E'}</span>
     </div>
     <div class="sinal-count">
       ${[0, 1, 2, 3, 4].map(i => `<i class="${i < m.count ? 'done' : ''}">${i + 1}</i>`).join('')}
     </div>
     <small style="display:block;margin-top:6px;font-size:9px;color:#7a897c;line-height:1.4">
       Simulação educativa guiada. Na vida real, alterne 5 golpes dorsais com 5 compressões abdominais. Se houver desmaio/inconsciência, deite a vítima e inicie RCP. Lactentes (< 1 ano) exigem técnica pediátrica própria. Revisão clínica pendente.
     </small>`
  );
}
