# CTR-PE Query Examples v1

## Example 1

Question:
How many work orders are currently open?

SQL:

```sql
SELECT COUNT(*)
FROM "Ordem*ervico"
WHERE status = 'ABERTA';
`*`

---

## Example 2

Question:
Wh*ch work orders are currently in ex*cution?

SQL:

```*ql
SELECT numero, titulo
FROM "Or*emServico"
WHERE status = 'EM_EXEC**AO';
```

---

## Example 3*
Question:
Which assets are curren*ly*unavailable for operation?

SQL:

*``sql
SELECT codigo, nome
FROM "At*vo"
WHERE*status = 'PARADO';
```

---

##*Example 4

Question:
*ow many assets are under maintenan*e?

SQL:

```*ql
SELECT COUNT(*)
FROM "Ativo*
WHERE status = 'EM_MANUTENCA*';
```

---

## Example 5

*uestion:
Which work orders are wai*ing for parts?

*QL:

```sql
SELECT numero, titulo
*ROM "OrdemServico"
WHERE status = **GUARDANDO_PECA';
```

---

*# Example 6

Question:
How many st*ps*are currently open?

SQL:

```sql
*ELECT COUNT(*)
FROM "ParadaAtivo"
*HERE fimEm IS NULL;
```

---

##*Example 7

Question:
*ist all open stops and their asset*.

SQL:

*``sql
SELECT
    p.id,
   *a.codigo,
    a.nome,
    p."*nicioEm"
FROM "ParadaAtivo"*p
JOIN "Ativo" a
   *ON a.id = p."ativoId"
WHERE*p."fimEm" IS NULL*
```

---

## Example 8

Question*
How many work*orders were opened in the last 30 *ays?

*QL:

```sql
SELECT COUNT(*)
FROM*"OrdemServico"
WHERE "abertaEm* >= CURRENT_DATE - INTERVAL '30 da*s*;
```

---

## Example 9

Question*
What is the total maintenance cos* by asset?

*QL:

```sql
SELECT
    a.nome*
    SUM(os."custoTotal") AS*custo_total
FROM "OrdemServico" os*JOIN "Ativo" a
    ON*a.id = os."ativoId"
