/**
 * Código retirado do vídeo: https://www.youtube.com/watch?v=ztQEaQ06GYs&ab_channel=LucasSantos
 * 
 * Para rodar:
 * 1. Caso tenho faito alguma modificação no código, execute o comando: npm run build	
 * 2. Execute o comando: npm start -- [dificuldade] [numBlocos]
 * 		Exemplo: npm start -- 4 10
 * 
 */


import { Blockchain } from './blockchain';

const dificuldade = Number(process.argv[2]) || 4;
const blockchain = new Blockchain(dificuldade);

const numBlocos  = Number(process.argv[3]) || 10;
let chain = blockchain.chain;

for (let i = 1; i <= numBlocos; i++) {
	const bloco = blockchain.criarBloco(`Bloco ${i}`);
	const mineInfo = blockchain.minerarBloco(bloco);
	chain = blockchain.enviarBloco(mineInfo.blocoMinerado);
}

console.log(`--- BLOCKCHAIN ---`);
console.log(chain);