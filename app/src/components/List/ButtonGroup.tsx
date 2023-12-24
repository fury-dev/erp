import React from 'react';
import { Button, ButtonProps, Grid, ButtonGroup as MUIButtonGroup } from '@mui/material';
import { produce } from 'immer';
export type IButtons = {
  title: string;
  color?: string;
  rest?: ButtonProps;
  icon?: React.ReactNode;
  pos?: 'left' | 'right';
};
export const ButtonGroup = ({ buttons, spacing = true, ...rest }: { buttons: IButtons[]; spacing?: boolean; rest?: any }) => {
  const processButtons = buttons.map((value, index) => {
    if (value.icon) {
      value = produce(value, (draft) => {
        draft.rest = {
          ...draft.rest,
          style: {
            ...(value.rest?.style || {}),
            display: 'flex',
            justifyContent: 'spaceBetween'
          }
        };
      });
    }
    return (
      <Button
        key={`header-button-${index}`}
        disableElevation
        size="large"
        type="submit"
        variant="contained"
        endIcon={value.icon}
        color="secondary"
        {...value.rest}
      >
        {value.title}
      </Button>
    );
  });
  if (!spacing)
    return (
      <MUIButtonGroup disableElevation variant="contained" aria-label="Disabled elevation buttons" {...rest}>
        {' '}
        {processButtons}
      </MUIButtonGroup>
    );

  return (
    <Grid gap={1} container xs={buttons.length}>
      {processButtons}
    </Grid>
  );
};
