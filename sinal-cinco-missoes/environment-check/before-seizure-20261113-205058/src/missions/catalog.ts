import type {MissionId} from '../integration/contract';
import type {MissionPresentation} from '../core/mission';
export const PRESENTATIONS:Record<MissionId,MissionPresentation>={
 choking:{number:'01',title:'Emergência no refeitório',place:'Refeitório'},
 seizure:{number:'02',title:'Cuidado na sala de aula',place:'Sala de aula'},
 cardiac_arrest:{number:'03',title:'Ajuda no corredor',place:'Corredor'},
 burns:{number:'02',title:'Queimaduras: Agir com Segurança',place:'Cozinha residencial'},
 trauma:{number:'05',title:'Proteção no pátio',place:'Pátio e quadra'},
};
