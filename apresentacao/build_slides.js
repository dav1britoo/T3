/* Gera apresentacao.pptx — UVA 10080 Gopher II (Grupo OF)
   Paleta "Forest & Moss" (tema gophers/tocas) + acento clay.            */
const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";            // 13.3 x 7.5
pres.author = "Grupo OF";
pres.title = "UVA 10080 - Gopher II";

const W = 13.3, H = 7.5;
const C = {
  dark: "1E2A18", forest: "2C5F2D", moss: "6E9A4F", mossLt: "CBDDAE",
  cream: "F4F2E9", card: "FFFFFF", ink: "26301C", muted: "6E7A5E",
  clay: "C2702A", clayLt: "F0DDC4", line: "9DB07F",
};
const HF = "Georgia", BF = "Calibri", MF = "Consolas";

function bg(s, color){ s.background = { color }; }
function mk(extra){ return Object.assign({ fontFace: BF, color: C.ink }, extra); }

// cabecalho de slide de conteudo
function header(s, kicker, title){
  s.addText(kicker.toUpperCase(), mk({ x:0.6, y:0.42, w:12.1, h:0.32, fontSize:12,
    color:C.clay, bold:true, charSpacing:3, margin:0 }));
  s.addText(title, mk({ x:0.6, y:0.72, w:12.1, h:0.7, fontSize:30, bold:true,
    fontFace:HF, color:C.forest, margin:0 }));
}

// no (oval) com rotulo
function node(s, x, y, w, h, label, fill, txt){
  s.addShape(pres.shapes.OVAL, { x, y, w, h, fill:{color:fill},
    line:{color:"FFFFFF", width:1.5},
    shadow:{type:"outer", color:"000000", blur:5, offset:2, angle:135, opacity:0.18} });
  s.addText(label, { x, y, w, h, align:"center", valign:"middle", fontFace:BF,
    fontSize:13, bold:true, color:txt, margin:0 });
}
// aresta (linha) de (x1,y1) a (x2,y2)
function edge(s, x1,y1,x2,y2, color, width){
  const x=Math.min(x1,x2), y=Math.min(y1,y2), w=Math.abs(x2-x1), h=Math.abs(y2-y1);
  const up = (x2>x1 && y2<y1) || (x2<x1 && y2>y1);
  s.addShape(pres.shapes.LINE, { x, y, w:Math.max(w,0.001), h:Math.max(h,0.001),
    line:{color, width, endArrowType:"triangle"}, flipV: up });
}

/* ===================== SLIDE 1 — TITULO ===================== */
(() => {
  const s = pres.addSlide(); bg(s, C.dark);
  // motivo de rede no canto direito
  const mx=9.2;
  edge(s, mx+0.6, 3.6, mx+2.0, 2.4, C.moss, 2);
  edge(s, mx+0.6, 3.6, mx+2.0, 4.8, C.moss, 2);
  edge(s, mx+2.5, 2.4, mx+3.0, 3.6, C.moss, 2);
  edge(s, mx+2.5, 4.8, mx+3.0, 3.6, C.moss, 2);
  node(s, mx, 3.15, 0.9, 0.9, "S", C.clay, "FFFFFF");
  node(s, mx+2.0, 2.0, 0.9, 0.9, "g", C.forest, "FFFFFF");
  node(s, mx+2.0, 4.35, 0.9, 0.9, "g", C.forest, "FFFFFF");
  node(s, mx+3.0, 3.15, 0.9, 0.9, "T", C.clay, "FFFFFF");

  s.addText("TRABALHO PRÁTICO 3  ·  FLUXO MÁXIMO EM REDES", mk({ x:0.7, y:1.5, w:8.5,
    h:0.4, fontSize:14, color:C.mossLt, bold:true, charSpacing:3, margin:0 }));
  s.addText("Gopher II", mk({ x:0.65, y:2.0, w:8.5, h:1.3, fontSize:64, bold:true,
    fontFace:HF, color:C.cream, margin:0 }));
  s.addText("UVA 10080 — Emparelhamento bipartido modelado como rede de fluxo",
    mk({ x:0.7, y:3.35, w:8.2, h:0.6, fontSize:18, color:C.mossLt, margin:0 }));

  s.addShape(pres.shapes.LINE, { x:0.72, y:4.15, w:3.2, h:0, line:{color:C.clay, width:2.5} });
  s.addText([
    { text:"Grupo OF", options:{ bold:true, color:C.cream } },
    { text:"  ·  (integrantes: preencher nomes e RAs)", options:{ color:C.muted } },
  ], mk({ x:0.7, y:4.45, w:8.5, h:0.4, fontSize:15, margin:0 }));
  s.addText("Resolução de Problemas com Grafos  ·  Prof. Me. Ricardo Carubbi",
    mk({ x:0.7, y:6.7, w:9, h:0.4, fontSize:12, color:C.muted, margin:0 }));
})();

