
import {useDisplayStore} from '~/utils/store';
import type {FormStep} from '~/utils/store'
import { shallow } from 'zustand/shallow';
import { useCallback } from 'react';


export const FormStepDisplay = ({
    children,
    previousButton,
    nextButton,
    activeStep
}: {
    children: JSX.Element | JSX.Element[],
    previousButton?: JSX.Element,
    nextButton: JSX.Element,
    activeStep?: FormStep,
}) => {

    const {
        currentFormStep,
      } = useDisplayStore(useCallback((state) => ({
        currentFormStep: state.currentFormStep
      }), []), shallow)

    return (
        currentFormStep === activeStep ? <div className='w-full flex flex-col justify-center items-center'>
            <div className='w-full flex flex-col items-center'>
                {children}
            </div>
            <div className={previousButton ? 'grid grid-cols-2 mt-4' : 'flex'}>
                {previousButton ?? null}
                {nextButton}
            </div>
        </div> : null
    )
}