import { services } from './init';
import * as readline from "readline";
import * as fs from 'fs';
import * as path from 'path';
import { v7 } from 'uuid';

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error('Usage: ts-node src/index.ts https://example.com');
    process.exit(1);
  }
  const debug = process.argv[3] === 'debug';
  const shouldContinue = async () => await new Promise<string>((resolve) => {
    if(!debug){
      resolve('y');
      return;
    }
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Should we continue crawling? (y/n)', (answer) => {
        resolve(answer);
        rl.close();
    });
  });

  await services.browser.launch();
  try {
  
    const generator = services.crawlService.crawlWebsite(url, true);
   
    for await (const pageInfo of generator) {
        console.log(pageInfo.toJson());
        
        console.log(`Will analyze page with lighthouse ${pageInfo.url}`);
        const lighthouseResult = await services.lighthouse.audit(pageInfo.url);
        console.log(lighthouseResult);

        //we will save the full result in a local file
        const dir = path.join(__dirname, '..', 'lighthouse-results');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        const fullPageAnalysis = {
          pageInfo: pageInfo.toDictionary(),
          lighthouseResult:lighthouseResult
        }
        
        fs.writeFileSync(`${dir}/${v7()}.json`, JSON.stringify(fullPageAnalysis, null, 2));

        //We will ask the user if we should continue crawling fron the cli
        const answer = await shouldContinue();
        if (answer.toLowerCase() === 'n') {
            break;
        }
    }

  } finally {
    await services.browser.close();
  }
}

main();