/* ============ SLIDE 2 — CONTEXTO E OBJETIVO (1 min) ============ */
(() => {
  const s = pres.addSlide(); bg(s, C.cream);
  header(s, "1 · até 1 minuto", "Contexto e objetivo");

  s.addText([
    { text:"n gophers e m buracos", options:{ bold:true } },
    { text:" em coordenadas (x, y) no plano. Um falcão chega.", options:{} },
  ], mk({ x:0.6, y:1.75, w:6.6, h:0.6, fontSize:16, bullet:{indent:18}, margin:0 }));
  s.addText([
    { text:"Um gopher se salva se alcança um buraco em ", options:{} },
    { text:"≤ s segundos", options:{ bold:true } },
    { text:" à velocidade ", options:{} },
    { text:"v", options:{ bold:true, italic:true } },
    { text:".", options:{} },
  ], mk({ x:0.6, y:2.45, w:6.6, h:0.7, fontSize:16, bullet:{indent:18}, margin:0 }));
  s.addText([
    { text:"Cada buraco abriga no máximo 1 gopher", options:{ bold:true } },
    { text:" (recurso disputado).", options:{} },
  ], mk({ x:0.6, y:3.35, w:6.6, h:0.6, fontSize:16, bullet:{indent:18}, margin:0 }));
  s.addText("É um problema de emparelhamento bipartido  gophers ↔ buracos.",
    mk({ x:0.6, y:4.15, w:6.6, h:0.5, fontSize:16, italic:true, color:C.forest, margin:0 }));

  // card objetivo
  const cx=7.7, cw=5.0;
  s.addShape(pres.shapes.RECTANGLE, { x:cx, y:1.7, w:cw, h:4.9, fill:{color:C.forest},
    shadow:{type:"outer", color:"000000", blur:8, offset:3, angle:135, opacity:0.2} });
  s.addText("OBJETIVO", mk({ x:cx+0.4, y:2.0, w:cw-0.8, h:0.4, fontSize:14, bold:true,
    color:C.mossLt, charSpacing:3, margin:0 }));
  s.addText([
    { text:"Minimizar gophers vulneráveis\n", options:{ color:C.mossLt } },
    { text:"= MAXIMIZAR gophers salvos", options:{ bold:true, color:"FFFFFF" } },
  ], mk({ x:cx+0.4, y:2.45, w:cw-0.8, h:1.0, fontSize:21, fontFace:HF, margin:0, lineSpacingMultiple:1.05 }));

  s.addShape(pres.shapes.RECTANGLE, { x:cx+0.4, y:3.75, w:cw-0.8, h:1.5, fill:{color:"FFFFFF"} });
  s.addText([
    { text:"alcança ⇔ distância ≤ s·v\n", options:{ breakLine:true } },
    { text:"⇔ distância² ≤ (s·v)²", options:{ bold:true } },
  ], { x:cx+0.55, y:3.9, w:cw-1.1, h:1.2, fontFace:MF, fontSize:16, color:C.ink,
    align:"center", valign:"middle", margin:0 });
  s.addText("Comparar quadrados evita raiz quadrada e erro de ponto flutuante.",
    mk({ x:cx+0.4, y:5.45, w:cw-0.8, h:0.9, fontSize:13, italic:true, color:C.mossLt, margin:0 }));
})();

