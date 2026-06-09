# UVA 10080 — Gopher II
### Grupo F · Fluxo máximo / Emparelhamento bipartido

---

## 1. Contexto e objetivo (≈1 min)

- `n` gophers e `m` buracos no plano. Um falcão chega.
- Gopher se salva se alcança um buraco em **≤ s segundos** à velocidade **v**.
- **Cada buraco abriga 1 gopher.**
- **Objetivo:** minimizar gophers vulneráveis = maximizar gophers salvos.

> Alcança o buraco quando `distância ≤ s·v`, ou seja `distância² ≤ (s·v)²`
> (usamos o quadrado para não calcular raiz e evitar erro de ponto flutuante).

É um **emparelhamento bipartido** gophers ↔ buracos.

---

## 2. Modelagem como rede de fluxo (≈1 min)

```text
          cap 1               cap 1                cap 1
  (S) ───────────► gopher_i ─────────► buraco_j ─────────► (T)
                              (se alcançável)
```

| Componente | Papel no problema |
| --- | --- |
| **Origem S** | empurrar 1 unidade por gopher = "tentar salvar" |
| **gopher_i** | um vértice por gopher |
| **buraco_j** | um vértice por buraco |
| **Sorvedouro T** | chegar em T = gopher escondido (salvo) |
| `S→gopher` cap 1 | gopher se salva no máximo 1 vez |
| `gopher→buraco` cap 1 | só existe se alcança; é uma fuga válida |
| `buraco→T` cap 1 | buraco abriga no máximo 1 gopher |

**Capacidade unitária = cada restrição do enunciado.**

---

## 3. Algoritmo e grafo residual (≈1 min)

- **Edmonds-Karp** = Ford-Fulkerson com **BFS** para achar caminho aumentante.
- Cada aresta tem uma **aresta reversa** (cap 0); residual = `capacidade − fluxo`.
- A cada caminho: calcula o **gargalo**, soma na aresta, subtrai na reversa
  (`arestas[eid ^ 1]`).
- A **reversa permite remanejar** um gopher já alocado para liberar um buraco —
  é o que garante emparelhamento **máximo**, não guloso.
- **Para** quando a BFS não acha mais caminho de `S` a `T`.

Capacidades todas = 1 ⇒ cada aumento soma 1; ideal para BFS, previsível.

---

## 4. Do fluxo para a resposta (≈1 min)

```text
gophers_salvos      = fluxo máximo (emparelhamento máximo)
gophers_vulneráveis = n − fluxo máximo      ← resposta impressa
```

**Exemplo do enunciado** (`s·v = 50`, alcance² = 2500):

- só `g1→b2` e `g2→b2` são alcançáveis; buraco 1 inalcançável.
- ambos disputam o buraco 2 ⇒ fluxo máximo = **1**.
- vulneráveis = `2 − 1 = 1`. ✔

---

## 5. Complexidade e casos especiais (≈1 min)

- Edmonds-Karp: `O(V·E²)`; aqui `V = n+m+2`, `E = O(n·m)`, `n,m < 100` ⇒ rápido.
- Como cap = 1: ≤ `min(n,m)` aumentos × BFS `O(V+E)`.
- **Memória:** lista de arestas residuais, `O(n·m)`.

**Casos especiais:**
- vários casos de teste até EOF;
- menos buracos / buracos inalcançáveis ⇒ sobra vulnerável (coberto por `n−fluxo`);
- comparação por distância² (sem raiz);
- nenhum gopher alcança buraco ⇒ fluxo 0 ⇒ todos vulneráveis.

---

## Conclusão

Reduzir "esconder gophers" a **fluxo máximo bipartido com capacidades 1** resolve
o problema de forma ótima; a resposta é simplesmente `n − fluxo`.
