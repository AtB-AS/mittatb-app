import {InteractiveColor, StaticColor, TextColor, StatusColor} from '@atb/theme/colors';
import {ContrastColor} from "@atb-as/theme";

export type IconColor = StaticColor | TextColor | ContrastColor | StatusColor;

export type NotificationColor = IconColor | InteractiveColor | StatusColor;
