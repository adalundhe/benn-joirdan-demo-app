import { type NextPage } from "next";
import Head from "next/head";
import {
  useFormStore, 
  useDisplayStore, 
  useFormValidationStore,
  FORM_STEPS,
  UPLOAD_STATE
} from '~/utils/store';
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  FormStepDisplay,
  StepButton,
  UploadButton
} from '~/components'

import * as Collapsible from '@radix-ui/react-collapsible';
import getConfig from 'next/config';
import { write } from "@shapes-org/node-id3";
import * as Switch from '@radix-ui/react-switch';
import { useCallback } from "react";
import { shallow } from 'zustand/shallow';
import { MdOutlineLightMode, MdDarkMode} from 'react-icons/md';
import { z } from 'zod';
import { AiFillCheckCircle } from 'react-icons/ai';
import { api } from "~/utils/api";


type RuntimeConfig = {
  publicRuntimeConfig: {
    AWS_ACCESS_KEY_ID: string,
    AWS_SECRET_ACCESS_KEY: string,
    CLOUDFLARE_ACCOUNT_ID: string,
    CLOUDFLARE_BUCKET_NAME: string,
    STORAGE_MODE: "FILESYSTEM" | "SERVERLESS"
  }
}

const { publicRuntimeConfig } = getConfig() as RuntimeConfig;

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  CLOUDFLARE_ACCOUNT_ID,
  CLOUDFLARE_BUCKET_NAME,
  STORAGE_MODE
} = publicRuntimeConfig;


const s3 = new S3Client({
  region: "auto",
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  },
  endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
});


