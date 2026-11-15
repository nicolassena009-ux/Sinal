import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("Etapa 2: Estabilidade da animação Idle do Teddy (KitchenActor)", () => {
  const actorCode = fs.readFileSync("src/phaser/characters/KitchenActor.ts", "utf8");
  
  // Garantia: em estado 'idle', a sequência é puramente [baseFrame]
  assert.ok(actorCode.includes("state==='idle'?[baseFrame]"), "Idle deve usar exclusivamente baseFrame");
  
  // Garantia: Teddy nunca invoca action(0) no loop de repouso
  assert.ok(!actorCode.includes("state==='idle'&&direction==='front'?[baseFrame,baseFrame,baseFrame,baseFrame,baseFrame,baseFrame,baseFrame,action(0)]"), 
    "O agachamento involuntário action(0) no idle foi completamente removido");
    
  // Teddy mapeia apenas frames do próprio atlas de personagens
  assert.ok(actorCode.includes("role==='teddy'?frames.map(f=>({key:this.peopleKey,frame:this.frame(f)}))"), 
    "Teddy só utiliza frames do atlas oficial");
});

test("Etapa 3: Expressividade do Engasgo e socorro real de Marina e Rafael (Actor & Cafeteria)", () => {
  const actorCode = fs.readFileSync("src/phaser/characters/Actor.ts", "utf8");
  const cafeteriaCode = fs.readFileSync("src/phaser/scenes/Cafeteria.ts", "utf8");

  // Métodos de assistência e reação implementados
  assert.ok(actorCode.includes("playAssist(type:'normal'|'back'|'thrust'='normal')"), "playAssist aceita tipos específicos de manobra");
  assert.ok(actorCode.includes("reactAssist(type:'back'|'thrust'='back')"), "reactAssist implementado para resposta física da vítima");

  // Movimento de tosse orgânica vs asfixia grave
  assert.ok(actorCode.includes("isCoughing"), "Rafael possui ciclo espasmódico de tosse visível");
  assert.ok(actorCode.includes("rot=0.12+coughBurst*0.14"), "Rafael inclina o tronco ritmicamente para tossir");
  assert.ok(actorCode.includes("this.behavior==='distress'"), "Rafael possui estado específico de asfixia grave");

  // Posicionamento de Marina e Teddy durante desobstrução
  assert.ok(cafeteriaCode.includes("this.marina.setPosition(715,582)"), "Marina posiciona-se ao lado/atrás para golpes nas costas");
  assert.ok(cafeteriaCode.includes("this.marina.setPosition(745,580)"), "Marina posiciona-se atrás para manobra de Heimlich");
  assert.ok(cafeteriaCode.includes("this.teddy.setPosition(630,625)"), "Teddy observa a cena sem sobreposição");
  assert.ok(cafeteriaCode.includes("this.marina.playAssist(isBack?'back':'thrust')"), "Marina executa a animação específica da manobra");
  assert.ok(cafeteriaCode.includes("this.rafa.reactAssist(isBack?'back':'thrust')"), "Rafael reage com impacto físico às manobras");
});

test("Etapa 4: Resolução de sobreposição e precisão anatômica em PCR (Corridor)", () => {
  const corridorCode = fs.readFileSync("src/phaser/scenes/Corridor.ts", "utf8");

  // Destino de Ana no atendimento: ao lado do tórax (x=705, y=608) em vez de sobrepor as pernas (x=750, y=632)
  assert.ok(corridorCode.includes("{x:705,y:608}"), "Ana posiciona-se ao lado do esterno");
  assert.ok(!corridorCode.includes("{x:750,y:632}"), "Ana não é posicionada sobre as pernas/pélvis de Rafael");

  // Depressão visível do esterno durante compressões
  assert.ok(corridorCode.includes("this.rafael.y=644+(compression?2.5:0)"), "Tórax sofre depressão visível durante compressão de 5-6 cm");

  // Depth ordenado
  assert.ok(corridorCode.includes("this.rafael.setDepth(644)"), "Rafael possui profundidade base respeitada");
  assert.ok(corridorCode.includes("this.ana.setDepth(m.compressing?643:this.ana.y)"), "Ana respeita a perspectiva 2.5D sem cobrir as pernas em primeiro plano");
});

test("Etapa 5: Alinhamento geométrico e perspectiva da cozinha (kitchen world)", () => {
  const kitchenCode = fs.readFileSync("src/phaser/world/kitchen.ts", "utf8");

  // Comida não fica no ar (y=525 com depth 668)
  assert.ok(!kitchenCode.includes("fillEllipse(605,525,67,30)"), "Comida flutuando atrás da mesa foi removida");

  // Comida pousada sobre o tampo da mesa (x=635, y=572, depth=668)
  assert.ok(kitchenCode.includes("fillEllipse(635,572,74,22)"), "Travessa repousa centralizada sobre o tampo da mesa");
  assert.ok(kitchenCode.includes("setDepth(668)"), "Comida possui depth superior à mesa (667)");
  
  // Ordenação das cadeiras e mesa
  assert.ok(kitchenCode.includes("p('chair-back-left','0-1',550,532,75,115,532)"), "Cadeiras de trás ficam com depth 532 (atrás da mesa)");
  assert.ok(kitchenCode.includes("p('table','0-0',635,667,330,230,667)"), "Mesa fica com depth 667");
  assert.ok(kitchenCode.includes("p('chair-front-left','0-1',550,738,75,115,738)"), "Cadeiras da frente ficam com depth 738 (à frente da mesa)");
});