/* ====== SLIDE 3 — MODELAGEM: A REDE (diagrama) (1 min) ====== */
(() => {
  const s = pres.addSlide(); bg(s, C.cream);
  header(s, "2 · até 1 minuto", "Modelagem: a rede de fluxo");

  // colunas
  const cols = [["origem",1.15],["gophers",3.85],["buracos",6.95],["sorvedouro",9.85]];
  // posicoes dos nos
  const Sx=1.0, Scy=3.95, Sd=1.0;
  const gx=3.55, gw=1.5, gh=0.85, g1=3.1, g2=4.8;
  const bx=6.85, b1=3.1, b2=4.8;
  const Tx=9.85, Tcy=3.95, Td=1.0;
  // arestas (atras)
  const Sr=Sx+Sd, gl=gx, gr=gx+gw, bl=bx, br=bx+gw, Tl=Tx;
  edge(s, Sr, Scy+Sd/2, gl, g1+gh/2, C.line, 2);
  edge(s, Sr, Scy+Sd/2, gl, g2+gh/2, C.line, 2);
  edge(s, gr, g1+gh/2, bl, b1+gh/2, C.line, 2);
  edge(s, gr, g2+gh/2, bl, b2+gh/2, C.line, 2);
  edge(s, gr, g2+gh/2, bl, b1+gh/2, C.clay, 2);   // aresta cruzada: buraco disputado
  edge(s, br, b1+gh/2, Tl, Tcy+Td/2, C.line, 2);
  edge(s, br, b2+gh/2, Tl, Tcy+Td/2, C.line, 2);
  // nos
  node(s, Sx, Scy, Sd, Sd, "S", C.clay, "FFFFFF");
  node(s, gx, g1, gw, gh, "gopher 1", C.forest, "FFFFFF");
  node(s, gx, g2, gw, gh, "gopher 2", C.forest, "FFFFFF");
  node(s, bx, b1, gw, gh, "buraco 1", C.moss, "FFFFFF");
  node(s, bx, b2, gw, gh, "buraco 2", C.moss, "FFFFFF");
  node(s, Tx, Tcy, Td, Td, "T", C.clay, "FFFFFF");
  // rotulos de coluna
  cols.forEach(([t,x]) => s.addText(t, mk({ x:x-0.4, y:2.35, w:1.9, h:0.35, fontSize:13,
    bold:true, color:C.muted, align:"center", charSpacing:1, margin:0 })));
  // legenda de capacidade
  s.addText("todas as capacidades = 1", mk({ x:3.3, y:1.95, w:6.7, h:0.34, fontSize:13,
    bold:true, color:C.clay, align:"center", margin:0 }));

  s.addText([
    { text:"1 unidade de fluxo = 1 gopher que ocupa 1 buraco", options:{ bold:true, color:C.forest } },
    { text:"   (uma decisão válida do enunciado)", options:{ color:C.muted } },
  ], mk({ x:0.6, y:6.35, w:12, h:0.5, fontSize:15, align:"center", margin:0 }));
})();

