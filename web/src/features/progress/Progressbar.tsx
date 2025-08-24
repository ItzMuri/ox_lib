import React, { useEffect, useRef, useState } from 'react';
import { Box, createStyles, Text } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { ProgressbarProps } from '../../typings';

const useStyles = createStyles((theme) => ({
  container: {
    width: 400,
    height: 17,
    transform: 'skewX(50deg)',
    background: `repeating-linear-gradient(
      80deg,
      rgb(45, 55, 72),
      rgb(45, 55, 72) 4.4px,
      transparent 12px,
      transparent 4px
    )`,
    border: `2px solid ${theme.colors.grey[5]}`,
  },
  wrapper: {
    position: 'fixed',
    bottom: 50,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'auto',
    height: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bar: {
    height: '100%',
    background: 'linear-gradient(90deg, rgb(45, 55, 72) 2.57%, #56fdfd 102.99%)',
    boxShadow: '0 0 10px #0099adda',
    position: 'relative',
    width: '0%',
    transition: 'width 0.1s linear',
  },
  labelWrapper: {
    position: 'absolute',
    bottom: '80%',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    padding: '0 10px',
  },
  label: {
    fontSize: 21,
    color: 'white',
    fontFamily: 'Bebas Neue',
    textShadow: theme.shadows.sm,
    textAlign: 'left',
  },
  value: {
    fontSize: 18,
    color: 'cyan',
    margin: 8,
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'bold',
    textAlign: 'right',
    textShadow: theme.shadows.sm,
  },
}));

const Progressbar: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState('');
  const [duration, setDuration] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useNuiEvent('progressCancel', () => setVisible(false));

  useNuiEvent<ProgressbarProps>('progress', (data) => {
    setVisible(true);
    setLabel(data.label);
    setDuration(data.duration);
    setTimeLeft(data.duration / 1000);

    if (intervalRef.current) clearInterval(intervalRef.current);

    let remainingTime = data.duration / 1000;

    intervalRef.current = setInterval(() => {
      remainingTime -= 0.1;
      setTimeLeft(Math.max(remainingTime, 0));

      if (remainingTime <= 0) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setVisible(false);
        fetchNui('progressComplete');
      }
    }, 100);
  });

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <Box className={classes.wrapper}>
        <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
          <Box className={classes.labelWrapper}>
            <Text className={classes.label}>{label}</Text>
            <Text className={classes.value}>{Math.round(100 - (timeLeft / (duration / 1000)) * 100)}%</Text>
          </Box>
          <Box className={classes.container}>
            <Box
              className={classes.bar}
              sx={{
                width: `${100 - (timeLeft / (duration / 1000)) * 100}%`,
              }}
            ></Box>
          </Box>
        </ScaleFade>
      </Box>
    </>
  );
};

export default Progressbar;
