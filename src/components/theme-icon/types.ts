import {InteractiveColor, StaticColor, TextColor} from '@atb/theme/colors';
import {ContrastColor} from "@atb-as/theme";

export type IconColor = StaticColor | TextColor | ContrastColor;

export type NotificationColor = IconColor | InteractiveColor;
