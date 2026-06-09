# UVA 10080 - Gopher II (Grupo OF)

Trabalho Prático 3 — Resolução de Problemas com Grafos
Tema: **Fluxo máximo / Emparelhamento bipartido**

## Problema

- **Nome:** UVA 10080 - Gopher II
- **Link:** <https://onlinejudge.org/external/100/10080.pdf>
- **Plataforma de submissão:** <https://onlinejudge.org/>

## Integrantes do grupo OF

João Vitor Silva
Antonio Davi
Pablo Dornelles

## Linguagem

- **Python 3** (sem bibliotecas externas de grafos/fluxo).
  Usadas apenas estruturas nativas: listas e `collections.deque` para a BFS.

## Como executar

A solução lê da entrada padrão e escreve na saída padrão (formato UVA).

```bash
# a partir da raiz do repositório
python src/main.py < dados/entradas_do_problema.txt
```

No Windows (PowerShell), use redirecionamento via `cmd` para evitar que o
PowerShell insira BOM na entrada (o código também ignora BOM por segurança):

```powershell
cmd /c "python src\main.py < dados\entradas_do_problema.txt"
```

Saída esperada para `dados/entradas_do_problema.txt`:

```text
1
```

## Resumo do enunciado

Há `n` gophers e `m` buracos em coordenadas `(x, y)` distintas. Um falcão chega
e qualquer gopher que **não** alcançar um buraco em até `s` segundos fica
vulnerável. Todos correm à velocidade `v`, e **cada buraco abriga no máximo um
gopher**. Queremos minimizar o número de gophers vulneráveis — ou seja,
maximizar quantos conseguem se esconder.

Um gopher alcança um buraco quando a distância até ele é percorrível em `s`
segundos:

```text
distancia / v <= s   <=>   distancia <= s * v   <=>   distancia^2 <= (s*v)^2
```

Comparamos os **quadrados** das distâncias para não usar raiz quadrada e evitar
imprecisão de ponto flutuante.

## Entrada e saída

- **Entrada:** vários casos até EOF. Cada caso começa com `n m s v`; depois `n`
  linhas com as coordenadas dos gophers e `m` linhas com as coordenadas dos
  buracos.
- **Saída:** uma linha por caso com o número de gophers vulneráveis.

## Modelagem como rede de fluxo

O problema é um **emparelhamento bipartido** (gophers ↔ buracos) reduzido a
**fluxo máximo**.

```text
            cap 1                cap 1                 cap 1
   (S) ─────────────► gopher_i ─────────► buraco_j ─────────► (T)
   fonte                                  (se alcançável)      sorvedouro
```

- **Vértices:**
  - `S` — fonte (vértice 0).
  - `gopher_1 … gopher_n` — um vértice por gopher.
  - `buraco_1 … buraco_m` — um vértice por buraco.
  - `T` — sorvedouro (último vértice).
- **Origem (S):** ponto de partida do fluxo. Empurrar 1 unidade por gopher
  representa "tentar salvar este gopher".
- **Sorvedouro (T):** chegar em `T` significa que aquele gopher ocupou um buraco
  e está salvo. O valor do fluxo é exatamente quantos gophers chegaram a `T`.
- **Arestas e capacidades:**
  - `S → gopher_i`, capacidade **1**: cada gopher pode se salvar no máximo uma
    vez.
  - `gopher_i → buraco_j`, capacidade **1**: criada **apenas se** o gopher `i`
    alcança o buraco `j` (`dist² ≤ (s·v)²`). Representa uma fuga válida.
  - `buraco_j → T`, capacidade **1**: cada buraco abriga **no máximo um** gopher.

As capacidades unitárias nas arestas dos gophers e dos buracos são o que impõe
as duas restrições do enunciado: um gopher usa um único buraco e um buraco
recebe um único gopher.

## Algoritmo utilizado

**Edmonds-Karp** (Ford-Fulkerson com BFS para escolher o caminho aumentante).

Justificativa: como todas as capacidades são unitárias, cada caminho aumentante
adiciona exatamente 1 ao fluxo, e o fluxo máximo é no máximo `min(n, m) < 100`.
A BFS dá um comportamento previsível e mais que suficiente para o tamanho da
entrada (`n, m < 100`), além de ser a versão recomendada quando há dúvida.
Ford-Fulkerson com DFS também resolveria, mas Edmonds-Karp evita os caminhos
ruins que poderiam degradar a busca.

## Papel do grafo residual

Cada aresta `u → v` de capacidade `c` é guardada junto com uma **aresta reversa**
`v → u` de capacidade `0`. A capacidade residual de uma aresta é
`capacidade − fluxo`.

- A cada aumento de fluxo, somamos o gargalo na aresta direta e subtraímos na
  reversa (`arestas[eid ^ 1]`), já que as arestas são guardadas em pares.
- A aresta reversa permite **desfazer** uma decisão anterior: se um buraco já
  ocupado é a única forma de salvar um novo gopher, o fluxo pode voltar pela
  reversa e remanejar o gopher antigo para outro buraco (caminho aumentante).
  Isso é o que torna o emparelhamento **máximo**, e não apenas guloso.
- **Condição de parada:** quando a BFS não encontra mais nenhum caminho de `S`
  até `T` no grafo residual, o fluxo é máximo.

## Como o fluxo vira a resposta

```text
gophers_salvos = fluxo_máximo (emparelhamento máximo)
gophers_vulneráveis = n − fluxo_máximo
```

Imprimimos `n − fluxo` para cada caso. O emparelhamento em si (qual gopher foi
para qual buraco) corresponde às arestas `gopher_i → buraco_j` com fluxo
positivo; o problema só pede a quantidade, então basta o valor do fluxo.

## Complexidade

- Edmonds-Karp: `O(V · E²)` no pior caso. Aqui `V = n + m + 2` e
  `E = O(n·m)`, ambos pequenos (`< 100`), então cada caso roda praticamente
  instantâneo.
- Como as capacidades são unitárias (rede de emparelhamento), o número de
  aumentos é no máximo `min(n, m)`, cada um custando uma BFS `O(V + E)`,
  resultando em `O(min(n,m) · n · m)` por caso — muito folgado.
- **Memória:** dominada pela lista de arestas residuais, `O(n·m)` por caso.

## Casos especiais tratados

- **Vários casos de teste** até EOF.
- **Recursos insuficientes:** menos buracos que gophers (ou buracos
  inalcançáveis) ⇒ sobra vulnerável; coberto pela conta `n − fluxo`.
- **Comparação por distância ao quadrado** (`dist² ≤ (s·v)²`) para evitar raiz e
  imprecisão de ponto flutuante.
- **Sem caminho** entre `S` e `T` (nenhum gopher alcança buraco) ⇒ fluxo 0 ⇒
  todos vulneráveis.
- **BOM na entrada** é ignorado por segurança (não afeta a UVA).

## Evidência de Accepted

Ver `evidencias/accepted.png` (adicionar o print do veredito **Accepted** após a
submissão na UVA).

## Estrutura do repositório

```text
T3/
├── README.md
├── acompanhamento/
│   └── roteiro.md
├── src/
│   └── main.py
├── evidencias/
│   └── accepted.png        (adicionar após submeter)
├── apresentacao/
│   └── apresentacao.md
└── dados/
    └── entradas_do_problema.txt
```