/* ===== SLIDE 4 — VERTICES, ARESTAS E CAPACIDADES (tabela) ===== */
(() => {
  const s = pres.addSlide(); bg(s, C.cream);
  header(s, "2 · até 1 minuto", "Vértices, arestas e capacidades");

  const head = (t)=>({ text:t, options:{ bold:true, color:"FFFFFF", fill:{color:C.forest}, fontFace:BF } });
  const rows = [
    [head("Componente"), head("Papel no contexto do problema"), head("Cap.")],
    ["S — origem", "empurrar 1 unidade por gopher = \"tentar salvar este gopher\"", "—"],
    ["gophers (camada 1)", "um vértice por gopher", "—"],
    ["buracos (camada 2)", "um vértice por buraco", "—"],
    ["T — sorvedouro", "chegar em T = gopher escondido (salvo)", "—"],
    [{text:"S → gopher", options:{bold:true}}, "cada gopher se salva no máximo uma vez", {text:"1",options:{bold:true,color:C.clay}}],
    [{text:"gopher → buraco", options:{bold:true}}, "criada só se o gopher alcança o buraco — é uma fuga válida", {text:"1",options:{bold:true,color:C.clay}}],
    [{text:"buraco → T", options:{bold:true}}, "cada buraco abriga no máximo um gopher", {text:"1",options:{bold:true,color:C.clay}}],
  ];
  s.addTable(rows, { x:0.6, y:1.7, w:7.7, colW:[2.0,4.7,1.0], rowH:0.42,
    fontFace:BF, fontSize:12.5, color:C.ink, valign:"middle",
    border:{pt:0.5, color:"D9D6C8"}, fill:{color:"FFFFFF"}, align:"left",
    margin:[2,4,2,4] });

  // card lateral: porque capacidade 1
  const cx=8.6, cw=4.1;
  s.addShape(pres.shapes.RECTANGLE, { x:cx, y:1.7, w:cw, h:4.85, fill:{color:"FFFFFF"},
    line:{color:C.mossLt, width:1.5} });
  s.addShape(pres.shapes.RECTANGLE, { x:cx, y:1.7, w:0.1, h:4.85, fill:{color:C.clay} });
  s.addText("Por que cap. = 1?", mk({ x:cx+0.35, y:1.9, w:cw-0.6, h:0.4, fontSize:16,
    bold:true, fontFace:HF, color:C.forest, margin:0 }));
  s.addText([
    { text:"Unitária", options:{ bold:true, color:C.clay, breakLine:true } },
    { text:"recurso indivisível, usado uma única vez (1 gopher / 1 buraco).", options:{ breakLine:true } },
    { text:"\n", options:{ breakLine:true } },
    { text:"Seria ∞", options:{ bold:true, color:C.clay, breakLine:true } },
    { text:"se não houvesse limite de passagem na aresta.", options:{ breakLine:true } },
    { text:"\n", options:{ breakLine:true } },
    { text:"Seria = k", options:{ bold:true, color:C.clay, breakLine:true } },
    { text:"se um recurso tivesse k cópias (não é o caso aqui).", options:{ breakLine:true } },
  ], mk({ x:cx+0.35, y:2.4, w:cw-0.6, h:2.6, fontSize:12.5, margin:0, lineSpacingMultiple:1.0 }));
  s.addText("Sem arestas paralelas, não-direcionadas ou múltiplas cópias neste problema.",
    mk({ x:cx+0.35, y:5.05, w:cw-0.6, h:0.6, fontSize:11.5, italic:true, color:C.muted, margin:0 }));
  s.addShape(pres.shapes.RECTANGLE, { x:cx+0.35, y:5.7, w:cw-0.7, h:0.65, fill:{color:C.forest} });
  s.addText("valor do fluxo = nº de pares = RESPOSTA",
    mk({ x:cx+0.35, y:5.7, w:cw-0.7, h:0.65, fontSize:13, bold:true, color:"FFFFFF",
      align:"center", valign:"middle", margin:0 }));
})();

/* ====== SLIDE 5 — ESTRATEGIA: ESCOLHA DO ALGORITMO (1 min) ====== */
(() => {
  const s = pres.addSlide(); bg(s, C.cream);
  header(s, "3 · até 1 minuto", "Estratégia: qual algoritmo de fluxo máximo?");

  const card = (x, titulo, tcolor, linhas) => {
    const cw=5.7;
    s.addShape(pres.shapes.RECTANGLE, { x, y:1.75, w:cw, h:3.0, fill:{color:"FFFFFF"},
      line:{color:C.mossLt, width:1.5} });
    s.addShape(pres.shapes.RECTANGLE, { x, y:1.75, w:cw, h:0.65, fill:{color:tcolor} });
    s.addText(titulo, mk({ x:x+0.3, y:1.75, w:cw-0.6, h:0.65, fontSize:16, bold:true,
      color:"FFFFFF", valign:"middle", margin:0 }));
    s.addText(linhas.map((t,i)=>({ text:t, options:{ bullet:{indent:16}, breakLine:true,
      paraSpaceAfter:6 } })), mk({ x:x+0.3, y:2.6, w:cw-0.6, h:2.0, fontSize:13.5, margin:0 }));
  };
  card(0.6, "Ford-Fulkerson (DFS)", C.muted, [
    "caminho aumentante por busca simples (DFS)",
    "ok em redes pequenas / capacidades unitárias",
    "DFS pode escolher caminhos ruins" ]);
  card(7.0, "Edmonds-Karp (BFS)  ✓ escolhido", C.forest, [
    "caminho aumentante sempre pela BFS (mais curto em nº de arestas)",
    "comportamento previsível",
    "evita os caminhos ruins da DFS pura" ]);

  s.addShape(pres.shapes.RECTANGLE, { x:0.6, y:5.05, w:12.1, h:1.55, fill:{color:C.clayLt} });
  s.addText("Por que Edmonds-Karp?", mk({ x:0.9, y:5.2, w:11.5, h:0.4, fontSize:15,
    bold:true, color:C.clay, margin:0 }));
  s.addText([
    { text:"Capacidades unitárias", options:{ bold:true } },
    { text:" ⇒ cada caminho aumentante soma exatamente 1 ao fluxo, e o fluxo máximo é ≤ min(n, m) < 100. A BFS é previsível e folgada para n, m < 100; é a opção recomendada em caso de dúvida.", options:{} },
  ], mk({ x:0.9, y:5.6, w:11.5, h:0.9, fontSize:14, margin:0, lineSpacingMultiple:1.0 }));
})();

