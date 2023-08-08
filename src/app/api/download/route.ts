import ytdl from 'ytdl-core';

import { NextResponse } from 'next/server';
import { createReadStream, createWriteStream } from 'node:fs';
import { unlink } from 'node:fs/promises';
import { Configuration, OpenAIApi } from 'openai';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

interface VerboseJSONTranscription {
  id: number;
  start: number;
  end: number;
  text: number;
}

export async function POST(request: Request) {
  const { youtubeURL } = await request.json();

  unlink('tmp/audio.mp3');

  return ytdl(youtubeURL, { filter: 'audioonly', quality: 'highest' })
    .pipe(createWriteStream('tmp/audio.mp3'))
    .on('finish', () => {
      openai
        .createTranscription(
          createReadStream('tmp/audio.mp3') as any,
          'whisper-1',
          undefined,
          'verbose_json'
        )
        .then((result) => {
          const data = result.data.segments.map(
            (item: VerboseJSONTranscription) => ({
              ...item,
            })
          );

          return NextResponse.json({ data }, { status: 200 });
        });
    });
}
