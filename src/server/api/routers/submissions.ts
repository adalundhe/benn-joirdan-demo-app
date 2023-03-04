import fs from 'fs'
import { z } from "zod";
import { env } from "~/env.mjs";
import { write } from "@shapes-org/node-id3";


import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const submissionsRouter = createTRPCRouter({
  submitSong: publicProcedure
    .input(z.object({ 
      tags: z.object({         
        title: z.string(),
        artist: z.string(),
      }),
      songFile: z.string()
    }))
    .mutation(async ({ input }) => {
      
      const normalizedArtistName = input.tags.title.replaceAll(/\s+/g, '_');
      const normalizedSongName = input.tags.artist.replaceAll(/\s+/g, '_')

      const submissionFilePath = `${env.SUBMISSION_STORAGE_PATH}/${normalizedArtistName}_${normalizedSongName}.mp3`;

      const encoder = new TextEncoder()
      const encoded = encoder.encode(input.songFile)
      const result = write(input.tags, encoded);
      
      if (result instanceof Buffer){
        await fs.promises.writeFile(
          submissionFilePath,
          result
        );
      }
      
      return {
        ...input.tags,
        status: 'SUCCESS'
      }
    }),
});