/* ===== SLIDE 6 — GRAFO RESIDUAL E CAMINHOS AUMENTANTES (1 min) ===== */
(() => {
  const s = pres.addSlide(); bg(s, C.cream);
  header(s, "3 · até 1 minuto", "Grafo residual e caminhos aumentantes");

  const items = [
    ["Capacidade residual", "= capacidade − fluxo. Quanto ainda cabe na aresta."],
    ["Aresta reversa (cap 0)", "cada aresta tem sua reversa; a reversa de eid é eid ^ 1."],
    ["Por que reversa?", "permite DESFAZER uma escolha: remaneja um gopher para liberar um buraco disputado."],
    ["Caminho aumentante", "BFS encontra um caminho S → T só por arestas com residual > 0."],
    ["Gargalo", "menor capacidade residual ao longo do caminho (aqui sempre 1)."],
    ["Atualização", "+gargalo na aresta direta, −gargalo na reversa."],
    ["Parada", "quando a BFS não acha mais nenhum caminho S → T no residual."],
  ];
  let y=1.7;
  items.forEach(([t,d], i) => {
    s.addShape(pres.shapes.OVAL, { x:0.65, y:y+0.02, w:0.34, h:0.34, fill:{color:C.forest} });
    s.addText(String(i+1), { x:0.65, y:y+0.02, w:0.34, h:0.34, align:"center",
      valign:"middle", fontFace:BF, fontSize:12, bold:true, color:"FFFFFF", margin:0 });
    s.addText([
      { text:t+"  ", options:{ bold:true, color:C.forest } },
      { text:d, options:{ color:C.ink } },
    ], mk({ x:1.15, y:y-0.05, w:11.4, h:0.5, fontSize:14, margin:0 }));
    y += 0.6;
  });
  s.addShape(pres.shapes.RECTANGLE, { x:0.6, y:6.05, w:12.1, h:0.85, fill:{color:C.forest} });
  s.addText([
    { text:"Por que é ótimo?  ", options:{ bold:true, color:C.mossLt } },
    { text:"Teorema fluxo-máximo / corte-mínimo: sem caminho aumentante ⇒ fluxo máximo ⇒ emparelhamento máximo.", options:{ color:"FFFFFF" } },
  ], mk({ x:0.9, y:6.05, w:11.5, h:0.85, fontSize:14, valign:"middle", margin:0 }));
})();

