import type {EducationalResult,Mode,MissionId} from '../integration/contract';
import type {Vec} from '../core/movement';
export type SupportId=Exclude<MissionId,'choking'>;
export interface Task {id:string;target:string;title:string;instruction:string;verb:string;effect?:'pickup'|'drop'|'adult'|'call'|'mark'|'observe';}
export interface SupportDefinition {id:SupportId;incident:string;outcome:string;tasks:Task[];}
export const SUPPORT:Record<SupportId,SupportDefinition>={
 seizure:{id:'seizure',incident:'Lia: Rafa caiu e está com movimentos involuntários. Não sabemos se ele já teve uma crise. Vamos chamar a professora e deixar o espaço seguro.',outcome:'A professora assumiu o cuidado e acionou ajuda para esta primeira crise observada. Teddy manteve o espaço livre. Não houve treino de contenção ou manobras clínicas.',tasks:[
  {id:'observe',target:'victim',title:'Observe sem segurar',instruction:'Não tente conter os movimentos nem colocar objetos na boca. Observe de perto, mantendo espaço.',verb:'Observar os sinais',effect:'observe'},
  {id:'adult',target:'adult',title:'Chame a professora',instruction:'Explique onde Rafa está. Marina vai se aproximar pelo caminho livre.',verb:'“Marina, precisamos de ajuda!”',effect:'adult'},
  {id:'bag',target:'bag',title:'Retire a mochila do espaço',instruction:'Pegue a mochila solta próxima da área. Você não vai mover Rafa.',verb:'Pegar mochila',effect:'pickup'},
  {id:'store',target:'safe',title:'Leve a mochila ao local seguro',instruction:'Caminhe até o tapete indicado para deixar o objeto fora da passagem.',verb:'Guardar mochila',effect:'drop'},
  {id:'help',target:'phone',title:'Acione apoio para esta situação',instruction:'É a primeira crise que a escola presenciou. Com a professora, informe o local ao socorro. A chamada é simulada.',verb:'Comunicar localização e situação',effect:'call'},
  {id:'stay',target:'victim',title:'Continue por perto',instruction:'Teddy acompanha a professora, sem segurar Rafa. Técnicas posteriores aguardam validação da Enfermagem.',verb:'Relatar o que observou',effect:'observe'}]},
 cardiac_arrest:{id:'cardiac_arrest',incident:'Lia: O funcionário caiu. Ele não responde e não parece respirar normalmente. Precisamos de socorro agora.',outcome:'O socorro foi acionado e o DEA foi levado ao adulto treinado. A missão termina na transferência do cuidado, sem afirmar recuperação ou ensinar compressões sem revisão clínica.',tasks:[
  {id:'recognize',target:'victim',title:'Reconheça a urgência',instruction:'Ausência de resposta e respiração ausente ou anormal exigem ação urgente. Este protótipo não ensina técnica ou ritmo de RCP.',verb:'Reconhecer e pedir ajuda',effect:'observe'},
  {id:'call',target:'phone',title:'Acione o socorro',instruction:'Use o telefone da escola para comunicar o local e a situação. Na vida real, siga o atendente; esta tela não faz ligações.',verb:'Simular chamada ao 192',effect:'call'},
  {id:'adult',target:'adult',title:'Encontre o adulto treinado',instruction:'Teddy aponta o local. A professora assume a assistência imediata; você ajuda com os recursos.',verb:'Direcionar Marina até a vítima',effect:'adult'},
  {id:'aed',target:'resource',title:'Busque o DEA indicado',instruction:'Pegue o equipamento para levar à professora. Aplicação de pás e choque não são simulados nesta versão.',verb:'Pegar o DEA',effect:'pickup'},
  {id:'deliver',target:'victim',title:'Entregue à professora',instruction:'Volte pelo corredor livre e entregue o recurso ao adulto treinado.',verb:'Entregar o DEA',effect:'drop'},
  {id:'clear',target:'safe',title:'Mantenha o acesso livre',instruction:'Sinalize o espaço de chegada da equipe. Não se apresenta espera passiva como resposta à parada.',verb:'Sinalizar acesso ao socorro',effect:'mark'}]},
 burns:{id:'burns',incident:'Na cozinha supervisionada, um recipiente quente causou uma queimadura no braço de Rafa. A equipe adulta está presente.',outcome:'O risco foi comunicado, a área foi sinalizada e os recursos foram preparados para o adulto. A técnica de cuidado da queimadura não foi simulada nem pontuada.',tasks:[
  {id:'risk',target:'hazard',title:'Reconheça o risco',instruction:'Observe a bancada a partir do ponto seguro. Não toque no recipiente quente.',verb:'Identificar e sinalizar o calor',effect:'mark'},
  {id:'adult',target:'adult',title:'Avise quem supervisiona',instruction:'Chame Marina e explique o que aconteceu. O adulto cuida da fonte de calor e do atendimento.',verb:'Chamar a supervisora',effect:'adult'},
  {id:'cone',target:'resource',title:'Pegue a sinalização',instruction:'Teddy ajuda impedindo que outras pessoas se aproximem da bancada.',verb:'Pegar placa de cuidado',effect:'pickup'},
  {id:'isolate',target:'safe',title:'Sinalize a passagem',instruction:'Leve a placa ao ponto marcado, sem entrar na área quente.',verb:'Colocar sinalização',effect:'drop'},
  {id:'sink',target:'sink',title:'Mostre onde está a pia',instruction:'Aponte o recurso à supervisora. A técnica, duração e critérios de encaminhamento precisam de revisão clínica antes de virar minijogo.',verb:'Indicar recurso à equipe',effect:'mark'},
  {id:'report',target:'victim',title:'Acompanhe com o adulto',instruction:'Relate a ocorrência sem oferecer receitas caseiras. A equipe assume os cuidados.',verb:'Concluir relato à supervisora',effect:'observe'}]},
 trauma:{id:'trauma',incident:'Rafa caiu no pátio perto da quadra. Há uma bola solta na passagem e ele relata dor. Primeiro, proteja o local e busque ajuda.',outcome:'O local ficou sinalizado, a passagem foi liberada e um adulto assumiu o cuidado. Rafa não foi levantado ou transportado pelo jogador.',tasks:[
  {id:'scene',target:'victim',title:'Observe a segurança do local',instruction:'Aproxime-se pelo caminho livre. Não tente levantar ou movimentar a vítima.',verb:'Observar e conversar',effect:'observe'},
  {id:'adult',target:'adult',title:'Peça ajuda responsável',instruction:'Teddy informa à professora onde ocorreu a queda.',verb:'Chamar Marina',effect:'adult'},
  {id:'ball',target:'resource',title:'Retire a bola da passagem',instruction:'Pegue apenas a bola solta. A vítima permanece no lugar.',verb:'Pegar bola',effect:'pickup'},
  {id:'safe',target:'safe',title:'Guarde fora da circulação',instruction:'Leve a bola ao local marcado para evitar outro tropeço.',verb:'Guardar bola',effect:'drop'},
  {id:'call',target:'phone',title:'Ajude a comunicar a ocorrência',instruction:'Com a professora, informe a localização e o que observou. É uma simulação de comunicação.',verb:'Comunicar queda e localização',effect:'call'},
  {id:'protect',target:'victim',title:'Permaneça com a vítima',instruction:'Converse com Rafa e mantenha o acesso livre. Avaliação e técnicas de imobilização não são ensinadas nesta versão.',verb:'Acompanhar até a transferência',effect:'observe'}]},
};
export class SupportMission {
 phase='explore';elapsed=0;completed:string[]=[];index=0;travel=0;talked=false;carrying=false;
 constructor(public definition:SupportDefinition,public mode:Mode,private onObjective:(id:string)=>void){}
 get task(){return this.definition.tasks[this.index];}
 tick(dt:number){this.elapsed+=dt;if(this.phase==='explore'&&this.elapsed>=4&&(this.travel>=120||this.talked))this.phase='incident';}
 engage(){if(this.phase==='incident'){this.phase='task';return true;}return false;}
 perform(target:string){if(this.phase!=='task'||target!==this.task.target)return false;
  if(this.task.effect==='pickup')this.carrying=true;if(this.task.effect==='drop'&&!this.carrying)return false;if(this.task.effect==='drop')this.carrying=false;
  this.completed.push(this.task.id);this.onObjective(this.task.id);this.index++;if(this.index===this.definition.tasks.length)this.phase='complete';return true;
 }
 result():EducationalResult{return{mode:this.mode,objectives:[...this.completed],corrections:0,durationSeconds:Math.round(this.elapsed),clinicalReview:'pending'};}
}
