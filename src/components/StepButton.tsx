import {useDisplayStore, FORM_STEPS} from '~/utils/store';
import type {FormStep} from '~/utils/store'
import { shallow } from 'zustand/shallow';
import { useCallback } from 'react';
import { VscChevronLeft, VscChevronRight } from 'react-icons/vsc';


type ButtonType = "NEXT" | "BACK" | "SUBMIT";

type ButtonState = "ENABLED" | "DISABLED";


export const StepButton = ({
    step,
    buttonType,
    buttonState
}: {
    step?: FormStep,
    buttonType: ButtonType,
    buttonState: ButtonState
}) => {

    const {
        setCurrentFormStep
      } = useDisplayStore(useCallback((state) => ({
        setCurrentFormStep: state.setCurrentFormStep
      }), []), shallow)

    return (
        <div className="w-full flex justify-center items-center pb-4">
            <button 
                type={buttonType === "SUBMIT" ? "submit" : "button"}
                className={`text-4xl px-4 py-4 dark:text-white text-slate-900 flex items-center justify-center ${buttonState === "ENABLED" ? "" : "cursor-not-allowed text-[#13131a]/25 text-[#b9b9b9] dark:text-[#afafaf]/50 dark:bg-[#24252a]"}`}
                onClick={() => {

                    if (step !== FORM_STEPS.SUBMITTED){
                        step && setCurrentFormStep(step)
                    }
                }}
                disabled={buttonState === "DISABLED"}
            >
                {
                    buttonType === "BACK" ?
                    <>
                        <VscChevronLeft/>
                         <div className="mx-2 text-xl">
                            Back
                        </div>
                    </>
                    :
                    buttonType === "NEXT" ?
                    <>
                        <div className="mx-2 text-xl">
                            Next
                        </div>
                        <VscChevronRight/>
                    </>
                    : 
                    <>
                    <div className="mx-2 text-xl">
                        Done
                    </div>
                    <VscChevronRight/>
                    </>
                }
            </button>
        </div> 
    )
}