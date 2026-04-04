import * as React from 'react';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';

export type OutlinedActionIconButtonProps = IconButtonProps;

/**
 * Icon-only control using the global MuiIconButton theme (border + surface), same as
 * «видалити учасника» on the tournament form. Use for × / dismiss / delete rows — do not
 * override background or border via `sx` unless necessary (e.g. Autocomplete clear).
 */
export function OutlinedActionIconButton(props: OutlinedActionIconButtonProps) {
  return <IconButton {...props} />;
}
