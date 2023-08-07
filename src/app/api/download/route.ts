import ytdl from 'ytdl-core';

import { NextRequest } from 'next/server';
import { createWriteStream, unlink } from 'node:fs';
import { Configuration, OpenAIApi } from 'openai';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function POST(request: NextRequest) {
  const { youtubeURL } = await request.json();

  unlink('tmp/audio.mp3', () => console.log('Previous audio file removed'));

  ytdl(youtubeURL, { filter: 'audioonly', quality: 'highest' })
    .on('error', () => console.log('Could not download audio'))
    .on('progress', (_: any, downloaded: number, total: number) => {
      const percentage = (downloaded / total) * 100;
      console.log(`${percentage}% completed`);
    })
    .pipe(createWriteStream('tmp/audio.mp3'));
  // .on('close', () => {
  //   openai.createTranscription(
  //     ,
  //     'whisper-1',
  //     undefined,
  //     'srt'
  //   )
  // })

  // return new NextResponse(JSON.stringify({ youtubeURL }), {
  //   status: 200,
  //   headers: { 'Content-Type': 'application/json' },
  // });
}
