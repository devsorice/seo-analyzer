import puppeteer, { Browser, Page } from 'puppeteer';

export class BrowserService {
  private browser?: Browser;

  constructor(private browserDebugPort: number) {}

  async launch(): Promise<Browser> {
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        `--remote-debugging-port=${this.browserDebugPort}`,
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });
    return this.browser;
  }

  wsPort(): number {
    return this.browserDebugPort;
  }

  async close(): Promise<void> {
    if (this.browser) await this.browser.close();
  }

  async loadPage(url: string): Promise<Page> {
    if (!this.browser) {
      this.browser = await this.launch();
    }
    const page = await this.browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    return page;
  }
}