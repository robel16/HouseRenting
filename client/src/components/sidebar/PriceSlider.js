import { Box, Slider, Typography } from '@mui/material';
import React from 'react';
import { useValue } from '../../context/ContextProvider';

const marks = [
  { value: 0, label: 'ETB 0' },
  { value: 750, label: 'ETB 750' },
  { value: 1500, label: 'ETB 1500' },
];

const PriceSlider = () => {
  const {
    state: { priceFilter },
    dispatch,
  } = useValue();
  return (
    <Box sx={{ mt: 5, mr: 3 }}>
      <Typography>Max Price: {'ETB ' + priceFilter}</Typography>
      <Slider
        min={0}
        max={1500}
        defaultValue={1500}
        valueLabelDisplay="auto"
        marks={marks}
        value={priceFilter}
        onChange={(e, price) =>
          dispatch({ type: 'FILTER_PRICE', payload: price })
        }
      />
    </Box>
  );
};

export default PriceSlider;