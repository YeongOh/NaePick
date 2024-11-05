'use server';

import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

export async function crawlChzzkThumbnailURL(
  chzzkClipId: string
): Promise<{ chzzkThumbnailURL: string; chzzkClipTitle: string } | undefined> {
  try {
    const chzzkClipURL = `https://chzzk.naver.com/embed/clip/${chzzkClipId}`;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(chzzkClipURL, { waitUntil: 'networkidle2' });

    const html = await page.content();
    await browser.close();
    // <a href="https://chzzk.naver.com/clips/waQESXuj99" target="_blank" rel="noreferrer" class="embed_player_title__X5lxP">진짜 할 줄 아네요</a>
    const $ = cheerio.load(html);
    const chzzkClipTitle = $(
      'div.embed_player_text_wrap__P6O1t a.embed_player_title__X5lxP'
    ).text();
    const textContentForThumbnail = $('div.pzp-pc__poster style').text();

    const chzzkThumbnailURL = textContentForThumbnail?.slice(
      textContentForThumbnail?.indexOf('https://video-phinf.pstatic.net/'),
      textContentForThumbnail?.lastIndexOf('.jpg') + 4
    );

    return { chzzkThumbnailURL, chzzkClipTitle };
  } catch (error) {
    console.error('Error fetching or parsing page:', error);
  }
}
