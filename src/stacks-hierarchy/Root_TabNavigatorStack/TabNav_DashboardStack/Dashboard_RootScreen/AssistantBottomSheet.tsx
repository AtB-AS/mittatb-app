import React, {PropsWithChildren} from 'react';

type Props = PropsWithChildren<{}>;

// Thin pass-through. The unified `MapBottomSheet` already wraps its children
// in a `BottomSheetScrollView`, so the assistant content just needs to render
// as the sheet body.
export const AssistantBottomSheet = ({children}: Props) => <>{children}</>;