const Home: NextPage = () => {

  const {
    artistName,
    songName,
    song,
    setArtistName,
    setSongName
  } = useFormStore(useCallback((state) => ({
    artistName: state.artistName,
    songName: state.songName,
    song: state.song,
    setArtistName: state.setArtistName,
    setSongName: state.setSongName
  }), []), shallow);

  const {
    darkMode,
    currentFormStep,
    setDarkMode,
    setOpenState,
    setCurrentFormStep
  } = useDisplayStore(useCallback((state) => ({
    darkMode: state.darkMode,
    openState: state.openState,
    currentFormStep: state.currentFormStep,
    setDarkMode: state.setDarkMode,
    setOpenState: state.setOpenState,
    setCurrentFormStep: state.setCurrentFormStep
  }), []), shallow)

  const {
    artistNameValid,
    songNameValid,
    songFileValid,
    setArtistNameValidState,
    setSongNameValidState
  } = useFormValidationStore(useCallback((state) => ({
    artistNameValid: state.artistNameValid,
    songNameValid: state.songNameValid,
    songFileValid: state.songFileValid,
    setArtistNameValidState: state.setArtistNameValidState,
    setSongNameValidState: state.setSongNameValidState
  }), []), shallow)

  const {
    setFileUploadState
  } = useDisplayStore(useCallback((state) => ({
    fileUploadState: state.fileUploadState,
    setFileUploadState: state.setFileUploadState
  }), []), shallow)

  const mutation = api.submissions.submitSong.useMutation()


  const onSubmit = async () => {

    UPLOAD_STATE.UPLOADING && setFileUploadState(UPLOAD_STATE.UPLOADING)
   
    if (STORAGE_MODE === "SERVERLESS" && songName && artistName && song){


      const timestamp = Date.now();

      const url = await getSignedUrl(
        s3,
        new PutObjectCommand({
          Bucket: CLOUDFLARE_BUCKET_NAME,
          Key: `${artistName}_${songName}_${timestamp}.mp3`.replaceAll(/\s+/g, '_'),
        }),
        {
          expiresIn: 60 * 60 * 24 * 7, // 7d
        }
      );

      const reader = new FileReader();


      console.log('HERE!')

      reader.onload = async function() {

        console.log('STARTING!')

        if (reader.result instanceof ArrayBuffer){
          const result = write({
            title: songName,
            artist: artistName
          }, reader.result);
          
          if (result instanceof Buffer){

            await fetch(url, {
              method: "PUT",
              body: result,
              headers: {
                "Content-Type": "audio/mpeg"
              }
            });
            
            UPLOAD_STATE.SUCCESS && setFileUploadState(UPLOAD_STATE.SUCCESS);
            FORM_STEPS.SUBMITTED && setCurrentFormStep(FORM_STEPS.SUBMITTED);

            console.log('DONE!')

          }

        }
      };

      reader.readAsArrayBuffer(song);

    } else if (songName && artistName && song) {


      const reader = new FileReader();
      const decoder =  new TextDecoder();

      reader.onload = async function() {

        if (reader.result instanceof ArrayBuffer){

          const decoded = await Promise.resolve(decoder.decode(reader.result))

          await mutation.mutateAsync({
            tags: {
              title: songName,
              artist: artistName
            },
            songFile: decoded
          });

          UPLOAD_STATE.SUCCESS && setFileUploadState(UPLOAD_STATE.SUCCESS);
          FORM_STEPS.SUBMITTED && setCurrentFormStep(FORM_STEPS.SUBMITTED);

        }

      }
      reader.readAsArrayBuffer(song);

    }

  }

  return (
    <>
      <Head>
        <title>Benn Jordan Demo Submission</title>
        <meta name="description" content="Site to submit demos to Benn Jordan" />
        <meta name="viewport" content="width=device-width, initial-scale=1"/> 
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`flex flex-col items-center justify-center ${darkMode ? "dark" : ""} w-full h-full`}>
        <div className="w-full h-full dark:bg-[#24252a] bg-white flex flex-col item-center justify-center">
          <div className="w-full h-full flex flex-col justify-center items-center">

            <Collapsible.Root className="w-full" open={currentFormStep !== "SUBMITTED"} onOpenChange={setOpenState}>
              <Collapsible.Content className="flex flex-col items-center justify-center gap-12 px-4 py-16 w-full">
                <form 
                  className="w-full"
                  onSubmit={(event) => {
                    event.preventDefault()
                    onSubmit().catch(err => err as Error)

                  }}
                >
                  <fieldset className="flex justify-center">
                    <FormStepDisplay 
                        activeStep={FORM_STEPS.START_SUBMISSION} 
                        nextButton={
                          <StepButton
                            step={FORM_STEPS.ENTER_ARTIST_NAME}
                            buttonType="NEXT"
                            buttonState="ENABLED"
                          />
                        }
                      >  
                        <legend className="text-4xl text-center dark:text-white text-slate-900">Submit your song!</legend>       
                      </FormStepDisplay>
                      <FormStepDisplay 
                        activeStep={FORM_STEPS.ENTER_ARTIST_NAME} 
                        previousButton={
                          <StepButton
                            step={FORM_STEPS.START_SUBMISSION}
                            buttonType="BACK"
                            buttonState="ENABLED"
                          />
                        }
                        nextButton={
                          <StepButton
                            step={FORM_STEPS.ENTER_SONG_NAME}
                            buttonType="NEXT"
                            buttonState={artistNameValid ? "ENABLED" : "DISABLED"}
                          />
                        }
                      >
                          <label htmlFor="artist-name-input" className="text-2xl mb-2 pt-4 dark:text-white text-slate-900">Artist name:</label>
                          <input 
                            defaultValue={artistName}
                            type="text"
                            minLength={1}
                            required={true}
                            id="artist-name-input" 
                            placeholder="What's your artist name?" 
                            className="text-xl focus:outline-none border-b border-b-thin border-b-slate-200 focus:border-b-slate-900 dark:border-b-white py-2 px-2 dark:bg-[#24252a] dark:text-white"
                            onChange={(event) => {

                              const validator = z.string().min(1);
                              const validationResult = validator.safeParse(event.target.value);
                              
                              setArtistNameValidState(validationResult.success)
                              setArtistName(event.target.value)
                            }}
                          />           
                      </FormStepDisplay>
                      <FormStepDisplay 
                        activeStep={FORM_STEPS.ENTER_SONG_NAME} 
                        previousButton={
                          <StepButton
                            step={FORM_STEPS.ENTER_ARTIST_NAME}
                            buttonType="BACK"
                            buttonState="ENABLED"
                          />
                        }
                        nextButton={
                          <StepButton
                            step={FORM_STEPS.UPLOAD_SONG}
                            buttonType="NEXT"
                            buttonState={songNameValid ? "ENABLED" : "DISABLED"}
                          />
                        }
                      >
                        <label htmlFor="song-name-input" className="text-2xl mb-2 pt-4 dark:text-white text-slate-900">Song name:</label>
                        <input 
                          defaultValue={songName}
                          type="text"
                          minLength={1}
                          required={true}
                          id="song-name-input" 
                          placeholder="Name that tune!"
                          className="text-xl focus:outline-none border-b border-b-thin border-b-slate-200 focus:border-b-slate-900 dark:border-b-white py-2 px-2 dark:bg-[#24252a] dark:text-white" 
                          onChange={(event) => {

                            const validator = z.string().min(1);
                            const validationResult = validator.safeParse(event.target.value);

                            setSongNameValidState(validationResult.success)
                            setSongName(event.target.value)
                          }}
                        />         
                      </FormStepDisplay>
                      <FormStepDisplay 
                        activeStep={FORM_STEPS.UPLOAD_SONG}
                        previousButton={
                          <StepButton
                            step={FORM_STEPS.ENTER_SONG_NAME}
                            buttonType="BACK"
                            buttonState="ENABLED"
                          />
                        }
                        nextButton={
                          <StepButton
                            step={FORM_STEPS.SUBMITTED}
                            buttonType="SUBMIT"
                            buttonState={songFileValid ? "ENABLED" : "DISABLED"}
                          />
                        }
                      >
                        <UploadButton/>    
                      </FormStepDisplay>
                  </fieldset>
                </form>
              </Collapsible.Content>
            </Collapsible.Root>
            {
                currentFormStep === FORM_STEPS.SUBMITTED ?
                <div className="w-full flex justify-center items-center dark:text-white">
                  <div className="text-4xl">
                    <AiFillCheckCircle/>
                  </div>
                  <div className="mx-2 text-xl">
                    Submitted! Thank you!
                  </div>
                </div> 
                :
                null
                
              }
            <div className={`w-full flex flex-col justify-center items-center  mx-8 py-8 ${darkMode ? "bg-[#24252a]" : ""}`}>
              <label htmlFor="dark-mode-switch" className={`my-2 ${darkMode ? "text-white" : ""}`}>
                {
                  darkMode ?
                  <MdDarkMode/>
                  :
                  <MdOutlineLightMode/>
                }
              </label>
              <Switch.Root className={`${darkMode ? 'SwitchRootDark' : 'SwitchRoot'}`} id="dark-mode-switch">
                <Switch.Thumb className={`${darkMode ? 'SwitchThumbDark' : 'SwitchThumb'}`} onClick={() => setDarkMode()}/>
              </Switch.Root>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
