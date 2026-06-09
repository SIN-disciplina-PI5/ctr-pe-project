import type { ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

/**
 * Lightweight wrapper used by RNR components.
 * The animated version was crashing in Expo Go, so this falls back to a plain View.
 */
type NativeOnlyAnimatedViewProps = ViewProps & {
  children?: ReactNode;
  entering?: unknown;
  exiting?: unknown;
};

function NativeOnlyAnimatedView({
  children,
  entering: _entering,
  exiting: _exiting,
  ...props
}: NativeOnlyAnimatedViewProps) {
  return <View {...props}>{children}</View>;
}

export { NativeOnlyAnimatedView };
