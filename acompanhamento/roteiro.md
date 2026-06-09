# Ficha de Acompanhamento — UVA 10080 Gopher II (Grupo F)

## 1. Resumo do problema (linguagem própria)

Existem `n` gophers e `m` buracos espalhados num plano. Um falcão aparece e
qualquer gopher que não se esconder num buraco em até `s` segundos é comido.
Todos correm à mesma velocidade `v` e **cada buraco só cabe um gopher**.
Queremos saber **quantos gophers ficam vulneráveis**, ou seja,
`n − (quantidade máxima de gophers que conseguem se esconder)`.

Um gopher consegue chegar a um buraco se a distância entre eles for percorrível
no tempo disponível:

```text
distância ≤ s · v   (equivalente a   distância² ≤ (s·v)² )
```

## 2. Interpretação da entrada e da saída

- **Entrada:** vários casos até o fim do arquivo. Cada caso:
  - linha 1: `n m s v`
  - próximas `n` linhas: coordenadas `(x, y)` dos gophers
  - próximas `m` linhas: coordenadas `(x, y)` dos buracos
- **Saída:** uma linha por caso = número de gophers vulneráveis.

## 3. Modelagem da rede de fluxo

Emparelhamento bipartido **gophers × buracos** reduzido a **fluxo máximo**.

- **Origem `S`:** de onde sai o fluxo. Uma unidade que sai de `S` por um gopher
  significa "tentar salvar esse gopher".
- **Camada 1 — gophers:** um vértice por gopher.
- **Camada 2 — buracos:** um vértice por buraco.
- **Sorvedouro `T`:** chegar em `T` = gopher conseguiu um buraco (está salvo).

Arestas e capacidades:

| Aresta | Capacidade | Significado |
| --- | --- | --- |
| `S → gopher_i` | 1 | cada gopher se salva no máximo uma vez |
| `gopher_i → buraco_j` | 1 | só existe se o gopher `i` alcança o buraco `j` |
| `buraco_j → T` | 1 | cada buraco abriga no máximo um gopher |

As capacidades **unitárias** garantem as duas restrições: 1 gopher por buraco e
cada gopher em 1 só buraco. O **valor do fluxo máximo = nº de gophers salvos**, e
a resposta é `n − fluxo`.

## 4. Ford-Fulkerson ou Edmonds-Karp?

Escolhemos **Edmonds-Karp** (caminho aumentante via **BFS**).

- Todas as capacidades são 1, então cada aumento soma exatamente 1 ao fluxo e o
  fluxo total é ≤ `min(n, m) < 100`.
- A BFS é previsível e evita os caminhos longos que poderiam atrapalhar uma DFS
  pura. Para o tamanho da entrada (`n, m < 100`) é folgado.
- Ford-Fulkerson com DFS resolveria também, mas Edmonds-Karp é a escolha mais
  segura/recomendada.

## 5. Instância pequena (a do enunciado)

```text
2 2 5 10
1.0 1.0      <- gopher 1
2.0 2.0      <- gopher 2
100.0 100.0  <- buraco 1
20.0 20.0    <- buraco 2
```

Alcance máximo: `s · v = 5 · 10 = 50`, logo `(s·v)² = 2500`.

Distâncias² gopher → buraco:

| | buraco 1 (100,100) | buraco 2 (20,20) |
| --- | --- | --- |
| gopher 1 (1,1) | (99²+99²)=19602 ❌ | (19²+19²)=722 ✅ |
| gopher 2 (2,2) | (98²+98²)=19208 ❌ | (18²+18²)=648 ✅ |

Só são alcançáveis: `g1→b2` e `g2→b2`. Ambos disputam o **mesmo** buraco 2; o
buraco 1 é inalcançável.

Rede resultante:

```text
S → g1 (1)      g1 → b2 (1)      b1 → T (1)
S → g2 (1)      g2 → b2 (1)      b2 → T (1)
```

## 6. Execução manual passo a passo (Edmonds-Karp)

**Fluxo inicial = 0.**

**Iteração 1 — BFS:** `S → g1 → b2 → T`.
- Gargalo = min(cap residual) = min(1, 1, 1) = **1**.
- Atualiza residual: satura `S→g1`, `g1→b2`, `b2→T`; cria fluxo reverso nessas
  arestas. **Fluxo = 1.**

**Iteração 2 — BFS:** parte de `S`.
- `S→g1` saturada (residual 0). Vai por `S→g2` (residual 1) → `g2→b2`
  (residual 1) → mas `b2→T` está **saturada** (residual 0).
- Tenta desfazer: de `b2` a única reversa é `b2→g1` (fluxo 1), levando a `g1`;
  de `g1` as saídas são `g1→b2` (já visitado) — sem progresso para `T`.
- **Não há caminho aumentante até `T`.** BFS falha.

**Condição de parada atingida.** Fluxo máximo = **1**.

> Observação: o buraco 1 é inalcançável e o buraco 2 só salva um gopher, então
> no máximo 1 gopher se salva — o algoritmo confirma isso.

## 7. Verificação da resposta final

- Gophers salvos = fluxo máximo = **1**.
- Vulneráveis = `n − fluxo = 2 − 1 = 1`.
- **Saída esperada: `1`** ✔ (igual ao Sample Output do enunciado).

Conferência com a implementação:

```bash
python src/main.py < dados/entradas_do_problema.txt   # imprime 1
```
