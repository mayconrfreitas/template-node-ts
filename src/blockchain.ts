import { hash, hashValidado } from "./helpers";

export interface Bloco {
  header: {
    nonce: number;
    hashBloco: string;
  };
  payload: {
    sequencia: number;
    timestamp: number;
    dados: string;
    hashAnterior: string;
  };
}

export class Blockchain {
  #chain: Bloco[] = [];
  private prefixPow = '0';

  constructor(private readonly dificuldade: number = 4) {
    this.#chain.push(this.criarBlocoGenesis());
  }

  private criarBlocoGenesis(): Bloco {
    const payload: Bloco['payload'] = {
      sequencia: 0,
      timestamp: +new Date(),
      dados: 'Bloco Genesis',
      hashAnterior: ''
    };
    return {
      header: {
        nonce: 0,
        hashBloco: hash(JSON.stringify(payload))
      },
      payload
    };
  }

  get chain(): Bloco[] {
    return this.#chain;
  }

  private get ultimoBloco(): Bloco {
    return this.#chain.at(-1) as Bloco;
  }

  private hashUltimoBloco(): string {
    return this.ultimoBloco.header.hashBloco;
  }

  criarBloco(dados: any): Bloco['payload'] {
    const novoBloco: Bloco['payload'] = {
      sequencia: this.ultimoBloco.payload.sequencia + 1,
      timestamp: +new Date(),
      dados,
      hashAnterior: this.hashUltimoBloco()
    };
    console.log(`Bloco #${novoBloco.sequencia} criado: ${JSON.stringify(novoBloco)}`);

    return novoBloco;

  }


  minerarBloco(bloco: Bloco['payload']) {
    let nonce: number = 0;
    const inicio: number = +new Date();

    while (true) {
      const hashBloco: string = hash(JSON.stringify(bloco));
      const hasPow: string = hash(hashBloco + nonce);

      if (hashValidado({
        hash: hasPow,
        dificuldade: this.dificuldade,
        prefixo: this.prefixPow
      })) {
        const final: number = +new Date();
        const hashReduzido: string = hashBloco.slice(0, 12);
        const tempoMinerado: number = (final - inicio) / 1000;

        console.log(`Bloco #${bloco.sequencia} minerado: ${hashReduzido} em ${tempoMinerado} segundos. Hash ${hashReduzido} (${nonce} tentativas)`);

        return {
          blocoMinerado: {
            payload: { ...bloco },
            header: {
              nonce,
              hashBloco
            }
          }
        }
      }
      nonce++;
    }
  }

  verificarBloco(bloco: Bloco): boolean {
    if (bloco.payload.hashAnterior !== this.hashUltimoBloco()) {
      console.error(`Bloco #${bloco.payload.sequencia} inválido: O hash anterior é ${this.hashUltimoBloco()} e não ${bloco.payload.hashAnterior}`);
      return false;
    }

    const hashTeste: string = hash(hash(JSON.stringify(bloco.payload)) + bloco.header.nonce);
    if (!hashValidado({hash: hashTeste, dificuldade: this.dificuldade, prefixo: this.prefixPow})) {
	  console.error(`Bloco #${bloco.payload.sequencia} inválido: O Nonce ${bloco.header.nonce} é inválido e não pode ser verificado`);
	  return false;
    }

    return true;
  }


  enviarBloco(bloco: Bloco): Bloco[] {
    if (this.verificarBloco(bloco)) {
      this.#chain.push(bloco);
      console.log(`Bloco #${bloco.payload.sequencia} foi adicionado à blockchain: ${JSON.stringify(bloco, null, 2)})}`);

    }
    return this.#chain;
  }



}
