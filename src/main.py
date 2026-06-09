"""
UVA 10080 - Gopher II
Grupo F

Emparelhamento bipartido (gophers x buracos) resolvido como FLUXO MAXIMO
com o algoritmo de Edmonds-Karp (BFS no grafo residual).

Modelagem da rede de fluxo:

    fonte (S)  ->  cada gopher        capacidade 1
    gopher_i   ->  buraco_j           capacidade 1   (se o gopher alcanca o buraco)
    buraco_j   ->  sorvedouro (T)     capacidade 1

Um gopher alcanca um buraco se consegue percorrer a distancia ate ele em no
maximo 's' segundos a velocidade 'v', ou seja:

    distancia <= s * v   <=>   distancia^2 <= (s*v)^2

(comparamos os quadrados para evitar a raiz quadrada e problemas de ponto
flutuante).

O fluxo maximo = numero maximo de gophers que conseguem se salvar
(emparelhamento maximo). Como cada buraco salva no maximo um gopher e cada
gopher usa no maximo um buraco, as capacidades unitarias garantem isso.

Resposta do problema (gophers vulneraveis) = n - fluxo_maximo
"""

import sys
from collections import deque

INF = float("inf")


class RedeDeFluxo:
    """Rede de fluxo com lista de adjacencia e arestas residuais.

    Cada aresta e adicionada junto com sua aresta reversa (capacidade 0).
    Como as arestas sao guardadas em pares, a reversa de 'eid' e 'eid ^ 1'.
    Cada aresta e [destino, capacidade, fluxo]; capacidade residual = cap - fluxo.
    """

    def __init__(self, n_vertices):
        self.n = n_vertices
        self.adj = [[] for _ in range(n_vertices)]  # adj[v] = ids de arestas que saem de v
        self.arestas = []                           # cada aresta: [destino, capacidade, fluxo]

    def adicionar_aresta(self, u, v, cap):
        # aresta direta
        self.adj[u].append(len(self.arestas))
        self.arestas.append([v, cap, 0])
        # aresta reversa (residual), comeca com capacidade 0
        self.adj[v].append(len(self.arestas))
        self.arestas.append([u, 0, 0])

    def _bfs(self, s, t, vindo_de):
        """BFS no grafo residual. Preenche vindo_de[v] = id da aresta usada
        para chegar em v. Retorna True se existe caminho aumentante s -> t."""
        for i in range(self.n):
            vindo_de[i] = -1
        vindo_de[s] = -2
        fila = deque([s])
        while fila:
            u = fila.popleft()
            for eid in self.adj[u]:
                destino, cap, fluxo = self.arestas[eid]
                if vindo_de[destino] == -1 and cap - fluxo > 0:
                    vindo_de[destino] = eid
                    if destino == t:
                        return True
                    fila.append(destino)
        return False

    def fluxo_maximo(self, s, t):
        fluxo_total = 0
        vindo_de = [-1] * self.n
        while self._bfs(s, t, vindo_de):
            # 1) gargalo do caminho aumentante
            gargalo = INF
            v = t
            while v != s:
                eid = vindo_de[v]
                gargalo = min(gargalo, self.arestas[eid][1] - self.arestas[eid][2])
                v = self.arestas[eid ^ 1][0]  # origem da aresta = destino da reversa
            # 2) atualiza fluxo ao longo do caminho (e o residual nas reversas)
            v = t
            while v != s:
                eid = vindo_de[v]
                self.arestas[eid][2] += gargalo
                self.arestas[eid ^ 1][2] -= gargalo
                v = self.arestas[eid ^ 1][0]
            fluxo_total += gargalo
        return fluxo_total


def resolver_caso(n, m, s, v, gophers, buracos):
    alcance2 = (s * v) ** 2  # distancia maxima ao quadrado

    # numeracao dos vertices:
    #   0            -> fonte S
    #   1 .. n       -> gophers
    #   n+1 .. n+m   -> buracos
    #   n+m+1        -> sorvedouro T
    S = 0
    T = n + m + 1
    rede = RedeDeFluxo(n + m + 2)

    for i in range(n):
        rede.adicionar_aresta(S, 1 + i, 1)          # fonte -> gopher
    for j in range(m):
        rede.adicionar_aresta(1 + n + j, T, 1)       # buraco -> sorvedouro

    for i in range(n):
        gx, gy = gophers[i]
        for j in range(m):
            bx, by = buracos[j]
            dx = gx - bx
            dy = gy - by
            if dx * dx + dy * dy <= alcance2:
                rede.adicionar_aresta(1 + i, 1 + n + j, 1)  # gopher -> buraco alcancavel

    salvos = rede.fluxo_maximo(S, T)
    return n - salvos


def main():
    bruto = sys.stdin.buffer.read()
    if bruto.startswith(b"\xef\xbb\xbf"):  # ignora BOM, se houver
        bruto = bruto[3:]
    dados = bruto.split()
    pos = 0
    saida = []
    total = len(dados)
    while pos < total:
        n = int(dados[pos]); m = int(dados[pos + 1])
        s = float(dados[pos + 2]); v = float(dados[pos + 3])
        pos += 4

        gophers = []
        for _ in range(n):
            x = float(dados[pos]); y = float(dados[pos + 1]); pos += 2
            gophers.append((x, y))

        buracos = []
        for _ in range(m):
            x = float(dados[pos]); y = float(dados[pos + 1]); pos += 2
            buracos.append((x, y))

        saida.append(str(resolver_caso(n, m, s, v, gophers, buracos)))

    sys.stdout.write("\n".join(saida))
    if saida:
        sys.stdout.write("\n")


if __name__ == "__main__":
    main()
