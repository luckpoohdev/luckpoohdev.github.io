import { useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { MobileStepper, Box, Step, Paper, Button, Stepper, StepLabel, Typography } from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useTheme } from '@mui/material/styles';

import Icon from 'src/components/Icon';
import Scrollbar from 'src/components/scrollbar/Scrollbar';

import useResponsive from 'src/hooks/useResponsive';

// ----------------------------------------------------------------------

export default function Wizard({ steps, completedComponent, resettable, onCancel, onComplete, completeButtonLabel = 'Afslut' }) {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const theme = useTheme()

  const isMobile = useResponsive('down', 'sm');

  const isStepOptional = (step: number) => steps[activeStep]?.optional;

  const isStepSkipped = (step: number) => skipped.has(step);

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const nextButtons = (
    <>
      {isStepOptional(activeStep) && (
        <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
          Spring over
        </Button>
      )}
      {activeStep === steps.length - 1 ? (
          <Button variant="contained" onClick={handleNext} size={isMobile ? 'small' : 'large'} sx={{ px: isMobile ? 2 : 12 }} endIcon={<Icon name="ic_checkmark" />}>Afslut</Button>
      ) : (
          <Button variant="contained" onClick={handleNext} size={isMobile ? 'small' : 'large'} sx={{ px: isMobile ? 2 : 12 }} endIcon={<Icon name="ic_chevron_right" />}>Fortsæt</Button>
      )}
    </>
  )

  const prevButtons = (
    !activeStep ? (
      <Button color="inherit" variant="outlined" size={isMobile ? 'small' : 'large'} onClick={onCancel} sx={{ px: isMobile ? 2 : 12 }} startIcon={<Icon name="ic_close" />}>Afbryd</Button>
    ) : (
      <Button color="inherit" variant="outlined" size={isMobile ? 'small' : 'large'} onClick={handleBack} sx={{ px: isMobile ? 2 : 12 }} startIcon={<Icon name="ic_chevron_left" />}>Tilbage</Button>
    )
  )
  
  return isMobile ? (
    <Box sx={{ flexGrow: 1, height: '100%' }}>
      <Paper
        square
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          pl: 0,
          bgcolor: 'background.default',
        }}
      >
        <Typography>{steps[activeStep].label}</Typography>
      </Paper>
      <Scrollbar sx={{ height: 'calc(100% - 32px)', my: 2 }}>
        {steps[activeStep].component}
      </Scrollbar>
      <MobileStepper
        variant="text"
        steps={steps.length}
        position="static"
        activeStep={activeStep}
        nextButton={nextButtons}
        backButton={prevButtons}
      />
    </Box>
  ) : (
    <>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};

          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={step.label} {...stepProps}>
              <StepLabel {...labelProps}>{step.label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Scrollbar sx={{ height: 'calc(100% - 32px)', p: 0, my: 3, boxSizing: 'border-box' }}>
        {activeStep === steps.length ? completedComponent : steps[activeStep].component}
      </Scrollbar>
      {activeStep !== steps.length && (
        <Box sx={{ display: 'flex' }}>
          {prevButtons}
          <Box sx={{ flexGrow: 1 }} />
          {nextButtons}
        </Box>
      )}
    </>
  );
}
