import { AiOutlineCloudUpload } from 'react-icons/ai';

import {
    useFormStore, 
    useDisplayStore, 
    useFormValidationStore,
    UPLOAD_STATE
} from '~/utils/store';
import { useCallback } from "react";
import { shallow } from 'zustand/shallow';
import {IoIosMusicalNote} from 'react-icons/io';
import {MdOutlineError} from 'react-icons/md';
import {AiFillRocket} from 'react-icons/ai'
import { z } from 'zod';


export const UploadButton = () => {

    const {
        setSong
    } = useFormStore(useCallback((state) => ({
        setSong: state.setSong
    }), []), shallow);

    const {
        fileUploadState,
        setFileUploadState
    } = useDisplayStore(useCallback((state) => ({
        fileUploadState: state.fileUploadState,
        setFileUploadState: state.setFileUploadState
    }), []), shallow)

    const {
        setSongFileValidState
    } = useFormValidationStore(useCallback((state) => ({
        setSongFileValidState: state.setSongFileValidState
    }), []), shallow)
    

    return (
        <>
            <label 
                htmlFor="song-upload-input" 
                className={`border-b border-b-thin border-b-transparent text-2xl flex items-center justify-center cursor-pointer text-center py-4 dark:text-white text-slate-900`}
            >
                {
                    fileUploadState === "EMPTY" ?
                    <>
                        <div>Upload your song!</div>
                        <div className="mx-2">
                            <AiOutlineCloudUpload/>
                        </div>
                    </>
                    :
                    fileUploadState === "READY" ?
                    <>
                        <div>Ready to rock!</div>
                        <div className="mx-2">
                            <IoIosMusicalNote/>
                        </div>
                    </>
                    :
                    fileUploadState === "UPLOADING" ?
                    <>
                        <div>Uploading...</div>
                        <div className="mx-2">
                            <AiFillRocket/>
                        </div>
                    </>
                    :
                    <>
                        <div>Upload failed! Try again.</div>
                        <div className="mx-2">
                            <MdOutlineError/>
                        </div>
                    </>
                }
            </label>
            <input 
                required={true}
                id="song-upload-input" 
                name="uploadsong" 
                type="file" 
                className="hidden"
                onChange={(event) => {

                    const uploadedFile = event.target.files?.item(0);
        
                    const validator = z.instanceof(File);
                    const validationResult = validator.safeParse(uploadedFile) 
                    
                    setSongFileValidState(validationResult.success);

                    setSong(uploadedFile)
                    UPLOAD_STATE.READY && setFileUploadState(UPLOAD_STATE.READY)
                }}
            />
        </>
    )
}