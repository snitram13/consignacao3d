# Consignações 3D — com servidor (dados sincronizados)

Agora os dados ficam guardados **no servidor**, num ficheiro `data.json`.
Assim aparecem **iguais no telemóvel e no computador**: basta abrir o mesmo
endereço e entrar com a sua palavra-passe.

## O que está dentro

```
server.js          → o servidor (não precisa de instalar nada extra)
package.json       → configuração do projeto
public/index.html  → o app (frontend)
data.json          → criado sozinho quando guarda dados pela 1ª vez
```

## Testar no seu computador (opcional)

Precisa de ter o Node instalado (https://nodejs.org).

```bash
# dentro da pasta do projeto:
APP_PASSWORD="a-sua-palavra-passe" npm start
```

Depois abra no navegador: http://localhost:3000
Entre com a palavra-passe que escolheu.

(No Windows, em vez da linha acima, use:
`set APP_PASSWORD=a-sua-palavra-passe && npm start`)

## Pôr online (recomendado: Render — grátis)

Este projeto já traz um ficheiro `render.yaml`, por isso o Render configura
quase tudo sozinho. Só precisa de fazer isto uma vez:

1. Crie uma conta grátis em https://github.com e outra em https://render.com
   (pode entrar no Render com a conta do GitHub — é mais rápido).
2. No GitHub, crie um repositório novo e **carregue para lá esta pasta**
   (botão "Add file → Upload files", arraste todos os ficheiros).
3. No Render: **New +  →  Blueprint**.
4. Escolha o repositório que acabou de criar. O Render lê o `render.yaml`
   e preenche tudo automaticamente.
5. Ele vai pedir o valor de **APP_PASSWORD** — escreva a SUA palavra-passe.
6. Carregue em **Apply / Create**.

Em 1–2 minutos o Render dá-lhe um endereço tipo
`https://consignacoes3d.onrender.com`.
Abra esse endereço no telemóvel **e** no computador, entre com a palavra-passe
— e os dados são os mesmos nos dois.

> Plano grátis: o servidor "adormece" após uns minutos sem uso e demora
> ~30 segundos a acordar no primeiro acesso. Não perde dados. Se quiser que
> esteja sempre instantâneo, o Render tem um plano pago a partir de ~7 USD/mês.

## Importante

- **Mude a palavra-passe** (variável `APP_PASSWORD`). É ela que protege os
  seus dados. Sem ela, ninguém vê os clientes.
- O ficheiro `data.json` é a sua base de dados. Faça uma cópia de vez em
  quando (no Render pode descarregá-lo, ou guarde uma cópia local).
- Se quiser manter também a versão antiga (só num aparelho, sem servidor),
  é a que continua a funcionar sozinha abrindo o `index.html` — mas aí os
  dados NÃO sincronizam entre aparelhos.

## Como funciona (resumo)

- Ao abrir, o app pede a palavra-passe e descarrega os dados do servidor.
- Cada alteração (novo cliente, acerto, assinatura) é guardada no aparelho
  e enviada ao servidor automaticamente.
- Ao voltar ao app noutro aparelho, ele volta a buscar a versão mais recente.
- Se ficar sem internet, continua a funcionar com a cópia local e sincroniza
  assim que voltar a ligação (o indicador no topo mostra o estado).
