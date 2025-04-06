import { services } from './init';
import * as readline from "readline";

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error('Usage: ts-node src/index.ts https://example.com');
    process.exit(1);
  }

  await services.browser.launch();
  try {
  
    const generator = services.crawlService.crawlWebsite(url);
   
    for await (const pageInfo of generator) {
        console.log(pageInfo.toJson());
        //We will ask the user if we should continue crawling fron the cli
        const answer = await new Promise<string>((resolve) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question('Should we continue crawling? (y/n)', (answer) => {
                resolve(answer);
                rl.close();
            });
        });
        if (answer.toLowerCase() === 'n') {
            break;
        }
    }

  } finally {
    await services.browser.close();
  }
}

main();