/* ====== SLIDE 7 — DO FLUXO À RESPOSTA (4) (1 min) ====== */
(() => {
  const s = pres.addSlide(); bg(s, C.cream);
  header(s, "4 · até 1 minuto", "Do fluxo à resposta");

  // esquerda: formula + reconstrucao
  s.addShape(pres.shapes.RECTANGLE, { x:0.6, y:1.8, w:5.7, h:1.3, fill:{color:C.forest} });
  s.addText([
    { text:"vulneráveis = ", options:{ color:C.mossLt } },
    { text:"n − fluxo máximo", options:{ bold:true, color:"FFFFFF" } },
  ], { x:0.6, y:1.8, w:5.7, h:1.3, align:"center", valign:"middle", fontFace:HF,
    fontSize:24, margin:0 });

  s.addText([
    { text:"Salvos", options:{ bold:true, color:C.forest } },
    { text:" = fluxo máximo = emparelhamento máximo.", options:{} },
  ], mk({ x:0.6, y:3.35, w:5.7, h:0.6, fontSize:15, bullet:{indent:16}, margin:0 }));
  s.addText([
    { text:"Reconstrução do pareamento", options:{ bold:true, color:C.forest } },
    { text:": as arestas gopher → buraco com fluxo > 0 dizem qual gopher foi para qual buraco.", options:{} },
  ], mk({ x:0.6, y:4.05, w:5.7, h:0.9, fontSize:15, bullet:{indent:16}, margin:0 }));
  s.addText("O enunciado pede só a quantidade ⇒ basta o valor do fluxo.",
    mk({ x:0.6, y:5.0, w:5.7, h:0.6, fontSize:13.5, italic:true, color:C.muted,
      bullet:{indent:16}, margin:0 }));

  // direita: exemplo do enunciado (tabela de alcance)
  const cx=6.7;
  s.addText("Exemplo do enunciado  ·  alcance² = (5·10)² = 2500",
    mk({ x:cx, y:1.8, w:6.0, h:0.4, fontSize:13.5, bold:true, color:C.clay, margin:0 }));
  const h=(t)=>({text:t,options:{bold:true,color:"FFFFFF",fill:{color:C.forest}}});
  const ok=(t)=>({text:t,options:{color:C.forest,bold:true,align:"center"}});
  const no=(t)=>({text:t,options:{color:C.clay,align:"center"}});
  s.addTable([
    [h(""), h("buraco 1 (100,100)"), h("buraco 2 (20,20)")],
    [{text:"gopher 1 (1,1)",options:{bold:true}}, no("19602  ✗"), ok("722  ✓")],
    [{text:"gopher 2 (2,2)",options:{bold:true}}, no("19208  ✗"), ok("648  ✓")],
  ], { x:cx, y:2.25, w:6.0, colW:[1.9,2.05,2.05], rowH:0.5, fontFace:BF, fontSize:12.5,
    color:C.ink, valign:"middle", align:"center", border:{pt:0.5,color:"D9D6C8"},
    fill:{color:"FFFFFF"} });

  s.addText("Só g1→b2 e g2→b2 são alcançáveis; buraco 1 é inalcançável e b2 só salva um.",
    mk({ x:cx, y:3.95, w:6.0, h:0.6, fontSize:13, italic:true, color:C.muted, margin:0 }));

  s.addShape(pres.shapes.RECTANGLE, { x:cx, y:4.7, w:6.0, h:1.7, fill:{color:C.clayLt} });
  s.addText([
    { text:"fluxo máximo = 1\n", options:{ bold:true, color:C.clay } },
    { text:"vulneráveis = 2 − 1 = ", options:{ color:C.ink } },
    { text:"1", options:{ bold:true, color:C.forest } },
    { text:"   ✓ (Sample Output)", options:{ color:C.forest, bold:true } },
  ], { x:cx+0.3, y:4.7, w:5.4, h:1.7, fontFace:HF, fontSize:22, valign:"middle",
    margin:0, lineSpacingMultiple:1.1 });
})();

/* ===== SLIDE 8 — COMPLEXIDADE E CASOS ESPECIAIS (5) (1 min) ===== */
(() => {
  const s = pres.addSlide(); bg(s, C.cream);
  header(s, "5 · até 1 minuto", "Complexidade e casos especiais");

  // card complexidade
  const cw=5.85;
  s.addShape(pres.shapes.RECTANGLE, { x:0.6, y:1.75, w:cw, h:4.7, fill:{color:"FFFFFF"},
    line:{color:C.mossLt, width:1.5} });
  s.addShape(pres.shapes.RECTANGLE, { x:0.6, y:1.75, w:cw, h:0.65, fill:{color:C.forest} });
  s.addText("Complexidade", mk({ x:0.9, y:1.75, w:cw-0.6, h:0.65, fontSize:16, bold:true,
    color:"FFFFFF", valign:"middle", margin:0 }));
  s.addText([
    { text:"Edmonds-Karp: ", options:{ } },
    { text:"O(V · E²)", options:{ bold:true, fontFace:MF, color:C.clay } },
    { text:"  no pior caso.", options:{ breakLine:true } },
  ], mk({ x:0.95, y:2.6, w:cw-0.7, h:0.5, fontSize:14, bullet:{indent:16}, margin:0 }));
  s.addText("V = n + m + 2  e  E = O(n·m), com n, m < 100.",
    mk({ x:0.95, y:3.15, w:cw-0.7, h:0.5, fontSize:14, fontFace:MF, margin:0 }));
  s.addText([
    { text:"Capacidades unitárias", options:{ bold:true } },
    { text:" ⇒ ≤ min(n,m) aumentos × BFS O(V+E).", options:{} },
  ], mk({ x:0.95, y:3.75, w:cw-0.7, h:0.7, fontSize:14, bullet:{indent:16}, margin:0 }));
  s.addText([
    { text:"Memória: ", options:{ bold:true } },
    { text:"dominada pela lista de arestas residuais, O(n·m).", options:{} },
  ], mk({ x:0.95, y:4.55, w:cw-0.7, h:0.7, fontSize:14, bullet:{indent:16}, margin:0 }));
  s.addText("Cada caso de teste roda praticamente instantâneo.",
    mk({ x:0.95, y:5.45, w:cw-0.7, h:0.6, fontSize:13, italic:true, color:C.muted, margin:0 }));

  // card casos especiais
  const x2=7.05;
  s.addShape(pres.shapes.RECTANGLE, { x:x2, y:1.75, w:cw, h:4.7, fill:{color:"FFFFFF"},
    line:{color:C.mossLt, width:1.5} });
  s.addShape(pres.shapes.RECTANGLE, { x:x2, y:1.75, w:cw, h:0.65, fill:{color:C.clay} });
  s.addText("Casos especiais", mk({ x:x2+0.3, y:1.75, w:cw-0.6, h:0.65, fontSize:16,
    bold:true, color:"FFFFFF", valign:"middle", margin:0 }));
  s.addText([
    "Vários casos de teste até EOF.",
    "Recursos insuficientes / buracos inalcançáveis ⇒ sobra vulnerável (coberto por n − fluxo).",
    "Comparação por distância² evita raiz e erro de ponto flutuante.",
    "Nenhum gopher alcança buraco ⇒ fluxo 0 ⇒ todos vulneráveis.",
    "INF seguro (float('inf')) usado só no cálculo do gargalo.",
    "BOM no início da entrada é ignorado por segurança.",
  ].map(t=>({ text:t, options:{ bullet:{indent:16}, breakLine:true, paraSpaceAfter:8 } })),
    mk({ x:x2+0.35, y:2.6, w:cw-0.7, h:3.7, fontSize:13.5, margin:0 }));
})();