GROUP BY*a.nome
ORDER BY custo_total DESC;
*`*

---

## Example 10

Question:
Wh*t is the average maintenance cost *er work order?

SQL:

```sql
SELEC* AVG("custoTotal*)
FROM "OrdemServico";
```

---

*# Example 11

Question:
Which are *he top 10 assets with the most wor* orders?

*QL:

```sql
SELECT
    a.nome*
    COUNT(os.id) AS quantidade
FR*M "Ativo" a*JOIN "OrdemServico" os
   *ON os."ativoId" = a.id
*ROUP BY a.nome
ORDER BY quantidade*DESC
LIMIT 10;
```

---

## Exampl* 12

Question:
Which assets have*CRITICA criticality?

SQL:

```sql*SELECT codigo, nome
FROM "Ativo*
WHERE criticidade = 'CRITICA';
*``

---

## Example 13

Question:
*ow many critical work orders are o*en?

SQL:

*``sql
SELECT COUNT(*)
FROM "Or*emServico"
WHERE prioridade = 'CRI*ICA*
  AND status <> 'ENCERRADA';
*``

---

## Example 14

Question:
*hat are the critical work orders c*rrently*open?

SQL:

```sql
SELECT numero,*titulo
FROM "OrdemServico"
WHERE p*ioridade*= 'CRITICA'
  AND status <>*'ENCERRADA';
```

---

## Example*15

Question:
Which materials are *elow minimum stock?

SQL:

```sql
*ELECT
    codigo,
    nome,
    "*stoqueAtual",
    "estoqueMinimo*
FROM "Material"
WHERE "estoqueAtu*l* < "estoqueMinimo";
```

*--

## Example 16

Question:
What *s the total material cost by work *rder?

SQL:

```sql
SELECT
    os.*umero,
   *SUM(osm."custoTotal") AS valor*FROM "OrdemServicoMaterial" osm
*OIN "OrdemServico" os
    ON*os.id = osm."ordemServicoId"
*ROUP BY os.numero;
```

---

## Ex*mple*17

Question:
Which work orders co*sumed the most materials?

SQL:

`*`sql
SELECT
    os.numero,
    SUM*osm.quantidade* AS quantidade
FROM "OrdemServicoM*terial" osm
JOIN "OrdemServico" os*    ON os.id = osm."ordem*ervicoId"
GROUP BY os.numero
ORDER*BY*quantidade DESC;
```

---

## Exam*le 18

Question:
How many alerts a*e currently open?

SQL:

```sql
SE*ECT COUNT(*)
FROM*"Alerta"
WHERE status = 'ABER*O';
```

---

## Example 19

*uestion:
Which critical alerts are*still unresolved*

SQL:

```sql
SELECT*titulo, tipo
FROM "Alerta"
WHERE*severidade = 'CRITICA'
  AND*status <> 'RESOLVIDO';
```

*--

## Example 20

Question:
Which*users*are technicians?

SQL:

```sql
SEL*CT nome, email
FROM "Usuario"
WHER* perfil = 'TECNICO';
```

---

## *xample 21

Question:
How many acti*e users exist*by profile?

SQL:

```sql
SELECT
*   perfil,
    COUNT(*) AS quantid*de
FROM "Usuario"
WHERE ativo = tr*e
GROUP BY*perfil;
```

---

## Example 22

Q*estion:
Which companies have the l*rgest number of assets?

SQL:

```*ql
SELECT
    e*nome,
    COUNT(a.id) AS quantidad*
FROM "Empresa" e
LEFT JOIN "At*vo" a
    ON a."empresaId* = e.id
GROUP BY e.nome
*RDER BY quantidade DESC;
```

---
*## Example 23

Question:
How many *ork orders exist by status?

SQL:
*```sql
SELECT
    status,
    COUN*(*) AS quantidade
FROM*"OrdemServico"
GROUP BY status;
``*

---

## Example 24

Question:
Wh*t is the average stop duration by *sset?

SQL:

*``sql
SELECT
    a.nome,
   *AVG(p."duracaoMinutos") AS media*minutos
FROM "ParadaAtivo"*p
JOIN "Ativo" a
    ON a*id = p."ativoId"
WHERE*p."duracaoMinutos" IS NOT NULL*GROUP BY a.nome;
```

---

##*Example 25

Question:
Which assets*generated the*highest downtime?

SQL:

```sql
SE*ECT
    a.nome,
    SUM(p."duracao*inutos") AS total_minutos
FROM "*aradaAtivo" p
JOIN "At*vo" a
    ON a.id = p*"ativoId"
WHERE p."duracaoMin*tos" IS NOT NULL
GROUP BY a.nome*ORDER BY total*minutos DESC
LIMIT 10;
```

---

#* Example 26

Question:
Which work *rders impact availability?

SQL:

*``sql
SELECT numero, titulo
FROM "*rdemServico"
WHERE "impactaDisponi*ilidade" = true;
```

---

## Exam*le 27

Question:
Which open stops *mpact availability?

SQL:

```sql
*ELECT *
FROM "ParadaAtivo"
WHERE "*imEm" IS NULL
  AND "impactaDispon*bilidade" = true;
```

---

## Exa*ple 28

Question:
Which assets are*waiting for parts?

SQL:

```sql
S*LECT codigo, nome
FROM "Ativo"
WHE*E status = 'AGUARDANDO_PECA';
```
*---

## Example 29

Question:
What*is the total maintenance cost by c*mpany?

SQL:

```sql
SELECT
    e.*ome,
    SUM(os."custoTotal") AS c*sto_total
FROM "Empresa" e
JOIN "O*demServico" os
    ON os."empresa*d" = e.id
GROUP BY e.nome*ORDER BY custo_total DESC*
```

---

## Example 30

Question*
Which assets generated the highes* maintenance cost?

SQL:

```sql
S*LECT
    a.nome,
    SUM(os."custo*otal") AS custo_total
FROM "Ativo"*a
JOIN*"OrdemServico" os
    ON os*"ativoId" = a.id
GROUP BY a.nome
O*DER BY custo_total DESC
LIMIT *0;
```

---

## Example 31

Question:
Which work orders are overdue?

SQL:

```sql
SELECT
    numero,
    titulo,
    "prazoEm"
FROM "OrdemServico"
WHERE "prazoEm" < NOW()
  AND status <> 'ENCERRADA';
```

---

## Example 32

Question:
Which alerts are related to stopped assets?

SQL:

```sql
SELECT
    titulo,
    mensagem
FROM "Alerta"
WHERE tipo = 'ATIVO_PARADO';
```