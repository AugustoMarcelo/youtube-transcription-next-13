'use client';

import { CheckCircle, CopySimple, XCircle } from '@phosphor-icons/react';
import Image from 'next/image';
import { useState } from 'react';

// const transcriptions = [
//   {
//     id: 1,
//     time: '00:24',
//     text: 'Lorem ipsum dolor sit amet.',
//   },
//   {
//     id: 2,
//     time: '00:24',
//     text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum ipsam placeat possimus officiis porro ratione minus, iste consequatur vel mollitia.',
//   },
//   {
//     id: 3,
//     time: '00:24',
//     text: 'Lorem ipsum dolor sit amet.',
//   },
//   {
//     id: 4,
//     time: '00:24',
//     text: 'Lorem ipsum dolor sit amet.',
//   },
// ];

interface Transcription {
  id: number;
  time: string;
  text: string;
}

export default function Home() {
  const [videoURL, setVideoURL] = useState('');
  const [wasCopyPasteTriggered, setWasCopyPasteTriggered] = useState(false);
  const [isLoadingTranscription, setIsLoadingTranscription] = useState(false);
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);

  async function onHandleTranscribe() {
    setIsLoadingTranscription(true);

    const response = await fetch('/api/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ youtubeURL: videoURL }),
    });

    const data = await response.json();

    console.log(data);
  }

  function onHandleCopyPaste() {
    setWasCopyPasteTriggered(true);

    try {
      if (!navigator.clipboard) return;

      const clipboard = navigator.clipboard;

      clipboard.writeText(
        transcriptions.reduce((prev, acc) => prev.concat(acc.text), '')
      );
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setWasCopyPasteTriggered(false);
      }, 5000);
    }
  }

  return (
    <main className="h-screen flex flex-col items-center pt-16 px-20 bg-neutral-background">
      <header className="mb-12">
        <Image
          src="/youtube-transcription-logo.svg"
          alt="YouTubeTranscription Logo"
          className="w-full h-8"
          width={252}
          height={32}
          priority
        />
      </header>

      <div className="flex gap-4 mb-10">
        <div className="relative min-w-[467px]">
          <input
            className="p-4 pr-10 w-full bg-neutral-surface-primary border-2 rounded-lg border-neutral-surface-secondary text-tipography-primary leading-6 outline-none focus:border-brand-primary underline underline-offset-4"
            type="text"
            placeholder="Paste the YouTube URL here"
            value={videoURL}
            onChange={(event) => setVideoURL(event.target.value)}
          />

          {videoURL && (
            <button
              className="flex items-center justify-center"
              type="button"
              aria-label="Clear text input"
              title="Clear text input"
              onClick={() => setVideoURL('')}
            >
              <XCircle
                className="absolute top-2 right-1 translate-y-2/4 -translate-x-2/4 text-none"
                size={24}
                color="#fff"
              />
            </button>
          )}
        </div>
        <button
          className="bg-brand-primary px-6 py-5 rounded-lg text-tipography-primary font-semibold leading-4 drop-shadow-default hover:drop-shadow-hover transition-all duration-300"
          onClick={onHandleTranscribe}
        >
          Transcribe
        </button>
      </div>

      <section className="grid grid-cols-2 gap-8 bg-neutral-surface-primary rounded-t-[64px] w-full h-full pt-14 px-10">
        <div className="flex items-center justify-center max-h-[400px] bg-neutral-background rounded-[32px] py-4 overflow-hidden">
          {isLoadingTranscription ? (
            <iframe
              className="border-none w-full h-full"
              src={videoURL.replace('watch?v=', 'embed/')}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          ) : (
            <p className="text-tipography-tertiary text-sm font-semibold">
              Paste your YouTube URL above and check the transcribed text!
            </p>
          )}
        </div>
        <div className="py-6 relative">
          {transcriptions.length && (
            <button
              className="absolute top-0 right-0 p-3 bg-neutral-surface-secondary rounded-lg"
              onClick={onHandleCopyPaste}
            >
              {wasCopyPasteTriggered ? (
                <CheckCircle className="text-tipography-primary" size={18} />
              ) : (
                <CopySimple className="text-tipography-primary" size={18} />
              )}
            </button>
          )}

          {isLoadingTranscription && <p>Loading transcriptions...</p>}

          {transcriptions.length ? (
            transcriptions.map((item) => (
              <div className="flex items-start gap-2 mb-4" key={item.id}>
                <span className="py-1 px-2 bg-neutral-surface-secondary rounded text-xs text-tipography-secondary">
                  {item.time}
                </span>
                <div className="bg-transparent px-1 rounded hover:bg-neutral-surface-tertiary transition-colors duration-200">
                  <p className="text-base text-tipography-secondary">
                    {item.text}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-tipography-tertiary text-sm text-center">
              No transcriptions found
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