/* ===================== SLIDE 9 — CONCLUSAO ===================== */
(() => {
  const s = pres.addSlide(); bg(s, C.dark);
  s.addText("Conclusão", mk({ x:0.7, y:1.2, w:11, h:0.9, fontSize:40, bold:true,
    fontFace:HF, color:C.cream, margin:0 }));
  s.addShape(pres.shapes.LINE, { x:0.74, y:2.15, w:3.0, h:0, line:{color:C.clay, width:2.5} });

  s.addText([
    { text:"“Esconder gophers” reduz a ", options:{ color:C.mossLt } },
    { text:"fluxo máximo bipartido com capacidades 1", options:{ bold:true, color:"FFFFFF" } },
    { text:" — solução ótima.", options:{ color:C.mossLt } },
  ], mk({ x:0.7, y:2.6, w:11.8, h:0.6, fontSize:19, bullet:{indent:18}, margin:0 }));
  s.addText([
    { text:"A resposta é direta: ", options:{ color:C.mossLt } },
    { text:"vulneráveis = n − fluxo máximo", options:{ bold:true, color:"FFFFFF", fontFace:MF } },
    { text:".", options:{ color:C.mossLt } },
  ], mk({ x:0.7, y:3.35, w:11.8, h:0.6, fontSize:19, bullet:{indent:18}, margin:0 }));
  s.addText([
    { text:"Edmonds-Karp com grafo residual e arestas reversas, implementado do zero", options:{ bold:true, color:"FFFFFF" } },
    { text:" (sem bibliotecas de fluxo).", options:{ color:C.mossLt } },
  ], mk({ x:0.7, y:4.1, w:11.8, h:0.6, fontSize:19, bullet:{indent:18}, margin:0 }));

  s.addShape(pres.shapes.RECTANGLE, { x:0.7, y:5.15, w:4.3, h:0.75, fill:{color:C.forest} });
  s.addText("Submissão: Accepted na UVA", mk({ x:0.7, y:5.15, w:4.3, h:0.75, fontSize:15,
    bold:true, color:"FFFFFF", align:"center", valign:"middle", margin:0 }));

  s.addText("Grupo OF  ·  Obrigado!", mk({ x:0.7, y:6.55, w:11, h:0.5, fontSize:16,
    color:C.mossLt, bold:true, margin:0 }));
})();

pres.writeFile({ fileName: "C:/Users/Davi/Desktop/T3/apresentacao/apresentacao.pptx" })
  .then(f => console.log("OK:", f));
